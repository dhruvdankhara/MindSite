import React, { useState } from "react";
import {
  componentLibrary,
  componentCategories,
  createComponentFromTemplate,
} from "../lib/componentLibrary";
import type { ComponentTemplate } from "../lib/componentLibrary";
import { useAppDispatch } from "../store/hooks";
import {
  addComponent,
  setDraggedComponent,
} from "../store/slices/builderSlice";

export const ComponentLibrarySidebar: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();

  const filteredComponents = componentLibrary.filter((component) => {
    const matchesCategory =
      selectedCategory === "All" || component.category === selectedCategory;
    const matchesSearch =
      component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDragStart = (
    e: React.DragEvent,
    componentTemplate: ComponentTemplate
  ) => {
    const component = createComponentFromTemplate(componentTemplate);
    dispatch(setDraggedComponent(component));
    e.dataTransfer.setData("application/json", JSON.stringify(component));
  };

  const handleComponentClick = (componentTemplate: ComponentTemplate) => {
    const component = createComponentFromTemplate(componentTemplate);
    dispatch(addComponent(component));
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Components</h2>

        {/* Search */}
        <input
          type="text"
          placeholder="Search components..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Categories */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedCategory === "All"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {componentCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Components List */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {filteredComponents.map((component) => (
            <div
              key={component.id}
              draggable
              onDragStart={(e) => handleDragStart(e, component)}
              onClick={() => handleComponentClick(component)}
              className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{component.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-700">
                    {component.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {component.description}
                  </p>
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      {component.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredComponents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No components found</p>
            <p className="text-sm mt-1">
              Try adjusting your search or category filter
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-600 text-center">
          Drag components to canvas or click to add
        </p>
      </div>
    </div>
  );
};
