'use client';

import { useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Vector3 } from 'three';
import * as THREE from 'three';

type Coordinate = [number, number];

export interface Building3DProps {
  footprint?: {
    coordinates: Coordinate[];
    properties?: {
      building_type?: string;
      name?: string;
    };
  };
  address?: string;
  height?: number;
  wireframe?: boolean;
}

// Convert lat/lon coordinates to 3D space, centered at origin
function convertCoordinatesTo3D(coordinates: Coordinate[]): Vector3[] {
  if (coordinates.length === 0) return [];

  // Calculate center point
  const centerLon = coordinates.reduce((sum, coord) => sum + coord[0], 0) / coordinates.length;
  const centerLat = coordinates.reduce((sum, coord) => sum + coord[1], 0) / coordinates.length;

  // Convert to local 3D coordinates (normalize around center, centered at origin)
  // Scale factor: approximately 111,000 meters per degree latitude
  const scale = 111000; // meters per degree
  const points = coordinates.map(([lon, lat]) => {
    // Center coordinates around origin (0,0,0)
    const x = (lon - centerLon) * scale * Math.cos((centerLat * Math.PI) / 180);
    const z = (lat - centerLat) * scale;
    return new Vector3(x, 0, z);
  });

  return points;
}

// Create building mesh from footprint
function BuildingMesh({ 
  points, 
  height, 
  wireframe 
}: { 
  points: Vector3[]; 
  height: number; 
  wireframe: boolean;
}) {
  const { shape, extrudeGeometry, shapeGeometry } = useMemo(() => {
    if (points.length < 3) return { shape: null, extrudeGeometry: null, shapeGeometry: null };

    const shape = new THREE.Shape();
    const first = points[0];
    shape.moveTo(first.x, first.z);

    for (let i = 1; i < points.length; i++) {
      shape.lineTo(points[i].x, points[i].z);
    }
    shape.lineTo(first.x, first.z); // Close the shape

    const extrudeSettings = {
      depth: height,
      bevelEnabled: false,
    };

    const extrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const shapeGeometry = new THREE.ShapeGeometry(shape);

    return { shape, extrudeGeometry, shapeGeometry };
  }, [points, height]);

  if (!shape || !extrudeGeometry || !shapeGeometry) return null;

  return (
    <group>
      {/* Building walls (extruded shape) */}
      <mesh geometry={extrudeGeometry}>
        <meshStandardMaterial
          color={wireframe ? '#ffffff' : '#4a5568'}
          wireframe={wireframe}
          transparent={!wireframe}
          opacity={wireframe ? 1 : 0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Building outline (wireframe edges) */}
      <lineSegments>
        <edgesGeometry args={[extrudeGeometry]} />
        <lineBasicMaterial color="#60a5fa" linewidth={2} />
      </lineSegments>
    </group>
  );
}

function BuildingScene({ footprint, height, wireframe }: Building3DProps) {
  const points = useMemo(() => {
    if (!footprint?.coordinates || footprint.coordinates.length < 3) {
      // Default rectangle if no footprint
      return [
        new Vector3(-5, 0, -5),
        new Vector3(5, 0, -5),
        new Vector3(5, 0, 5),
        new Vector3(-5, 0, 5),
      ];
    }
    return convertCoordinatesTo3D(footprint.coordinates);
  }, [footprint]);

  const buildingHeight = height || 10; // Default 10 meters

  // Calculate bounding box for camera positioning
  const bounds = useMemo(() => {
    if (points.length === 0) return { center: new Vector3(0, 0, 0), size: 20 };
    
    const xs = points.map(p => p.x);
    const zs = points.map(p => p.z);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minZ = Math.min(...zs);
    const maxZ = Math.max(...zs);
    
    // Building is centered at origin, so center is at (0, buildingHeight/2, 0)
    const center = new Vector3(0, buildingHeight / 2, 0);
    const size = Math.max(maxX - minX, maxZ - minZ, buildingHeight) * 1.5;
    
    return { center, size };
  }, [points, buildingHeight]);

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[bounds.size, bounds.size * 0.8, bounds.size]}
        fov={50}
      />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, 10, -10]} intensity={0.5} />

      <OrbitControls
        target={bounds.center}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={bounds.size * 0.5}
        maxDistance={bounds.size * 2}
      />

      <BuildingMesh points={points} height={buildingHeight} wireframe={wireframe} />
    </>
  );
}

export function Building3D({ footprint, address, height, wireframe = false }: Building3DProps) {
  return (
    <div className="relative w-full h-full bg-gradient-to-b from-gray-900 to-black rounded-lg overflow-hidden">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <BuildingScene footprint={footprint} height={height} wireframe={wireframe} />
        </Suspense>
      </Canvas>
      
      {address && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-lg text-white text-sm z-10">
          {address}
        </div>
      )}
    </div>
  );
}

