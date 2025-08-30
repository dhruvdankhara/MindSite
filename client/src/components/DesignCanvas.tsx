import React from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addComponent,
  selectComponent,
  updateComponent,
} from "../store/slices/builderSlice";
import type { Component } from "../store/slices/builderSlice";
import { ComponentRenderer } from "./ComponentRenderer";

export const DesignCanvas: React.FC = () => {
  const dispatch = useAppDispatch();
  const { components, selectedComponent, isPreviewMode, canvasScale } =
    useAppSelector((state) => state.builder.canvas);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const componentData = e.dataTransfer.getData("application/json");
      if (componentData) {
        const component = JSON.parse(componentData);
        dispatch(addComponent(component));
      }
    } catch (error) {
      console.error("Error dropping component:", error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      dispatch(selectComponent(null));
    }
  };

  const handleComponentSelect = (id: string) => {
    dispatch(selectComponent(id));
  };

  const handleComponentUpdate = (id: string, updates: Partial<Component>) => {
    dispatch(updateComponent({ id, updates }));
  };

  return (
    <div className="flex-1 bg-gray-50 relative overflow-auto">
      {/* Canvas Header */}
      {!isPreviewMode && (
        <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Canvas</span>
            <div className="flex items-center space-x-2">
              <label className="text-xs text-gray-500">Zoom:</label>
              <span className="text-xs text-gray-700">
                {Math.round(canvasScale * 100)}%
              </span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {components.length} component{components.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}

      {/* Canvas Area */}
      <div
        className={`relative ${
          isPreviewMode ? "h-full" : "min-h-[calc(100vh-200px)]"
        } p-8`}
        style={{
          transform: `scale(${canvasScale})`,
          transformOrigin: "top left",
        }}
      >
        <div
          className={`bg-white shadow-lg mx-auto relative ${
            isPreviewMode
              ? "w-full h-full"
              : "w-full max-w-6xl min-h-[600px] border border-gray-300"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleCanvasClick}
        >
          {/* Empty State */}
          {components.length === 0 && !isPreviewMode && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-medium mb-2">
                  Start Building Your Website
                </h3>
                <p className="text-sm">
                  Drag components from the sidebar or use AI to generate content
                </p>
              </div>
            </div>
          )}

          {/* Render Components */}
          {components.map((component) => (
            <ComponentRenderer
              key={component.id}
              component={component}
              isSelected={selectedComponent === component.id}
              isPreview={isPreviewMode}
              onSelect={handleComponentSelect}
              onUpdate={handleComponentUpdate}
            />
          ))}

          {/* Drop Zone Indicator */}
          {!isPreviewMode && (
            <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-transparent transition-colors duration-200 hover:border-blue-300" />
          )}
        </div>
      </div>

      {/* Canvas Footer */}
      {!isPreviewMode && (
        <div className="bg-white border-t border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div>
              {selectedComponent
                ? `Selected: ${
                    components.find((c) => c.id === selectedComponent)?.type ||
                    "Unknown"
                  }`
                : "No component selected"}
            </div>
            <div className="flex items-center space-x-4">
              <span>Press Ctrl+Z to undo</span>
              <span>Press Ctrl+Y to redo</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
