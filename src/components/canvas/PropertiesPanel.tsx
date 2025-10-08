'use client';

import { useState } from 'react';
import { Settings, Palette, Type, Square, Circle } from 'lucide-react';

interface PropertiesPanelProps {
  selectedObject?: any;
}

export default function PropertiesPanel({ selectedObject }: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', icon: Settings, label: 'General' },
    { id: 'appearance', icon: Palette, label: 'Appearance' },
    { id: 'text', icon: Type, label: 'Text' },
  ];

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Properties
        </h3>
        {selectedObject && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {selectedObject.type || 'Object'} selected
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {!selectedObject ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <Square className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select an object to edit its properties</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeTab === 'general' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Position
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">X</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        defaultValue={selectedObject.x || 0}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Y</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        defaultValue={selectedObject.y || 0}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Size
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Width</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        defaultValue={selectedObject.width || 100}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Height</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        defaultValue={selectedObject.height || 100}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fill Color
                  </label>
                  <input
                    type="color"
                    className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md"
                    defaultValue={selectedObject.fill || '#3b82f6'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Stroke Color
                  </label>
                  <input
                    type="color"
                    className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md"
                    defaultValue={selectedObject.stroke || '#1e40af'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Stroke Width
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    className="w-full"
                    defaultValue={selectedObject.strokeWidth || 2}
                  />
                </div>
              </div>
            )}

            {activeTab === 'text' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Text Content
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    rows={3}
                    defaultValue={selectedObject.text || ''}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Font Size
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    defaultValue={selectedObject.fontSize || 16}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
