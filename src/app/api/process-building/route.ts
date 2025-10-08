import { NextRequest, NextResponse } from 'next/server';
import { normalizeCoordinates, simplifyPolygon, detectShapeType, shapeToSVG, SimplifiedShape } from '@/lib/geometry';

export async function POST(request: NextRequest) {
  try {
    const { coordinates } = await request.json();
    
    if (!coordinates || !Array.isArray(coordinates)) {
      return NextResponse.json({ error: 'Valid coordinates array is required' }, { status: 400 });
    }

    // Process the building footprint
    const processed = await processBuildingFootprint(coordinates);
    
    return NextResponse.json(processed);
  } catch (error) {
    console.error('Building processing error:', error);
    return NextResponse.json({ error: 'Failed to process building footprint' }, { status: 500 });
  }
}

async function processBuildingFootprint(coordinates: [number, number][]): Promise<{
  simplified: SimplifiedShape;
  svg: string;
  metadata: {
    originalPoints: number;
    simplifiedPoints: number;
    shapeType: string;
  };
}> {
  // Step 1: Normalize coordinates to 0-1 range
  const normalizedCoords = normalizeCoordinates(coordinates);
  
  // Step 2: Simplify the polygon
  const simplifiedCoords = simplifyPolygon(normalizedCoords, 0.02);
  
  // Step 3: Detect shape type
  const shapeType = detectShapeType(simplifiedCoords);
  
  // Step 4: Calculate bounds
  const xs = simplifiedCoords.map(p => p.x);
  const ys = simplifiedCoords.map(p => p.y);
  const bounds = {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys)
  };
  
  // Step 5: Create simplified shape object
  const simplifiedShape: SimplifiedShape = {
    coordinates: simplifiedCoords,
    type: shapeType,
    bounds
  };
  
  // Step 6: Generate SVG
  const svg = shapeToSVG(simplifiedShape, 500, 500);
  
  return {
    simplified: simplifiedShape,
    svg,
    metadata: {
      originalPoints: coordinates.length,
      simplifiedPoints: simplifiedCoords.length,
      shapeType
    }
  };
}
