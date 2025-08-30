import React, { useState } from "react";

export const HelpPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { key: "Ctrl + Z", action: "Undo last action" },
    { key: "Ctrl + Y", action: "Redo last action" },
    { key: "Delete", action: "Delete selected component" },
    { key: "Ctrl + S", action: "Save project" },
    { key: "Ctrl + E", action: "Export project" },
    { key: "Space", action: "Toggle preview mode" },
  ];

  const tips = [
    "Drag components from the sidebar to the canvas",
    "Click on components to edit their properties",
    "Use the AI assistant to generate content",
    "Preview your site before exporting",
    "All components are responsive by default",
    "Export as HTML, React, or Vue code",
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
        title="Help & Shortcuts"
      >
        ❓
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-25 z-40"
        onClick={() => setIsOpen(false)}
      />

      {/* Help Panel */}
      <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-xl border border-gray-200 w-80 max-h-96 overflow-y-auto z-50">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Help & Shortcuts
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Keyboard Shortcuts */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Keyboard Shortcuts
            </h4>
            <div className="space-y-2">
              {shortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-gray-600">{shortcut.action}</span>
                  <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Quick Tips</h4>
            <ul className="space-y-2">
              {tips.map((tip, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-600 flex items-start"
                >
                  <span className="text-blue-500 mr-2">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Getting Started */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Getting Started</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                  1
                </span>
                Try the "Demo" button to see example content
              </div>
              <div className="flex items-center">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                  2
                </span>
                Drag components from the left sidebar
              </div>
              <div className="flex items-center">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                  3
                </span>
                Use the AI assistant for help
              </div>
              <div className="flex items-center">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                  4
                </span>
                Preview and export your site
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              AI Website Builder MVP • Built with React & AI
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
