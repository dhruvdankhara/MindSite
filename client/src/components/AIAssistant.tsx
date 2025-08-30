import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setCurrentPrompt,
  startGeneration,
  generationSuccess,
  generationError,
} from "../store/slices/aiSlice";
import { addComponent } from "../store/slices/builderSlice";
import { createComponentFromTemplate } from "../lib/componentLibrary";

export const AIAssistant: React.FC = () => {
  const dispatch = useAppDispatch();
  const aiState = useAppSelector((state) => state.ai);
  const { currentPrompt, isGenerating, suggestions, prompts, error } = aiState;
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPrompt.trim() || isGenerating) return;

    dispatch(startGeneration());

    try {
      // Simulate AI response (in real app, this would call an AI API)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockResponse = generateMockResponse(currentPrompt);

      const prompt = {
        id: Date.now().toString(),
        prompt: currentPrompt,
        response: mockResponse.description,
        timestamp: Date.now(),
        type: "component" as const,
      };

      // If the response includes component data, add it to canvas
      if (mockResponse.component) {
        dispatch(addComponent(mockResponse.component));
      }

      dispatch(generationSuccess({ prompt, code: mockResponse.code }));
    } catch {
      dispatch(
        generationError("Failed to generate content. Please try again.")
      );
    }
  };

  const generateMockResponse = (prompt: string) => {
    const lowerPrompt = prompt.toLowerCase();

    if (lowerPrompt.includes("hero") || lowerPrompt.includes("banner")) {
      return {
        description:
          "Generated a hero section with title, subtitle, and call-to-action button.",
        code: '<section class="hero">...</section>',
        component: createComponentFromTemplate({
          id: "hero",
          name: "Hero Section",
          category: "Advanced",
          icon: "🦸",
          description: "AI-generated hero section",
          defaultProps: {
            title: extractTitleFromPrompt(prompt) || "Welcome to Our Platform",
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
        description: "Generated a button component with custom styling.",
        code: '<button class="btn">...</button>',
        component: createComponentFromTemplate({
          id: "button",
          name: "Button",
          category: "Form",
          icon: "🔘",
          description: "AI-generated button",
          defaultProps: {
            text: extractButtonTextFromPrompt(prompt) || "Click Me",
            type: "button",
            className:
              "px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors",
          },
        }),
      };
    }

    if (lowerPrompt.includes("form") || lowerPrompt.includes("contact")) {
      return {
        description: "Generated a contact form with input fields.",
        code: "<form>...</form>",
        component: createComponentFromTemplate({
          id: "form",
          name: "Contact Form",
          category: "Form",
          icon: "📋",
          description: "AI-generated contact form",
          defaultProps: {
            className:
              "max-w-md mx-auto space-y-4 p-6 bg-white rounded-lg shadow-md",
          },
        }),
      };
    }

    // Default response
    return {
      description:
        "I can help you create components like hero sections, buttons, forms, navigation bars, and more. Try being more specific about what you want to build!",
      code: "<!-- Specify what component you want to create -->",
      component: null,
    };
  };

  const extractTitleFromPrompt = (prompt: string): string | null => {
    const titleMatch =
      prompt.match(/title[:\s]+["']([^"']+)["']/i) ||
      prompt.match(/called[:\s]+["']([^"']+)["']/i) ||
      prompt.match(/with[:\s]+["']([^"']+)["']/i);
    return titleMatch ? titleMatch[1] : null;
  };

  const extractButtonTextFromPrompt = (prompt: string): string | null => {
    const buttonMatch =
      prompt.match(/button[:\s]+["']([^"']+)["']/i) ||
      prompt.match(/says[:\s]+["']([^"']+)["']/i) ||
      prompt.match(/text[:\s]+["']([^"']+)["']/i);
    return buttonMatch ? buttonMatch[1] : null;
  };

  const handleSuggestionClick = (suggestion: string) => {
    dispatch(setCurrentPrompt(suggestion));
  };

  return (
    <div
      className={`bg-white border-l border-gray-200 transition-all duration-300 ${
        isExpanded ? "w-96" : "w-80"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? "←" : "→"}
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Describe what you want to build and I'll help create it
        </p>
      </div>

      {/* Chat Input */}
      <div className="p-4 border-b border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <textarea
              value={currentPrompt}
              onChange={(e) => dispatch(setCurrentPrompt(e.target.value))}
              placeholder="e.g., Create a hero section with title 'Welcome to My Site' and a blue button"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>
          <button
            type="submit"
            disabled={!currentPrompt.trim() || isGenerating}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? "Generating..." : "Generate"}
          </button>
        </form>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Quick Suggestions
        </h3>
        <div className="space-y-2">
          {suggestions.slice(0, 3).map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left p-2 text-sm bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 p-4 overflow-y-auto max-h-96">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {prompts
            .slice(-5)
            .reverse()
            .map((prompt) => (
              <div key={prompt.id} className="p-3 bg-gray-50 rounded-md">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  You:
                </div>
                <div className="text-sm text-gray-700 mb-2">
                  {prompt.prompt}
                </div>
                {prompt.response && (
                  <>
                    <div className="text-sm font-medium text-blue-600 mb-1">
                      AI:
                    </div>
                    <div className="text-sm text-gray-600">
                      {prompt.response}
                    </div>
                  </>
                )}
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(prompt.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          {prompts.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No prompts yet. Try asking me to create something!
            </p>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="text-xs text-gray-600">
          <p className="font-medium mb-1">💡 Tips:</p>
          <ul className="space-y-1 text-xs">
            <li>• Be specific about colors, text, and styling</li>
            <li>• Mention component types (hero, form, button)</li>
            <li>• Describe the purpose and content</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
