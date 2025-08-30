import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import type { Component } from "../../types";
import {
  ComponentLibrary,
  Canvas,
  PropertiesPanel,
  AIAssistant,
  Toolbar,
} from "../builder";

export function BuilderView() {
  const { currentProject } = useSelector((state: RootState) => state.projects);
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );
  const [rightPanel, setRightPanel] = useState<"properties" | "ai">(
    "properties"
  );
  const [history, setHistory] = useState<Component[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const saveToHistory = useCallback(
    (newComponents: Component[]) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push([...newComponents]);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    },
    [history, historyIndex]
  );

  const handleAddComponent = useCallback(
    (componentData: Omit<Component, "id">) => {
      const newComponent: Component = {
        ...componentData,
        id: `component-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
      };

      const newComponents = [...components, newComponent];
      setComponents(newComponents);
      saveToHistory(newComponents);
      setSelectedComponent(newComponent.id);
    },
    [components, saveToHistory]
  );

  const handleUpdateComponent = useCallback(
    (id: string, updates: Partial<Component>) => {
      const newComponents = components.map((comp) =>
        comp.id === id ? { ...comp, ...updates } : comp
      );
      setComponents(newComponents);
      saveToHistory(newComponents);
    },
    [components, saveToHistory]
  );

  const handleDeleteComponent = useCallback(
    (id: string) => {
      const newComponents = components.filter((comp) => comp.id !== id);
      setComponents(newComponents);
      saveToHistory(newComponents);
      if (selectedComponent === id) {
        setSelectedComponent(null);
      }
    },
    [components, selectedComponent, saveToHistory]
  );

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setComponents([...history[newIndex]]);
      setSelectedComponent(null);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setComponents([...history[newIndex]]);
      setSelectedComponent(null);
    }
  }, [history, historyIndex]);

  const handleSave = useCallback(async () => {
    try {
      // Future: Save to backend
      console.log("Saving project:", { components });
    } catch (error) {
      console.error("Save failed:", error);
    }
  }, [components]);

  const handlePreview = useCallback(() => {
    // Future: Open preview in new tab
    console.log("Opening preview");
  }, []);

  const handleExport = useCallback(() => {
    // Generate HTML export
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${currentProject?.name || "Exported Page"}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white">
    <div class="max-w-4xl mx-auto p-8">
        ${components
          .map((comp) => {
            switch (comp.type) {
              case "heading":
                const level = comp.props.level || 1;
                return `<h${level} class="${comp.props.className || ""}">${
                  comp.props.text || "Heading"
                }</h${level}>`;
              case "paragraph":
                return `<p class="${comp.props.className || ""}">${
                  comp.props.text || "Paragraph"
                }</p>`;
              case "button":
                return `<button class="${comp.props.className || ""}">${
                  comp.props.text || "Button"
                }</button>`;
              case "image":
                return `<img src="${comp.props.src || ""}" alt="${
                  comp.props.alt || ""
                }" class="${comp.props.className || ""}" />`;
              case "section":
                return `<div class="${
                  comp.props.className || ""
                }">Section</div>`;
              default:
                return "";
            }
          })
          .join("\n        ")}
    </div>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentProject?.name || "page"}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [components, currentProject]);

  const handleGenerateContent = useCallback(
    async (prompt: string): Promise<string> => {
      try {
        // Future: Call AI service
        return `Generated content for: ${prompt}`;
      } catch (error) {
        throw new Error("AI generation failed");
      }
    },
    []
  );

  const selectedComponentData = selectedComponent
    ? components.find((comp) => comp.id === selectedComponent) || null
    : null;

  if (!currentProject) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p className="text-lg mb-2">No project selected</p>
          <p>Go to Projects to create or select a project</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Toolbar
        onSave={handleSave}
        onPreview={handlePreview}
        onExport={handleExport}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        isSaving={false}
      />

      <div className="flex-1 flex">
        <ComponentLibrary onAddComponent={handleAddComponent} />

        <Canvas
          components={components}
          selectedComponent={selectedComponent}
          onSelectComponent={setSelectedComponent}
          onUpdateComponent={handleUpdateComponent}
          onDeleteComponent={handleDeleteComponent}
        />

        <div className="flex flex-col">
          <div className="flex border-b border-border">
            <button
              onClick={() => setRightPanel("properties")}
              className={`px-4 py-2 text-sm font-medium ${
                rightPanel === "properties"
                  ? "bg-background border-b-2 border-blue-500"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Properties
            </button>
            <button
              onClick={() => setRightPanel("ai")}
              className={`px-4 py-2 text-sm font-medium ${
                rightPanel === "ai"
                  ? "bg-background border-b-2 border-purple-500"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              AI Assistant
            </button>
          </div>

          {rightPanel === "properties" ? (
            <PropertiesPanel
              component={selectedComponentData}
              onUpdateComponent={handleUpdateComponent}
            />
          ) : (
            <AIAssistant
              onAddComponent={handleAddComponent}
              onGenerateContent={handleGenerateContent}
            />
          )}
        </div>
      </div>
    </div>
  );
}
