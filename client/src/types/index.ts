// Core application types
export type ViewType = "welcome" | "projects" | "builder";
export type ThemeType = "light" | "dark" | "system";

// Component types
export interface Component {
  id: string;
  type: ComponentType;
  props: ComponentProps;
  children?: Component[];
}

export type ComponentType =
  | "hero"
  | "navbar"
  | "button"
  | "form"
  | "heading"
  | "paragraph"
  | "image"
  | "section"
  | "footer"
  | "card"
  | "grid";

export interface ComponentProps {
  className?: string;
  text?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  placeholder?: string;
  type?: string;
  level?: number;
  src?: string;
  alt?: string;
  href?: string;
  [key: string]: any;
}

// Project types
export interface Project {
  id: string;
  name: string;
  description?: string;
  components: Component[];
  settings: ProjectSettings;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
  isStarred?: boolean;
  tags?: string[];
}

export interface ProjectSettings {
  theme: ThemeType;
  primaryColor: string;
  fontFamily: string;
  layout?: "sidebar" | "topbar";
  responsive?: boolean;
}

// AI types
export interface AIMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  component?: Component;
  suggestions?: string[];
}

export interface AIRequest {
  prompt: string;
  type: "component" | "layout" | "suggestion";
  context?: {
    existingComponents?: Component[];
    projectType?: string;
    currentPage?: string;
  };
}

export interface AIResponse {
  type: "component" | "layout" | "suggestion";
  component?: Component;
  components?: Component[];
  description: string;
  suggestions?: string[];
}

// UI State types
export interface UIState {
  currentView: ViewType;
  selectedComponent: string | null;
  isLoading: boolean;
  sidebarOpen: boolean;
  theme: ThemeType;
}

// Export types
export interface ExportOptions {
  format: "html" | "react" | "vue";
  minify?: boolean;
  includeComments?: boolean;
}

export interface ExportResult {
  code: string;
  filename: string;
  mimeType: string;
  previewUrl?: string;
}
