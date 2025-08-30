import type { Component } from "../store/slices/builderSlice";

export interface ComponentTemplate {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  defaultProps: Record<string, unknown>;
  style?: Record<string, string | number>;
}

export const componentLibrary: ComponentTemplate[] = [
  // Layout Components
  {
    id: "container",
    name: "Container",
    category: "Layout",
    icon: "⬜",
    description: "A flexible container for other components",
    defaultProps: {
      className:
        "w-full p-4 border-2 border-dashed border-gray-300 min-h-[100px]",
    },
  },
  {
    id: "section",
    name: "Section",
    category: "Layout",
    icon: "📄",
    description: "A semantic section container",
    defaultProps: {
      className: "w-full py-8 px-4",
    },
  },
  {
    id: "grid",
    name: "Grid",
    category: "Layout",
    icon: "⚏",
    description: "A responsive grid layout",
    defaultProps: {
      className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
    },
  },

  // Content Components
  {
    id: "heading",
    name: "Heading",
    category: "Content",
    icon: "H",
    description: "A heading element",
    defaultProps: {
      text: "Your Heading Here",
      level: 1,
      className: "text-3xl font-bold text-gray-900",
    },
  },
  {
    id: "paragraph",
    name: "Paragraph",
    category: "Content",
    icon: "P",
    description: "A paragraph of text",
    defaultProps: {
      text: "Your paragraph text goes here. This is a sample paragraph to demonstrate the text component.",
      className: "text-gray-700 leading-relaxed",
    },
  },
  {
    id: "image",
    name: "Image",
    category: "Content",
    icon: "🖼️",
    description: "An image component",
    defaultProps: {
      src: "https://via.placeholder.com/300x200",
      alt: "Placeholder image",
      className: "w-full h-auto rounded-lg",
    },
  },
  {
    id: "link",
    name: "Link",
    category: "Content",
    icon: "🔗",
    description: "A clickable link",
    defaultProps: {
      href: "#",
      text: "Click here",
      className: "text-blue-600 hover:text-blue-800 underline",
    },
  },

  // Form Components
  {
    id: "button",
    name: "Button",
    category: "Form",
    icon: "🔘",
    description: "A clickable button",
    defaultProps: {
      text: "Click Me",
      type: "button",
      className:
        "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors",
    },
  },
  {
    id: "input",
    name: "Input",
    category: "Form",
    icon: "📝",
    description: "A text input field",
    defaultProps: {
      type: "text",
      placeholder: "Enter text...",
      className:
        "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
    },
  },
  {
    id: "textarea",
    name: "Textarea",
    category: "Form",
    icon: "📄",
    description: "A multi-line text input",
    defaultProps: {
      placeholder: "Enter your message...",
      rows: 4,
      className:
        "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
    },
  },
  {
    id: "form",
    name: "Form",
    category: "Form",
    icon: "📋",
    description: "A form container",
    defaultProps: {
      className: "space-y-4 p-6 bg-gray-50 rounded-lg",
    },
  },

  // Navigation Components
  {
    id: "navbar",
    name: "Navigation Bar",
    category: "Navigation",
    icon: "🧭",
    description: "A navigation bar",
    defaultProps: {
      className:
        "w-full bg-white shadow-md px-4 py-3 flex justify-between items-center",
      logo: "Your Logo",
      links: ["Home", "About", "Services", "Contact"],
    },
  },
  {
    id: "footer",
    name: "Footer",
    category: "Navigation",
    icon: "🦶",
    description: "A page footer",
    defaultProps: {
      className: "w-full bg-gray-800 text-white py-8 px-4 text-center",
      text: "© 2025 Your Company. All rights reserved.",
    },
  },

  // Media Components
  {
    id: "video",
    name: "Video",
    category: "Media",
    icon: "🎥",
    description: "A video player",
    defaultProps: {
      src: "",
      controls: true,
      className: "w-full rounded-lg",
    },
  },
  {
    id: "audio",
    name: "Audio",
    category: "Media",
    icon: "🔊",
    description: "An audio player",
    defaultProps: {
      src: "",
      controls: true,
      className: "w-full",
    },
  },

  // Advanced Components
  {
    id: "card",
    name: "Card",
    category: "Advanced",
    icon: "🃏",
    description: "A card component",
    defaultProps: {
      title: "Card Title",
      content: "Card content goes here",
      className: "bg-white p-6 rounded-lg shadow-md border",
    },
  },
  {
    id: "hero",
    name: "Hero Section",
    category: "Advanced",
    icon: "🦸",
    description: "A hero section with title and CTA",
    defaultProps: {
      title: "Welcome to Our Platform",
      subtitle: "Build amazing websites without coding",
      buttonText: "Get Started",
      className:
        "w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-4 text-center",
    },
  },
];

export const componentCategories = Array.from(
  new Set(componentLibrary.map((comp) => comp.category))
);

export function createComponentFromTemplate(
  template: ComponentTemplate
): Component {
  return {
    id: `${template.id}_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`,
    type: template.id,
    props: { ...template.defaultProps },
    style: template.style || {},
  };
}
