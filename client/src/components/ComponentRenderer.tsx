import React from "react";
import type { Component } from "../store/slices/builderSlice";

interface ComponentRendererProps {
  component: Component;
  isSelected?: boolean;
  isPreview?: boolean;
  onSelect?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Component>) => void;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  isSelected,
  isPreview,
  onSelect,
  onUpdate,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (!isPreview && onSelect) {
      e.stopPropagation();
      onSelect(component.id);
    }
  };

  const baseClassName =
    isSelected && !isPreview ? "ring-2 ring-blue-500 ring-opacity-50" : "";

  const renderComponent = () => {
    switch (component.type) {
      case "container":
        return (
          <div
            className={`${component.props.className} ${baseClassName}`}
            style={component.style}
          >
            {component.children?.map((child) => (
              <ComponentRenderer
                key={child.id}
                component={child}
                isPreview={isPreview}
                onSelect={onSelect}
                onUpdate={onUpdate}
              />
            ))}
          </div>
        );

      case "section":
        return (
          <section
            className={`${component.props.className} ${baseClassName}`}
            style={component.style}
          >
            {component.children?.map((child) => (
              <ComponentRenderer
                key={child.id}
                component={child}
                isPreview={isPreview}
                onSelect={onSelect}
                onUpdate={onUpdate}
              />
            ))}
          </section>
        );

      case "grid":
        return (
          <div
            className={`${component.props.className} ${baseClassName}`}
            style={component.style}
          >
            {component.children?.map((child) => (
              <ComponentRenderer
                key={child.id}
                component={child}
                isPreview={isPreview}
                onSelect={onSelect}
                onUpdate={onUpdate}
              />
            ))}
          </div>
        );

      case "heading": {
        const level = (component.props.level as number) || 1;
        const headingProps = {
          className: `${component.props.className} ${baseClassName}`,
          style: component.style,
          children: component.props.text as string,
        };

        switch (level) {
          case 1:
            return <h1 {...headingProps} />;
          case 2:
            return <h2 {...headingProps} />;
          case 3:
            return <h3 {...headingProps} />;
          case 4:
            return <h4 {...headingProps} />;
          case 5:
            return <h5 {...headingProps} />;
          case 6:
            return <h6 {...headingProps} />;
          default:
            return <h1 {...headingProps} />;
        }
      }

      case "paragraph":
        return (
          <p
            className={`${component.props.className} ${baseClassName}`}
            style={component.style}
          >
            {component.props.text as string}
          </p>
        );

      case "image":
        return (
          <img
            src={component.props.src as string}
            alt={component.props.alt as string}
            className={`${component.props.className} ${baseClassName}`}
            style={component.style}
          />
        );

      case "link":
        return (
          <a
            href={component.props.href as string}
            className={`${component.props.className} ${baseClassName}`}
            style={component.style}
          >
            {component.props.text as string}
          </a>
        );

      case "button":
        return (
          <button
            type={component.props.type as "button" | "submit" | "reset"}
            className={`${component.props.className} ${baseClassName}`}
            style={component.style}
          >
            {component.props.text as string}
          </button>
        );

      case "input":
        return (
          <input
            type={component.props.type as string}
            placeholder={component.props.placeholder as string}
            className={`${component.props.className} ${baseClassName}`}
            style={component.style}
          />
        );

      case "textarea":
        return (
          <textarea
            placeholder={component.props.placeholder as string}
            rows={component.props.rows as number}
            className={`${component.props.className} ${baseClassName}`}
            style={component.style}
          />
        );

      case "form":
        return (
          <form
            className={`${component.props.className} ${baseClassName}`}
            style={component.style}
          >
            {component.children?.map((child) => (
              <ComponentRenderer
                key={child.id}
                component={child}
                isPreview={isPreview}
                onSelect={onSelect}
                onUpdate={onUpdate}
              />
            ))}
          </form>
        );

      case "navbar":
        return (
          <nav
            className={`${component.props.className} ${baseClassName}`}
            style={component.style}
          >
            <div className="font-bold text-xl">
              {component.props.logo as string}
            </div>
            <div className="flex space-x-4">
              {(component.props.links as string[]).map((link, index) => (
                <a key={index} href="#" className="hover:text-blue-600">
                  {link}
                </a>
              ))}
            </div>
          </nav>
        );

      case "footer":
        return (
          <footer
            className={`${component.props.className} ${baseClassName}`}
            style={component.style}
          >
            {component.props.text as string}
          </footer>
        );

      case "video":
        return (
          <video
            src={component.props.src as string}
            controls={component.props.controls as boolean}
            className={`${component.props.className} ${baseClassName}`}
            style={component.style}
          />
        );

      case "audio":
        return (
          <audio
            src={component.props.src as string}
            controls={component.props.controls as boolean}
            className={`${component.props.className} ${baseClassName}`}
            style={component.style}
          />
        );

      case "card":
        return (
          <div
            className={`${component.props.className} ${baseClassName}`}
            style={component.style}
          >
            <h3 className="text-lg font-semibold mb-2">
              {component.props.title as string}
            </h3>
            <p className="text-gray-600">{component.props.content as string}</p>
          </div>
        );

      case "hero":
        return (
          <section
            className={`${component.props.className} ${baseClassName}`}
            style={component.style}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {component.props.title as string}
            </h1>
            <p className="text-xl mb-8 opacity-90">
              {component.props.subtitle as string}
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              {component.props.buttonText as string}
            </button>
          </section>
        );

      default:
        return (
          <div
            className={`p-4 border border-red-300 bg-red-50 text-red-700 ${baseClassName}`}
            style={component.style}
          >
            Unknown component type: {component.type}
          </div>
        );
    }
  };

  return (
    <div onClick={handleClick} className={!isPreview ? "cursor-pointer" : ""}>
      {renderComponent()}
    </div>
  );
};
