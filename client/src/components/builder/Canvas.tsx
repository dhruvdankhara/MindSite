import type { Component } from "../../types";

interface CanvasProps {
  components: Component[];
  selectedComponent: string | null;
  onSelectComponent: (id: string | null) => void;
  onUpdateComponent: (id: string, updates: Partial<Component>) => void;
  onDeleteComponent: (id: string) => void;
}

export function Canvas({
  components,
  selectedComponent,
  onSelectComponent,
  onDeleteComponent,
}: CanvasProps) {
  const renderComponent = (component: Component) => {
    const isSelected = selectedComponent === component.id;

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelectComponent(component.id);
    };

    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      onDeleteComponent(component.id);
    };

    const baseClasses = `${component.props.className || ""} ${
      isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""
    } relative group cursor-pointer`;

    switch (component.type) {
      case "heading": {
        const level = component.props.level || 1;
        const Tag =
          level === 1
            ? "h1"
            : level === 2
            ? "h2"
            : level === 3
            ? "h3"
            : level === 4
            ? "h4"
            : level === 5
            ? "h5"
            : "h6";
        return (
          <Tag key={component.id} className={baseClasses} onClick={handleClick}>
            {component.props.text || "Heading"}
            {isSelected && (
              <button
                onClick={handleDelete}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            )}
          </Tag>
        );
      }

      case "paragraph":
        return (
          <p key={component.id} className={baseClasses} onClick={handleClick}>
            {component.props.text || "Paragraph text"}
            {isSelected && (
              <button
                onClick={handleDelete}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            )}
          </p>
        );

      case "button":
        return (
          <button
            key={component.id}
            className={baseClasses}
            onClick={handleClick}
          >
            {component.props.text || "Button"}
            {isSelected && (
              <button
                onClick={handleDelete}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            )}
          </button>
        );

      case "section":
        return (
          <div key={component.id} className={baseClasses} onClick={handleClick}>
            <div className="min-h-[100px] flex items-center justify-center text-muted-foreground">
              Section Container
            </div>
            {isSelected && (
              <button
                onClick={handleDelete}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            )}
          </div>
        );

      case "image":
        return (
          <img
            key={component.id}
            src={component.props.src || "https://via.placeholder.com/300x200"}
            alt={component.props.alt || "Image"}
            className={baseClasses}
            onClick={handleClick}
          />
        );

      default:
        return (
          <div key={component.id} className={baseClasses} onClick={handleClick}>
            Unknown component: {component.type}
            {isSelected && (
              <button
                onClick={handleDelete}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            )}
          </div>
        );
    }
  };

  return (
    <div
      className="h-full bg-white dark:bg-gray-950 overflow-auto p-8"
      onClick={() => onSelectComponent(null)}
    >
      <div className="max-w-4xl mx-auto space-y-4">
        {components.length === 0 ? (
          <div className="text-center text-muted-foreground py-20">
            <p className="text-lg mb-2">Your canvas is empty</p>
            <p>Add components from the library to get started</p>
          </div>
        ) : (
          components.map(renderComponent)
        )}
      </div>
    </div>
  );
}
