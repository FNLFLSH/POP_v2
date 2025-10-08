/**
 * Geometry processing utilities for building footprint simplification
 */

export interface Point {
  x: number;
  y: number;
}

export interface Polygon {
  coordinates: Point[];
  type: 'polygon';
}

export interface SimplifiedShape {
  coordinates: Point[];
  type: 'rectangle' | 'l-shape' | 'u-shape' | 'complex';
  bounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
}

/**
 * Convert geographic coordinates to normalized coordinates (0-1 range)
 */
export function normalizeCoordinates(coords: [number, number][]): Point[] {
  if (coords.length === 0) return [];
  
  const lons = coords.map(c => c[0]);
  const lats = coords.map(c => c[1]);
  
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  
  const lonRange = maxLon - minLon;
  const latRange = maxLat - minLat;
  const maxRange = Math.max(lonRange, latRange);
  
  return coords.map(([lon, lat]) => ({
    x: (lon - minLon) / maxRange,
    y: (lat - minLat) / maxRange
  }));
}

/**
 * Simplify polygon using Douglas-Peucker algorithm
 */
export function simplifyPolygon(points: Point[], tolerance: number = 0.01): Point[] {
  if (points.length <= 2) return points;
  
  // Find the point with the maximum distance from the line segment
  let maxDistance = 0;
  let maxIndex = 0;
  
  for (let i = 1; i < points.length - 1; i++) {
    const distance = perpendicularDistance(points[i], points[0], points[points.length - 1]);
    if (distance > maxDistance) {
      maxDistance = distance;
      maxIndex = i;
    }
  }
  
  // If max distance is greater than tolerance, recursively simplify
  if (maxDistance > tolerance) {
    const left = simplifyPolygon(points.slice(0, maxIndex + 1), tolerance);
    const right = simplifyPolygon(points.slice(maxIndex), tolerance);
    
    // Combine results, removing duplicate point
    return [...left.slice(0, -1), ...right];
  } else {
    // Return only the endpoints
    return [points[0], points[points.length - 1]];
  }
}

/**
 * Calculate perpendicular distance from a point to a line segment
 */
function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  const A = point.x - lineStart.x;
  const B = point.y - lineStart.y;
  const C = lineEnd.x - lineStart.x;
  const D = lineEnd.y - lineStart.y;
  
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  
  if (lenSq === 0) return Math.sqrt(A * A + B * B);
  
  const param = dot / lenSq;
  
  let xx, yy;
  if (param < 0) {
    xx = lineStart.x;
    yy = lineStart.y;
  } else if (param > 1) {
    xx = lineEnd.x;
    yy = lineEnd.y;
  } else {
    xx = lineStart.x + param * C;
    yy = lineStart.y + param * D;
  }
  
  const dx = point.x - xx;
  const dy = point.y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Detect shape type based on simplified coordinates
 */
export function detectShapeType(points: Point[]): 'rectangle' | 'l-shape' | 'u-shape' | 'complex' {
  if (points.length < 3) return 'complex';
  
  // Check if it's roughly rectangular
  if (isRoughlyRectangular(points)) {
    return 'rectangle';
  }
  
  // Check for L-shape (has a significant indentation)
  if (hasLShape(points)) {
    return 'l-shape';
  }
  
  // Check for U-shape (has two parallel sides with space between)
  if (hasUShape(points)) {
    return 'u-shape';
  }
  
  return 'complex';
}

/**
 * Check if polygon is roughly rectangular
 */
function isRoughlyRectangular(points: Point[]): boolean {
  if (points.length < 4) return false;
  
  // Calculate bounding box
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  
  const width = maxX - minX;
  const height = maxY - minY;
  const area = width * height;
  
  // Calculate actual polygon area using shoelace formula
  let actualArea = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    actualArea += points[i].x * points[j].y;
    actualArea -= points[j].x * points[i].y;
  }
  actualArea = Math.abs(actualArea) / 2;
  
  // If actual area is close to bounding box area, it's roughly rectangular
  const ratio = actualArea / area;
  return ratio > 0.8;
}

/**
 * Check for L-shape characteristics
 */
function hasLShape(points: Point[]): boolean {
  // Simplified L-shape detection
  // Look for significant indentation or corner cut
  if (points.length < 6) return false;
  
  // This is a simplified heuristic - in practice, you'd want more sophisticated analysis
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const width = Math.max(...xs) - Math.min(...xs);
  const height = Math.max(...ys) - Math.min(...ys);
  
  // Look for significant variation in the middle sections
  const midX = (Math.min(...xs) + Math.max(...xs)) / 2;
  const midY = (Math.min(...ys) + Math.max(...ys)) / 2;
  
  let indentations = 0;
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (Math.abs(p.x - midX) < width * 0.2 || Math.abs(p.y - midY) < height * 0.2) {
      indentations++;
    }
  }
  
  return indentations > 2;
}

/**
 * Check for U-shape characteristics
 */
function hasUShape(points: Point[]): boolean {
  // Simplified U-shape detection
  if (points.length < 6) return false;
  
  // Look for two roughly parallel sides with space between
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const width = Math.max(...xs) - Math.min(...xs);
  const height = Math.max(...ys) - Math.min(...ys);
  
  // This is a very simplified heuristic
  return width > height * 1.5 || height > width * 1.5;
}

/**
 * Convert simplified shape to SVG path
 */
export function shapeToSVG(shape: SimplifiedShape, width: number = 500, height: number = 500): string {
  const { coordinates, bounds } = shape;
  
  // Scale coordinates to fit within the SVG dimensions
  const scaleX = width / (bounds.maxX - bounds.minX);
  const scaleY = height / (bounds.maxY - bounds.minY);
  const scale = Math.min(scaleX, scaleY) * 0.9; // 90% to add some padding
  
  const centerX = width / 2;
  const centerY = height / 2;
  const shapeCenterX = (bounds.minX + bounds.maxX) / 2;
  const shapeCenterY = (bounds.minY + bounds.maxY) / 2;
  
  const scaledPoints = coordinates.map(point => {
    const x = centerX + (point.x - shapeCenterX) * scale;
    const y = centerY + (point.y - shapeCenterY) * scale;
    return `${x},${y}`;
  }).join(' ');
  
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <polygon points="${scaledPoints}" fill="#d1d5db" stroke="#374151" stroke-width="2" />
  </svg>`;
}
