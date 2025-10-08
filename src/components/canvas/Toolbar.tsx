'use client';

import { useState } from 'react';
import { Square, Circle, Type, Image, Move, RotateCcw, RotateCw } from 'lucide-react';

interface ToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
}

export default function Toolbar({ selectedTool, onToolSelect }: ToolbarProps) {
  const tools = [
    { id: 'select', icon: Move, label: 'Select' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'image', icon: Image, label: 'Image' },
  ];

  const actions = [
    { id: 'undo', icon: RotateCcw, label: 'Undo' },
    { id: 'redo', icon: RotateCw, label: 'Redo' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between">
        {/* Tools */}
        <div className="flex items-center gap-2">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => onToolSelect(tool.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTool === tool.id
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tool.label}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                title={action.label}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
