import { Type, Image, Layout, MousePointer } from "lucide-react";
import type { Component, ComponentType } from "../../types";

interface ComponentLibraryProps {
  onAddComponent: (component: Component) => void;
}

export function ComponentLibrary({ onAddComponent }: ComponentLibraryProps) {
  const componentTypes: Array<{
    type: ComponentType;
    label: string;
    icon: React.ComponentType<any>;
    defaultProps: any;
  }> = [
    {
      type: "heading",
      label: "Heading",
      icon: Type,
      defaultProps: {
        text: "Sample Heading",
        level: 1,
        className: "text-3xl font-bold",
      },
    },
    {
      type: "paragraph",
      label: "Text",
      icon: Type,
      defaultProps: { text: "Sample paragraph text", className: "text-base" },
    },
    {
      type: "button",
      label: "Button",
      icon: MousePointer,
      defaultProps: {
        text: "Click me",
        className: "px-4 py-2 bg-blue-600 text-white rounded",
      },
    },
    {
      type: "section",
      label: "Section",
      icon: Layout,
      defaultProps: { className: "p-8 border border-gray-200 rounded" },
    },
    {
      type: "image",
      label: "Image",
      icon: Image,
      defaultProps: {
        src: "https://via.placeholder.com/300x200",
        alt: "Placeholder",
        className: "w-full h-auto",
      },
    },
  ];

  const handleAddComponent = (type: ComponentType, defaultProps: any) => {
    const component: Component = {
      id: Date.now().toString(),
      type,
      props: defaultProps,
    };
    onAddComponent(component);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">Components</h2>
        <p className="text-sm text-muted-foreground">Drag or click to add</p>
      </div>

      <div className="p-4 space-y-2">
        {componentTypes.map(({ type, label, icon: Icon, defaultProps }) => (
          <button
            key={type}
            onClick={() => handleAddComponent(type, defaultProps)}
            className="w-full flex items-center space-x-3 p-3 text-left border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Icon className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
