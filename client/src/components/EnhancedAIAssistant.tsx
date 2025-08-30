import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MessageCircle,
  Send,
  Sparkles,
  Wand2,
  Code,
  Layout,
  Palette,
  Type,
  Image,
  Settings,
  Lightbulb,
  Zap,
  X,
  Copy,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  component?: any;
  suggestions?: string[];
}

interface QuickAction {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  prompt: string;
  category: string;
}

const EnhancedAIAssistant: React.FC = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickActions: QuickAction[] = [
    {
      id: "hero",
      icon: Layout,
      label: "Create Hero Section",
      prompt:
        "Create a modern hero section with a compelling headline and call-to-action button",
      category: "layout",
    },
    {
      id: "navbar",
      icon: Layout,
      label: "Add Navigation",
      prompt: "Create a responsive navigation bar with logo and menu items",
      category: "layout",
    },
    {
      id: "contact-form",
      icon: Code,
      label: "Contact Form",
      prompt:
        "Generate a professional contact form with name, email, and message fields",
      category: "forms",
    },
    {
      id: "pricing",
      icon: Layout,
      label: "Pricing Section",
      prompt:
        "Create a pricing section with three tiers: Basic, Pro, and Enterprise",
      category: "business",
    },
    {
      id: "testimonials",
      icon: Layout,
      label: "Testimonials",
      prompt: "Add a testimonials section with customer reviews and ratings",
      category: "business",
    },
    {
      id: "gallery",
      icon: Image,
      label: "Photo Gallery",
      prompt: "Create a responsive image gallery with lightbox functionality",
      category: "media",
    },
    {
      id: "footer",
      icon: Layout,
      label: "Footer",
      prompt:
        "Generate a comprehensive footer with links, contact info, and social media",
      category: "layout",
    },
    {
      id: "blog-cards",
      icon: Type,
      label: "Blog Cards",
      prompt:
        "Create a blog section with article cards showing title, excerpt, and read more",
      category: "content",
    },
    {
      id: "team",
      icon: Layout,
      label: "Team Section",
      prompt:
        "Add a team section showcasing team members with photos and roles",
      category: "business",
    },
    {
      id: "features",
      icon: Sparkles,
      label: "Features Grid",
      prompt: "Create a features section highlighting key product benefits",
      category: "business",
    },
  ];

  const categories = [
    { id: "all", label: "All", icon: Sparkles },
    { id: "layout", label: "Layout", icon: Layout },
    { id: "business", label: "Business", icon: Settings },
    { id: "forms", label: "Forms", icon: Code },
    { id: "content", label: "Content", icon: Type },
    { id: "media", label: "Media", icon: Image },
  ];

  const filteredActions =
    activeCategory === "all"
      ? quickActions
      : quickActions.filter((action) => action.category === activeCategory);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (messageText: string = input) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: messageText,
          type: "component",
          context: {
            existingComponents: [], // Would include current project components
            projectType: "website",
          },
        }),
      });

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: data.description || "I've generated a component for you.",
        timestamp: new Date(),
        component: data.component || data.components,
        suggestions: data.suggestions || [],
      };

      setMessages((prev) => [...prev, aiMessage]);

      // If a component was generated, add it to the builder
      if (data.component) {
        dispatch({
          type: "builder/addComponent",
          payload: {
            ...data.component,
            id: Date.now().toString(),
          },
        });
      } else if (data.components) {
        data.components.forEach((component: any, index: number) => {
          dispatch({
            type: "builder/addComponent",
            payload: {
              ...component,
              id: (Date.now() + index).toString(),
            },
          });
        });
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "Sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    handleSend(action.prompt);
  };

  const handleCopyComponent = (component: any) => {
    navigator.clipboard.writeText(JSON.stringify(component, null, 2));
    // Show toast notification
  };

  const handleFeedback = (messageId: string, positive: boolean) => {
    // Send feedback to analytics
    console.log(
      `Feedback for message ${messageId}: ${positive ? "positive" : "negative"}`
    );
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
      >
        <MessageCircle className="w-6 h-6" />
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
          AI
        </div>
        <div className="absolute bottom-full right-0 mb-2 bg-black text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          AI Assistant
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              AI Assistant
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isLoading ? "Thinking..." : "Ready to help"}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Actions */}
      {messages.length === 0 && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Quick Actions
          </h4>

          {/* Categories */}
          <div className="flex space-x-1 mb-3 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  activeCategory === category.id
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                }`}
              >
                <category.icon className="w-3 h-3" />
                <span>{category.label}</span>
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {filteredActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action)}
                className="flex items-center space-x-2 p-2 text-left border border-gray-200 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
              >
                <action.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-medium text-gray-900 dark:text-white truncate">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">
              Hi! I'm your AI assistant. I can help you create website
              components, suggest improvements, and answer questions about web
              design.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] ${
                message.type === "user" ? "order-2" : "order-1"
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex items-center space-x-2 mb-1 ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    message.type === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  }`}
                >
                  {message.type === "user" ? (
                    "U"
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Message */}
              <div
                className={`p-3 rounded-lg ${
                  message.type === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                }`}
              >
                <p className="text-sm">{message.content}</p>

                {/* Component Preview */}
                {message.component && (
                  <div className="mt-3 p-2 bg-white dark:bg-gray-800 rounded border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        Generated Component
                      </span>
                      <button
                        onClick={() => handleCopyComponent(message.component)}
                        className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                      {message.component.type}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium mb-2 opacity-75">
                      Suggestions:
                    </p>
                    <div className="space-y-1">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSend(suggestion)}
                          className="block w-full text-left text-xs p-2 bg-black bg-opacity-10 rounded hover:bg-opacity-20 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Feedback */}
                {message.type === "ai" && (
                  <div className="flex items-center justify-end space-x-2 mt-2">
                    <button
                      onClick={() => handleFeedback(message.id, true)}
                      className="text-xs opacity-50 hover:opacity-100"
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleFeedback(message.id, false)}
                      className="text-xs opacity-50 hover:opacity-100"
                    >
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me to create a component..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Quick suggestions */}
        <div className="flex space-x-2 mt-2 overflow-x-auto">
          {["Add a hero section", "Create contact form", "Design footer"].map(
            (suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInput(suggestion)}
                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 whitespace-nowrap"
              >
                {suggestion}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedAIAssistant;
