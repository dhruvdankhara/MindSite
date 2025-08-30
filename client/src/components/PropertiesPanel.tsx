import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateComponent, removeComponent } from "../store/slices/builderSlice";

export const PropertiesPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { components, selectedComponent } = useAppSelector(
    (state) => state.builder.canvas
  );
  const [activeTab, setActiveTab] = useState<"props" | "style">("props");

  const selectedComponentData = components.find(
    (c) => c.id === selectedComponent
  );

  if (!selectedComponentData) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <div className="text-center text-gray-500 py-8">
          <div className="text-4xl mb-2">⚙️</div>
          <h3 className="font-medium mb-1">No Component Selected</h3>
          <p className="text-sm">Click on a component to edit its properties</p>
        </div>
      </div>
    );
  }

  const handlePropChange = (key: string, value: unknown) => {
    dispatch(
      updateComponent({
        id: selectedComponent!,
        updates: {
          props: {
            ...selectedComponentData.props,
            [key]: value,
          },
        },
      })
    );
  };

  const handleStyleChange = (key: string, value: string | number) => {
    dispatch(
      updateComponent({
        id: selectedComponent!,
        updates: {
          style: {
            ...selectedComponentData.style,
            [key]: value,
          },
        },
      })
    );
  };

  const handleDelete = () => {
    if (selectedComponent) {
      dispatch(removeComponent(selectedComponent));
    }
  };

  const renderPropEditor = (key: string, value: unknown) => {
    if (typeof value === "boolean") {
      return (
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => handlePropChange(key, e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            {key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}
          </span>
        </label>
      );
    }

    if (typeof value === "number") {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => handlePropChange(key, parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      );
    }

    if (Array.isArray(value)) {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}
          </label>
          <textarea
            value={value.join("\n")}
            onChange={(e) =>
              handlePropChange(key, e.target.value.split("\n").filter(Boolean))
            }
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="One item per line"
          />
        </div>
      );
    }

    // Default to text input
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())}
        </label>
        <input
          type="text"
          value={String(value)}
          onChange={(e) => handlePropChange(key, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  };

  const renderStyleEditor = (key: string, value: string | number) => {
    if (key === "display") {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Display
          </label>
          <select
            value={String(value)}
            onChange={(e) => handleStyleChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="block">Block</option>
            <option value="inline">Inline</option>
            <option value="inline-block">Inline Block</option>
            <option value="flex">Flex</option>
            <option value="grid">Grid</option>
            <option value="none">None</option>
          </select>
        </div>
      );
    }

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())}
        </label>
        <input
          type="text"
          value={String(value)}
          onChange={(e) => handleStyleChange(key, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., 10px, 1rem, #000000"
        />
      </div>
    );
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 text-sm"
            title="Delete component"
          >
            🗑️
          </button>
        </div>
        <div className="text-sm text-gray-600 mb-3">
          {selectedComponentData.type
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("props")}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === "props"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab("style")}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === "style"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Style
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === "props" && (
          <div className="space-y-4">
            {Object.entries(selectedComponentData.props).map(([key, value]) => (
              <div key={key}>{renderPropEditor(key, value)}</div>
            ))}
            {Object.keys(selectedComponentData.props).length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No editable properties
              </p>
            )}
          </div>
        )}

        {activeTab === "style" && (
          <div className="space-y-4">
            {selectedComponentData.style &&
              Object.entries(selectedComponentData.style).map(
                ([key, value]) => (
                  <div key={key}>{renderStyleEditor(key, value)}</div>
                )
              )}

            {/* Add new style */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Add Style
              </h4>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Property"
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <input
                  type="text"
                  placeholder="Value"
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <button className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                  +
                </button>
              </div>
            </div>

            {(!selectedComponentData.style ||
              Object.keys(selectedComponentData.style).length === 0) && (
              <p className="text-sm text-gray-500 text-center py-4">
                No custom styles applied
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
