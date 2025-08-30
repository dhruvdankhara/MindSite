import { useState } from "react";

interface ToolbarProps {
  onSave: () => void;
  onPreview: () => void;
  onExport: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;
}

export function Toolbar({
  onSave,
  onPreview,
  onExport,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isSaving,
}: ToolbarProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const toolbarItems = [
    {
      label: "Undo",
      onClick: onUndo,
      disabled: !canUndo,
      shortcut: "Ctrl+Z",
      icon: "↶",
    },
    {
      label: "Redo",
      onClick: onRedo,
      disabled: !canRedo,
      shortcut: "Ctrl+Y",
      icon: "↷",
    },
    {
      label: "Save",
      onClick: onSave,
      disabled: isSaving,
      shortcut: "Ctrl+S",
      icon: "💾",
      loading: isSaving,
    },
    {
      label: "Preview",
      onClick: onPreview,
      shortcut: "Ctrl+P",
      icon: "👁",
    },
  ];

  return (
    <div className="h-12 border-b border-border bg-background flex items-center justify-between px-4">
      <div className="flex items-center gap-1">
        {toolbarItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            disabled={item.disabled}
            title={`${item.label} (${item.shortcut})`}
            className="px-3 py-1.5 text-sm rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
          >
            <span>{item.icon}</span>
            {item.loading ? "Saving..." : item.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Export ↓
          </button>

          {showExportMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-background border border-border rounded-md shadow-lg z-50">
              <button
                onClick={() => {
                  onExport();
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent first:rounded-t-md last:rounded-b-md"
              >
                Export as HTML
              </button>
              <button
                onClick={() => {
                  // Future: Export as React component
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent text-muted-foreground cursor-not-allowed"
              >
                Export as React (Soon)
              </button>
              <button
                onClick={() => {
                  // Future: Export as Vue component
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent text-muted-foreground cursor-not-allowed"
              >
                Export as Vue (Soon)
              </button>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground">Auto-save enabled</div>
      </div>
    </div>
  );
}
