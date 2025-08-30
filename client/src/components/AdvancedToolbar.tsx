import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Palette,
  Type,
  Layout,
  Monitor,
  Smartphone,
  Tablet,
  Sun,
  Moon,
  Undo,
  Redo,
  Save,
  Download,
  Share2,
  Settings as SettingsIcon,
  Code,
  Eye,
} from "lucide-react";
import { toast } from "react-hot-toast";

// Add interface for ToolButton props
interface ToolButtonProps {
  tool: {
    id: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    panel?: string;
    action?: string;
    disabled?: boolean;
  };
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

// Add interface for component structure
interface ComponentProps {
  className?: string;
  text?: string;
  title?: string;
  [key: string]: any;
}

interface Component {
  type?: string;
  props?: ComponentProps;
  [key: string]: any;
}

interface WebsitePreviewProps {
  components: Component[];
}

const AdvancedToolbar = () => {
  const dispatch = useDispatch();
  const { currentProject, settings } = useSelector(
    (state: any) => state.builder
  );
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState("desktop");
  const [showPreview, setShowPreview] = useState(false);

  const tools = [
    {
      id: "design",
      icon: Palette,
      label: "Design System",
      panel: "design",
    },
    {
      id: "typography",
      icon: Type,
      label: "Typography",
      panel: "typography",
    },
    {
      id: "layout",
      icon: Layout,
      label: "Layout Tools",
      panel: "layout",
    },
    {
      id: "responsive",
      icon: Monitor,
      label: "Responsive Design",
      panel: "responsive",
    },
    {
      id: "theme",
      icon: settings.theme === "dark" ? Sun : Moon,
      label: "Theme Toggle",
      action: "toggleTheme",
    },
    {
      id: "undo",
      icon: Undo,
      label: "Undo",
      action: "undo",
      disabled: !currentProject?.history?.canUndo,
    },
    {
      id: "redo",
      icon: Redo,
      label: "Redo",
      action: "redo",
      disabled: !currentProject?.history?.canRedo,
    },
    {
      id: "save",
      icon: Save,
      label: "Save Project",
      action: "save",
    },
    {
      id: "export",
      icon: Download,
      label: "Export",
      panel: "export",
    },
    {
      id: "share",
      icon: Share2,
      label: "Share",
      panel: "share",
    },
    {
      id: "settings",
      icon: SettingsIcon,
      label: "Settings",
      panel: "settings",
    },
  ];

  const responsiveViews = [
    { id: "desktop", icon: Monitor, label: "Desktop", width: "100%" },
    { id: "tablet", icon: Tablet, label: "Tablet", width: "768px" },
    { id: "mobile", icon: Smartphone, label: "Mobile", width: "375px" },
  ];

  const handleToolClick = (tool: ToolButtonProps["tool"]) => {
    if (tool.action) {
      switch (tool.action) {
        case "toggleTheme":
          dispatch({ type: "builder/toggleTheme" });
          toast.success(
            `Switched to ${settings.theme === "dark" ? "light" : "dark"} theme`
          );
          break;
        case "undo":
          dispatch({ type: "builder/undo" });
          toast.success("Undone");
          break;
        case "redo":
          dispatch({ type: "builder/redo" });
          toast.success("Redone");
          break;
        case "save":
          handleSave();
          break;
      }
    } else if (tool.panel) {
      setActivePanel(activePanel === tool.panel ? null : tool.panel);
    }
  };

  const handleSave = async () => {
    try {
      // Save to backend
      await fetch(
        "https://mindsite.onrender.com/api/projects/" + currentProject.id,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentProject),
        }
      );
      toast.success("Project saved successfully!");
    } catch (error) {
      toast.error("Failed to save project");
    }
  };

  const handleExport = async (format: string) => {
    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          components: currentProject.components,
          settings: currentProject.settings,
          format,
        }),
      });

      const data = await response.json();

      // Download file
      const blob = new Blob([data.code], { type: data.mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.filename;
      a.click();
      URL.revokeObjectURL(url);

      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error("Export failed");
    }
  };

  const renderPanel = () => {
    switch (activePanel) {
      case "design":
        return <DesignSystemPanel />;
      case "typography":
        return <TypographyPanel />;
      case "layout":
        return <LayoutToolsPanel />;
      case "responsive":
        return <ResponsivePanel />;
      case "export":
        return <ExportPanel onExport={handleExport} />;
      case "share":
        return <SharePanel />;
      case "settings":
        return <SettingsPanel />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Main Toolbar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Left Section - Main Tools */}
          <div className="flex items-center space-x-2">
            {tools.slice(0, 4).map((tool) => (
              <ToolButton
                key={tool.id}
                tool={tool}
                isActive={activePanel === tool.panel}
                onClick={() => handleToolClick(tool)}
                disabled={undefined}
              />
            ))}

            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2" />

            {/* Responsive View Toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {responsiveViews.map((view) => (
                <button
                  key={view.id}
                  onClick={() => setViewMode(view.id)}
                  className={`p-2 rounded ${
                    viewMode === view.id
                      ? "bg-white dark:bg-gray-600 shadow"
                      : "hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                  title={view.label}
                >
                  <view.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Center Section - Project Info */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {currentProject?.name || "Untitled Project"}
            </div>

            {/* Preview Toggle */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
                showPreview
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              {showPreview ? (
                <Code className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              <span className="text-sm">
                {showPreview ? "Edit" : "Preview"}
              </span>
            </button>
          </div>

          {/* Right Section - Action Tools */}
          <div className="flex items-center space-x-2">
            {tools.slice(4).map((tool) => (
              <ToolButton
                key={tool.id}
                tool={tool}
                isActive={activePanel === tool.panel}
                onClick={() => handleToolClick(tool)}
                disabled={tool.disabled}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Responsive View Container */}
      <div className="flex-1 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        {/* Canvas Container with Responsive Frame */}
        <div className="h-full flex items-center justify-center p-8">
          <div
            className={`bg-white rounded-lg shadow-xl transition-all duration-300 ${
              viewMode === "desktop"
                ? "w-full h-full"
                : viewMode === "tablet"
                ? "w-[768px] h-[1024px]"
                : "w-[375px] h-[812px]"
            }`}
            style={{
              maxWidth: responsiveViews.find((v) => v.id === viewMode)?.width,
              transform: viewMode !== "desktop" ? "scale(0.8)" : "none",
            }}
          >
            {/* Canvas Content */}
            <div className="w-full h-full overflow-auto">
              {showPreview ? (
                <WebsitePreview components={currentProject?.components || []} />
              ) : (
                <div className="p-4">
                  {/* Regular builder canvas */}
                  <div className="text-center text-gray-500">
                    Canvas content goes here
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        {activePanel && (
          <div className="absolute top-0 right-0 w-80 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {tools.find((t) => t.panel === activePanel)?.label}
                </h3>
                <button
                  onClick={() => setActivePanel(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto h-full">{renderPanel()}</div>
          </div>
        )}
      </div>
    </>
  );
};

const ToolButton = ({ tool, isActive, onClick, disabled }: ToolButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-2 rounded-lg transition-colors ${
      isActive
        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
        : disabled
        ? "text-gray-400 cursor-not-allowed"
        : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
    }`}
    title={tool.label}
  >
    <tool.icon className="w-5 h-5" />
  </button>
);

// Design System Panel
const DesignSystemPanel = () => {
  const [activeTab, setActiveTab] = useState("colors");

  const tabs = [
    { id: "colors", label: "Colors" },
    { id: "spacing", label: "Spacing" },
    { id: "shadows", label: "Shadows" },
    { id: "borders", label: "Borders" },
  ];

  const colorPalettes = [
    {
      name: "Blue",
      primary: "#3B82F6",
      secondary: "#1E40AF",
      accent: "#60A5FA",
    },
    {
      name: "Purple",
      primary: "#8B5CF6",
      secondary: "#7C3AED",
      accent: "#A78BFA",
    },
    {
      name: "Green",
      primary: "#10B981",
      secondary: "#059669",
      accent: "#34D399",
    },
    {
      name: "Red",
      primary: "#EF4444",
      secondary: "#DC2626",
      accent: "#F87171",
    },
    {
      name: "Gray",
      primary: "#6B7280",
      secondary: "#374151",
      accent: "#9CA3AF",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow dark:bg-gray-600 dark:text-white"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Colors Tab */}
      {activeTab === "colors" && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-white">
            Color Palettes
          </h4>
          <div className="space-y-3">
            {colorPalettes.map((palette) => (
              <div
                key={palette.name}
                className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{palette.name}</span>
                  <button className="text-xs text-blue-600 hover:text-blue-700">
                    Apply
                  </button>
                </div>
                <div className="flex space-x-2">
                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: palette.primary }}
                  />
                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: palette.secondary }}
                  />
                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: palette.accent }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add other tabs content */}
    </div>
  );
};

// Typography Panel
const TypographyPanel = () => {
  const fontFamilies = [
    "Inter",
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Poppins",
    "Source Sans Pro",
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Font Family
        </label>
        <select className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700">
          {fontFamilies.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Typography Scale
        </label>
        <div className="space-y-2">
          {["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl"].map((size) => (
            <div
              key={size}
              className="flex items-center justify-between p-2 border rounded dark:border-gray-600"
            >
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {size}
              </span>
              <span className={`text-${size}`}>Sample Text</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Layout Tools Panel
const LayoutToolsPanel = () => {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
          Grid System
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4, 6, 12].map((cols) => (
            <button
              key={cols}
              className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 text-sm"
            >
              {cols} Columns
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
          Quick Layouts
        </h4>
        <div className="space-y-2">
          {[
            "Hero + 3 Features",
            "Header + Content + Footer",
            "Sidebar + Main",
            "Gallery Grid",
          ].map((layout) => (
            <button
              key={layout}
              className="w-full p-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 text-sm"
            >
              {layout}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Responsive Panel
const ResponsivePanel = () => {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
          Breakpoints
        </h4>
        <div className="space-y-3">
          {[
            { name: "Mobile", size: "< 640px", active: true },
            { name: "Tablet", size: "640px - 1024px", active: true },
            { name: "Desktop", size: "> 1024px", active: true },
          ].map((breakpoint) => (
            <div
              key={breakpoint.name}
              className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-600"
            >
              <div>
                <div className="font-medium text-sm">{breakpoint.name}</div>
                <div className="text-xs text-gray-500">{breakpoint.size}</div>
              </div>
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Export Panel
const ExportPanel = ({ onExport }: { onExport: (format: string) => void }) => {
  const formats = [
    { id: "html", name: "HTML", description: "Static HTML with CSS" },
    { id: "react", name: "React", description: "React components (JSX)" },
    { id: "vue", name: "Vue", description: "Vue.js components" },
  ];

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900 dark:text-white">
        Export Formats
      </h4>
      <div className="space-y-3">
        {formats.map((format) => (
          <button
            key={format.id}
            onClick={() => onExport(format.id)}
            className="w-full p-4 text-left border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <div className="font-medium text-sm">{format.name}</div>
            <div className="text-xs text-gray-500 mt-1">
              {format.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Share Panel
const SharePanel = () => {
  const [shareUrl, setShareUrl] = useState("");

  const generateShareUrl = () => {
    const url = `${window.location.origin}/preview/${Date.now()}`;
    setShareUrl(url);
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
          Share Project
        </h4>
        <button
          onClick={generateShareUrl}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Generate Share Link
        </button>
      </div>

      {shareUrl && (
        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">Share URL:</div>
          <div className="text-sm font-mono break-all">{shareUrl}</div>
        </div>
      )}
    </div>
  );
};

// Settings Panel
const SettingsPanel = () => {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
          Project Settings
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Name
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700"
              placeholder="My Awesome Website"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700"
              rows={3}
              placeholder="Describe your project..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Website Preview Component
const WebsitePreview = ({ components }: WebsitePreviewProps) => {
  return (
    <div className="min-h-full">
      {components.map((component, index) => (
        <div key={index} className="preview-component">
          {/* Render component based on type */}
          <div className={component.props?.className || "p-4"}>
            {component.props?.text || component.props?.title || "Component"}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdvancedToolbar;
