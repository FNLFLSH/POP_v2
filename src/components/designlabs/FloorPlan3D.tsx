'use client';

import { useMemo, Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import { Vector3 } from 'three';
import * as THREE from 'three';

type Coordinate = [number, number];

export interface FloorPlan3DProps {
  footprint?: {
    coordinates: Coordinate[];
    properties?: {
      building_type?: string;
      name?: string;
    };
  };
  address?: string;
  onItemPlaced?: (item: { type: string; position: [number, number, number] }) => void;
}

interface PlacedItem {
  id: string;
  type: string;
  position: [number, number, number];
}

// Convert lat/lon coordinates to 3D space, centered at origin
function convertCoordinatesTo3D(coordinates: Coordinate[]): Vector3[] {
  if (coordinates.length === 0) return [];

  // Calculate center point
  const centerLon = coordinates.reduce((sum, coord) => sum + coord[0], 0) / coordinates.length;
  const centerLat = coordinates.reduce((sum, coord) => sum + coord[1], 0) / coordinates.length;

  // Convert to local 3D coordinates (normalize around center, centered at origin)
  const scale = 111000; // meters per degree
  const points = coordinates.map(([lon, lat]) => {
    // Center coordinates around origin (0,0,0)
    const x = (lon - centerLon) * scale * Math.cos((centerLat * Math.PI) / 180);
    const z = (lat - centerLat) * scale;
    return new Vector3(x, 0, z);
  });

  return points;
}

// Floor plan outline (wireframe)
function FloorPlanOutline({ points }: { points: Vector3[] }) {
  const { shape, shapeGeometry } = useMemo(() => {
    if (points.length < 3) return { shape: null, shapeGeometry: null };

    const shape = new THREE.Shape();
    const first = points[0];
    shape.moveTo(first.x, first.z);

    for (let i = 1; i < points.length; i++) {
      shape.lineTo(points[i].x, points[i].z);
    }
    shape.lineTo(first.x, first.z);

    const shapeGeometry = new THREE.ShapeGeometry(shape);
    return { shape, shapeGeometry };
  }, [points]);

  if (!shape || !shapeGeometry) return null;

  return (
    <group>
      {/* Floor outline (wireframe only) */}
      <lineSegments>
        <edgesGeometry args={[shapeGeometry]} />
        <lineBasicMaterial color="#60a5fa" linewidth={3} />
      </lineSegments>
    </group>
  );
}

// Simple 3D representation of toolkit items
function Item3D({ 
  type, 
  position 
}: { 
  type: string; 
  position: [number, number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  const getItemProps = () => {
    switch (type) {
      case 'bar':
        return { color: '#f59e0b', size: [2, 1, 1] };
      case 'stage':
        return { color: '#8b5cf6', size: [4, 0.2, 2] };
      case 'table':
        return { color: '#10b981', size: [1.5, 0.8, 1.5] };
      case 'seating':
        return { color: '#3b82f6', size: [2, 0.5, 2] };
      case 'entrance':
        return { color: '#ef4444', size: [2, 2, 0.5] };
      case 'restroom':
        return { color: '#6366f1', size: [1.5, 2, 1.5] };
      default:
        return { color: '#6b7280', size: [1, 1, 1] };
    }
  };

  const { color, size } = getItemProps();

  return (
    <group>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} transparent opacity={0.8} />
      </mesh>
      <lineSegments position={position}>
        <edgesGeometry args={[new THREE.BoxGeometry(...size)]} />
        <lineBasicMaterial color={color} linewidth={2} />
      </lineSegments>
    </group>
  );
}

function FloorPlanScene({ 
  footprint, 
  address,
  placedItems,
  onItemPlaced 
}: FloorPlan3DProps & { 
  placedItems: PlacedItem[];
  onItemPlaced?: (item: { type: string; position: [number, number, number] }) => void;
}) {
  const points = useMemo(() => {
    if (!footprint?.coordinates || footprint.coordinates.length < 3) {
      return [
        new Vector3(-5, 0, -5),
        new Vector3(5, 0, -5),
        new Vector3(5, 0, 5),
        new Vector3(-5, 0, 5),
      ];
    }
    return convertCoordinatesTo3D(footprint.coordinates);
  }, [footprint]);

  const bounds = useMemo(() => {
    if (points.length === 0) return { center: new Vector3(0, 0, 0), size: 20 };
    
    const xs = points.map(p => p.x);
    const zs = points.map(p => p.z);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minZ = Math.min(...zs);
    const maxZ = Math.max(...zs);
    
    // Floor plan is centered at origin, so center is at (0, 0, 0)
    const center = new Vector3(0, 0, 0);
    const size = Math.max(maxX - minX, maxZ - minZ) * 1.5;
    
    return { center, size };
  }, [points]);

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[bounds.size * 0.8, bounds.size * 0.6, bounds.size * 0.8]}
        fov={50}
      />
      
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <directionalLight position={[-10, 10, -10]} intensity={0.4} />

      <OrbitControls
        target={bounds.center}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={bounds.size * 0.3}
        maxDistance={bounds.size * 2}
      />

      <FloorPlanOutline points={points} />

      {/* Render placed items */}
      {placedItems.map((item) => (
        <Item3D key={item.id} type={item.type} position={item.position} />
      ))}

      {address && (
        <Text
          position={[bounds.center.x, 2, bounds.center.z]}
          fontSize={1}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {address}
        </Text>
      )}
    </>
  );
}

export function FloorPlan3D({ 
  footprint, 
  address,
  onItemPlaced 
}: FloorPlan3DProps) {
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);

  const handleItemPlace = (type: string, position: [number, number, number]) => {
    const newItem: PlacedItem = {
      id: `${type}-${Date.now()}`,
      type,
      position,
    };
    setPlacedItems([...placedItems, newItem]);
    onItemPlaced?.(newItem);
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-gray-900 to-black rounded-lg overflow-hidden">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <FloorPlanScene 
            footprint={footprint} 
            address={address}
            placedItems={placedItems}
            onItemPlaced={handleItemPlace}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

