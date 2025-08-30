import React, { useState } from "react";
import { useAppSelector } from "../store/hooks";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { components } = useAppSelector((state) => state.builder.canvas);
  const [exportFormat, setExportFormat] = useState<"html" | "react" | "vue">(
    "html"
  );
  const [includeAssets, setIncludeAssets] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const generateHTML = () => {
    const componentHTML = components
      .map((component) => {
        switch (component.type) {
          case "hero":
            return `
    <section class="hero bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-4 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-4">${
          component.props.title || "Hero Title"
        }</h1>
        <p class="text-xl mb-8 opacity-90">${
          component.props.subtitle || "Hero subtitle"
        }</p>
        <button class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            ${component.props.buttonText || "Get Started"}
        </button>
    </section>`;

          case "navbar":
            return `
    <nav class="w-full bg-white shadow-md px-4 py-3 flex justify-between items-center">
        <div class="font-bold text-xl">${component.props.logo || "Logo"}</div>
        <div class="flex space-x-4">
            ${(
              (component.props.links as string[]) || [
                "Home",
                "About",
                "Contact",
              ]
            )
              .map(
                (link) => `<a href="#" class="hover:text-blue-600">${link}</a>`
              )
              .join("\n            ")}
        </div>
    </nav>`;

          case "button":
            return `
    <button class="${
      component.props.className ||
      "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
    }">
        ${component.props.text || "Button"}
    </button>`;

          case "heading": {
            const level = component.props.level || 1;
            return `
    <h${level} class="${
              component.props.className || "text-3xl font-bold text-gray-900"
            }">${component.props.text || "Heading"}</h${level}>`;
          }

          case "paragraph":
            return `
    <p class="${
      component.props.className || "text-gray-700 leading-relaxed"
    }">${component.props.text || "Paragraph text"}</p>`;

          default:
            return `
    <div class="${component.props.className || "p-4 border border-gray-300"}">${
              component.props.text || "Component"
            }</div>`;
        }
      })
      .join("\n");

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', system-ui, sans-serif;
        }
    </style>
</head>
<body>
${componentHTML}

    <script>
        // Generated JavaScript
        console.log('Website generated with AI Website Builder');
        
        // Add interactive functionality
        document.addEventListener('DOMContentLoaded', function() {
            // Button click handlers
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                button.addEventListener('click', function(e) {
                    if (this.type !== 'submit') {
                        e.preventDefault();
                        console.log('Button clicked:', this.textContent);
                    }
                });
            });
        });
    </script>
</body>
</html>`;
  };

  const generateReact = () => {
    const componentJSX = components
      .map((component) => {
        switch (component.type) {
          case "hero":
            return `
  <section className="hero bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-4 text-center">
    <h1 className="text-4xl md:text-6xl font-bold mb-4">${
      component.props.title || "Hero Title"
    }</h1>
    <p className="text-xl mb-8 opacity-90">${
      component.props.subtitle || "Hero subtitle"
    }</p>
    <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
      ${component.props.buttonText || "Get Started"}
    </button>
  </section>`;

          case "navbar":
            return `
  <nav className="w-full bg-white shadow-md px-4 py-3 flex justify-between items-center">
    <div className="font-bold text-xl">${component.props.logo || "Logo"}</div>
    <div className="flex space-x-4">
      ${((component.props.links as string[]) || ["Home", "About", "Contact"])
        .map(
          (link) => `<a href="#" className="hover:text-blue-600">${link}</a>`
        )
        .join("\n      ")}
    </div>
  </nav>`;

          default:
            return `  <div className="${component.props.className || "p-4"}">${
              component.props.text || "Component"
            }</div>`;
        }
      })
      .join("\n");

    return `import React from 'react';

const GeneratedWebsite = () => {
  return (
    <div className="min-h-screen">
${componentJSX}
    </div>
  );
};

export default GeneratedWebsite;`;
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      let code = "";
      let filename = "";

      switch (exportFormat) {
        case "html":
          code = generateHTML();
          filename = "website.html";
          break;
        case "react":
          code = generateReact();
          filename = "GeneratedWebsite.jsx";
          break;
        case "vue":
          code = "<!-- Vue export coming soon -->"; // Placeholder
          filename = "GeneratedWebsite.vue";
          break;
      }

      // Create and download file
      const blob = new Blob([code], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Close modal after successful export
      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Export failed:", error);
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Export Your Website
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            Export your website as production-ready code
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Export Format */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setExportFormat("html")}
                className={`p-4 border rounded-lg text-center transition-colors ${
                  exportFormat === "html"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="text-2xl mb-2">🌐</div>
                <div className="font-medium">HTML</div>
                <div className="text-sm text-gray-500">Static website</div>
              </button>

              <button
                onClick={() => setExportFormat("react")}
                className={`p-4 border rounded-lg text-center transition-colors ${
                  exportFormat === "react"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="text-2xl mb-2">⚛️</div>
                <div className="font-medium">React</div>
                <div className="text-sm text-gray-500">Component</div>
              </button>

              <button
                onClick={() => setExportFormat("vue")}
                className={`p-4 border rounded-lg text-center transition-colors opacity-50 cursor-not-allowed ${
                  exportFormat === "vue"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300"
                }`}
                disabled
              >
                <div className="text-2xl mb-2">💚</div>
                <div className="font-medium">Vue</div>
                <div className="text-sm text-gray-500">Coming soon</div>
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Export Options
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeAssets}
                  onChange={(e) => setIncludeAssets(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Include external assets (Tailwind CSS)
                </span>
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Components to Export
            </label>
            <div className="bg-gray-50 p-4 rounded-lg">
              {components.length > 0 ? (
                <div className="space-y-2">
                  {components.map((component) => (
                    <div
                      key={component.id}
                      className="flex items-center text-sm"
                    >
                      <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                      <span className="capitalize">{component.type}</span>
                      {component.props.text &&
                      typeof component.props.text === "string" ? (
                        <span className="ml-2 text-gray-500">
                          - "{(component.props.text as string).substring(0, 30)}
                          ..."
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No components to export</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || components.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isExporting ? "Exporting..." : "📤 Export"}
          </button>
        </div>
      </div>
    </div>
  );
};
