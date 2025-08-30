import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  togglePreviewMode,
  undo,
  redo,
  clearCanvas,
  setCanvasScale,
  addComponent,
} from "../store/slices/builderSlice";
import { ExportModal } from "./ExportModal";
import { createComponentFromTemplate } from "../lib/componentLibrary";

export const Toolbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isPreviewMode, canvasScale } = useAppSelector(
    (state) => state.builder.canvas
  );
  const canUndo = useAppSelector((state) => state.builder.historyIndex > 0);
  const canRedo = useAppSelector(
    (state) => state.builder.historyIndex < state.builder.history.length - 1
  );
  const [showExportModal, setShowExportModal] = useState(false);

  const handleSave = () => {
    // This would save the project
    alert("Save functionality coming soon!");
  };

  const handleLoadDemo = () => {
    // Clear existing components
    dispatch(clearCanvas());

    // Add demo components
    const demoComponents = [
      // Navigation bar
      createComponentFromTemplate({
        id: "navbar",
        name: "Navigation Bar",
        category: "Navigation",
        icon: "🧭",
        description: "Demo navigation bar",
        defaultProps: {
          className:
            "w-full bg-white shadow-md px-6 py-4 flex justify-between items-center",
          logo: "DemoSite",
          links: ["Home", "Features", "About", "Contact"],
        },
      }),

      // Hero section
      createComponentFromTemplate({
        id: "hero",
        name: "Hero Section",
        category: "Advanced",
        icon: "🦸",
        description: "Demo hero section",
        defaultProps: {
          title: "Build Amazing Websites with AI",
          subtitle:
            "Create professional websites without coding. Our AI-powered builder makes it easy.",
          buttonText: "Start Building",
          className:
            "w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-24 px-8 text-center",
        },
      }),

      // Features section
      createComponentFromTemplate({
        id: "section",
        name: "Features Section",
        category: "Layout",
        icon: "📄",
        description: "Demo features section",
        defaultProps: {
          className: "w-full py-16 px-8 bg-gray-50",
        },
      }),

      // Call to action
      createComponentFromTemplate({
        id: "section",
        name: "CTA Section",
        category: "Layout",
        icon: "📄",
        description: "Demo CTA section",
        defaultProps: {
          className: "w-full py-16 px-8 bg-blue-600 text-white text-center",
        },
      }),

      // Footer
      createComponentFromTemplate({
        id: "footer",
        name: "Footer",
        category: "Navigation",
        icon: "🦶",
        description: "Demo footer",
        defaultProps: {
          className: "w-full bg-gray-900 text-white py-8 px-8 text-center",
          text: "© 2025 DemoSite. Built with AI Website Builder.",
        },
      }),
    ];

    demoComponents.forEach((component) => {
      dispatch(addComponent(component));
    });
  };

  const zoomLevels = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Logo/Title */}
        <div className="flex items-center space-x-2">
          <div className="text-2xl">🎨</div>
          <h1 className="text-xl font-bold text-gray-900">
            AI Website Builder
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => dispatch(undo())}
            disabled={!canUndo}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded transition-colors"
            title="Undo (Ctrl+Z)"
          >
            ↶ Undo
          </button>
          <button
            onClick={() => dispatch(redo())}
            disabled={!canRedo}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded transition-colors"
            title="Redo (Ctrl+Y)"
          >
            ↷ Redo
          </button>
          <button
            onClick={() => dispatch(clearCanvas())}
            className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
            title="Clear Canvas"
          >
            🗑️ Clear
          </button>
          <button
            onClick={handleLoadDemo}
            className="px-3 py-1 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
            title="Load Demo Content"
          >
            🎬 Demo
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Zoom Control */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Zoom:</label>
          <select
            value={canvasScale}
            onChange={(e) =>
              dispatch(setCanvasScale(parseFloat(e.target.value)))
            }
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            {zoomLevels.map((level) => (
              <option key={level} value={level}>
                {Math.round(level * 100)}%
              </option>
            ))}
          </select>
        </div>

        {/* Preview Toggle */}
        <button
          onClick={() => dispatch(togglePreviewMode())}
          className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
            isPreviewMode
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {isPreviewMode ? "🎨 Edit" : "👁️ Preview"}
        </button>

        {/* Save & Export */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            💾 Save
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            📤 Export
          </button>
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  );
};
