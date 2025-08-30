import React, { useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { addComponent } from "../store/slices/builderSlice";
import { createComponentFromTemplate } from "../lib/componentLibrary";

export const SimpleAIAssistant: React.FC = () => {
  const dispatch = useAppDispatch();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastResponse, setLastResponse] = useState("");

  const suggestions = [
    "Create a hero section with a call-to-action button",
    "Add a navigation bar with logo and menu items",
    "Generate a contact form with validation",
    "Create a pricing table with three tiers",
    "Add a footer with social media links",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);

    try {
      // Simulate AI response
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const response = generateResponse(prompt);
      setLastResponse(response.description);

      if (response.component) {
        dispatch(addComponent(response.component));
      }

      setPrompt("");
    } catch {
      setLastResponse("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateResponse = (prompt: string) => {
    const lowerPrompt = prompt.toLowerCase();

    if (lowerPrompt.includes("hero") || lowerPrompt.includes("banner")) {
      return {
        description:
          "Generated a hero section with title, subtitle, and call-to-action button.",
        component: createComponentFromTemplate({
          id: "hero",
          name: "Hero Section",
          category: "Advanced",
          icon: "🦸",
          description: "AI-generated hero section",
          defaultProps: {
            title: "Welcome to Our Platform",
            subtitle: "Build amazing websites with AI assistance",
            buttonText: "Get Started",
            className:
              "w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-4 text-center",
          },
        }),
      };
    }

    if (lowerPrompt.includes("button")) {
      return {
        description: "Generated a button component.",
        component: createComponentFromTemplate({
          id: "button",
          name: "Button",
          category: "Form",
          icon: "🔘",
          description: "AI-generated button",
          defaultProps: {
            text: "Click Me",
            type: "button",
            className:
              "px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors",
          },
        }),
      };
    }

    if (lowerPrompt.includes("navbar") || lowerPrompt.includes("navigation")) {
      return {
        description: "Generated a navigation bar with logo and menu items.",
        component: createComponentFromTemplate({
          id: "navbar",
          name: "Navigation Bar",
          category: "Navigation",
          icon: "🧭",
          description: "AI-generated navigation bar",
          defaultProps: {
            className:
              "w-full bg-white shadow-md px-4 py-3 flex justify-between items-center",
            logo: "Your Logo",
            links: ["Home", "About", "Services", "Contact"],
          },
        }),
      };
    }

    return {
      description:
        "I can help you create components like hero sections, buttons, navigation bars, forms, and more. Try being more specific!",
      component: null,
    };
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          AI Assistant
        </h2>
        <p className="text-sm text-gray-600">
          Describe what you want to build and I'll help create it
        </p>
      </div>

      {/* Input Form */}
      <div className="p-4 border-b border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Create a hero section with a blue background"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? "Generating..." : "Generate Component"}
          </button>
        </form>

        {lastResponse && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-700">{lastResponse}</p>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Quick Suggestions
        </h3>
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setPrompt(suggestion)}
              className="w-full text-left p-2 text-sm bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="flex-1 p-4 bg-gray-50">
        <div className="text-xs text-gray-600">
          <p className="font-medium mb-2">💡 Tips for better results:</p>
          <ul className="space-y-1">
            <li>• Be specific about what you want</li>
            <li>• Mention colors, sizes, or styles</li>
            <li>• Describe the purpose of the component</li>
            <li>• Try keywords like "hero", "button", "navbar"</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
