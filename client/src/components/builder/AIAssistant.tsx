import { useState } from "react";
import type { Component } from "../../types";

interface AIAssistantProps {
  onAddComponent: (component: Omit<Component, "id">) => void;
  onGenerateContent: (prompt: string) => Promise<string>;
}

export function AIAssistant({
  onAddComponent,
  onGenerateContent,
}: AIAssistantProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastResponse, setLastResponse] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const response = await onGenerateContent(prompt);
      setLastResponse(response);

      // Try to parse the response and create components
      if (
        response.toLowerCase().includes("heading") ||
        response.toLowerCase().includes("title")
      ) {
        onAddComponent({
          type: "heading",
          props: {
            text: response,
            level: 1,
            className: "text-3xl font-bold mb-4",
          },
        });
      } else if (response.toLowerCase().includes("button")) {
        onAddComponent({
          type: "button",
          props: {
            text: "Click me",
            className:
              "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",
          },
        });
      } else {
        onAddComponent({
          type: "paragraph",
          props: {
            text: response,
            className: "mb-4 text-gray-700 dark:text-gray-300",
          },
        });
      }

      setPrompt("");
    } catch (error) {
      console.error("AI generation failed:", error);
      setLastResponse(
        "Sorry, I couldn't generate content right now. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const quickActions = [
    {
      label: "Hero Section",
      prompt: "Create a hero section with a heading and description",
      action: () => {
        onAddComponent({
          type: "section",
          props: {
            className:
              "py-20 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white",
          },
        });
        onAddComponent({
          type: "heading",
          props: {
            text: "Welcome to Our Amazing Product",
            level: 1,
            className: "text-5xl font-bold mb-6",
          },
        });
        onAddComponent({
          type: "paragraph",
          props: {
            text: "Discover the future of innovation with our cutting-edge solution.",
            className: "text-xl mb-8 max-w-2xl mx-auto",
          },
        });
        onAddComponent({
          type: "button",
          props: {
            text: "Get Started",
            className:
              "px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors",
          },
        });
      },
    },
    {
      label: "Content Block",
      prompt: "Add a content section with heading and paragraph",
      action: () => {
        onAddComponent({
          type: "heading",
          props: {
            text: "About Us",
            level: 2,
            className: "text-3xl font-bold mb-4",
          },
        });
        onAddComponent({
          type: "paragraph",
          props: {
            text: "We are passionate about creating amazing digital experiences that help businesses grow and succeed.",
            className: "text-lg text-gray-600 dark:text-gray-300 mb-6",
          },
        });
      },
    },
    {
      label: "Call to Action",
      prompt: "Create a call to action section",
      action: () => {
        onAddComponent({
          type: "section",
          props: {
            className: "py-16 bg-gray-50 dark:bg-gray-900 text-center",
          },
        });
        onAddComponent({
          type: "heading",
          props: {
            text: "Ready to Get Started?",
            level: 2,
            className: "text-3xl font-bold mb-4",
          },
        });
        onAddComponent({
          type: "paragraph",
          props: {
            text: "Join thousands of satisfied customers today.",
            className: "text-lg mb-6",
          },
        });
        onAddComponent({
          type: "button",
          props: {
            text: "Start Free Trial",
            className:
              "px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors",
          },
        });
      },
    },
  ];

  return (
    <div className="w-80 border-l border-border bg-background overflow-y-auto">
      <div className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <span className="w-3 h-3 bg-purple-500 rounded"></span>
          AI Assistant
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Describe what you want to create
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Create a hero section with a bold heading and call-to-action button"
              className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[80px]"
              rows={3}
            />
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full mt-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? "Generating..." : "Generate with AI"}
            </button>
          </div>

          {lastResponse && (
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md">
              <p className="text-sm text-purple-700 dark:text-purple-300">
                {lastResponse}
              </p>
            </div>
          )}

          <div className="border-t border-border pt-4">
            <h4 className="font-medium mb-3">Quick Actions</h4>
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="w-full text-left px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h4 className="font-medium mb-3">Tips</h4>
            <div className="text-xs text-muted-foreground space-y-2">
              <p>• Be specific about what you want to create</p>
              <p>• Mention colors, sizes, or styles you prefer</p>
              <p>• Use quick actions for common layouts</p>
              <p>
                • Generated components can be edited in the properties panel
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
