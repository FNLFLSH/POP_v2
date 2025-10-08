'use client';

import { useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Text } from 'react-konva';

interface EventCanvasProps {
  width?: number;
  height?: number;
}

export default function EventCanvas({ width = 800, height = 600 }: EventCanvasProps) {
  const stageRef = useRef<any>(null);

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <Stage width={width} height={height} ref={stageRef}>
        <Layer>
          {/* Sample shapes for demonstration */}
          <Rect
            x={50}
            y={50}
            width={200}
            height={100}
            fill="#3b82f6"
            stroke="#1e40af"
            strokeWidth={2}
            cornerRadius={8}
          />
          <Circle
            x={400}
            y={150}
            radius={50}
            fill="#ef4444"
            stroke="#dc2626"
            strokeWidth={2}
          />
          <Text
            x={50}
            y={200}
            text="Event Canvas"
            fontSize={24}
            fontFamily="Arial"
            fill="#374151"
          />
        </Layer>
      </Stage>
    </div>
  );
}
