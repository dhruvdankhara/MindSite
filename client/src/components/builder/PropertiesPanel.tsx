import { useState } from "react";
import type { Component } from "../../types";

interface PropertiesPanelProps {
  component: Component | null;
  onUpdateComponent: (id: string, updates: Partial<Component>) => void;
}

export function PropertiesPanel({
  component,
  onUpdateComponent,
}: PropertiesPanelProps) {
  const [localProps, setLocalProps] = useState(component?.props || {});

  if (!component) {
    return (
      <div className="w-80 border-l border-border bg-background p-6">
        <div className="text-center text-muted-foreground">
          <p className="mb-2">No component selected</p>
          <p className="text-sm">Select a component to edit its properties</p>
        </div>
      </div>
    );
  }

  const handleChange = (key: string, value: string | number) => {
    const updatedProps = { ...localProps, [key]: value };
    setLocalProps(updatedProps);
    onUpdateComponent(component.id, { props: updatedProps });
  };

  const renderPropertyInput = (
    key: string,
    value: string | number | undefined,
    type: string = "text"
  ) => {
    if (type === "select" && key === "level") {
      return (
        <select
          value={value || 1}
          onChange={(e) => handleChange(key, parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-input rounded-md bg-background"
        >
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <option key={level} value={level}>
              H{level}
            </option>
          ))}
        </select>
      );
    }

    if (type === "textarea") {
      return (
        <textarea
          value={value || ""}
          onChange={(e) => handleChange(key, e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[80px]"
          rows={3}
        />
      );
    }

    return (
      <input
        type={type}
        value={value || ""}
        onChange={(e) => handleChange(key, e.target.value)}
        className="w-full px-3 py-2 border border-input rounded-md bg-background"
      />
    );
  };

  const getPropertiesForComponent = () => {
    const baseProperties = [
      { key: "className", label: "CSS Classes", type: "text" },
    ];

    switch (component.type) {
      case "heading":
        return [
          { key: "text", label: "Text", type: "text" },
          { key: "level", label: "Level", type: "select" },
          ...baseProperties,
        ];

      case "paragraph":
        return [
          { key: "text", label: "Text", type: "textarea" },
          ...baseProperties,
        ];

      case "button":
        return [
          { key: "text", label: "Text", type: "text" },
          { key: "variant", label: "Variant", type: "text" },
          { key: "size", label: "Size", type: "text" },
          ...baseProperties,
        ];

      case "image":
        return [
          { key: "src", label: "Image URL", type: "url" },
          { key: "alt", label: "Alt Text", type: "text" },
          { key: "width", label: "Width", type: "text" },
          { key: "height", label: "Height", type: "text" },
          ...baseProperties,
        ];

      case "section":
        return [
          { key: "padding", label: "Padding", type: "text" },
          { key: "margin", label: "Margin", type: "text" },
          ...baseProperties,
        ];

      default:
        return baseProperties;
    }
  };

  const properties = getPropertiesForComponent();

  return (
    <div className="w-80 border-l border-border bg-background overflow-y-auto">
      <div className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <span className="w-3 h-3 bg-blue-500 rounded"></span>
          {component.type} Properties
        </h3>

        <div className="space-y-4">
          {properties.map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-2">{label}</label>
              {renderPropertyInput(key, localProps[key], type)}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="font-medium mb-3">Component Info</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              <strong>ID:</strong> {component.id}
            </p>
            <p>
              <strong>Type:</strong> {component.type}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
