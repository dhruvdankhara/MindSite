import { Play, Sparkles, Zap, Users } from "lucide-react";
import type { ViewType } from "../../types";
import { useTheme } from "../../hooks/useTheme";

interface WelcomeViewProps {
  onNavigate: (view: ViewType) => void;
}

export function WelcomeView({ onNavigate }: WelcomeViewProps) {
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered",
      description: "Create components with natural language",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Build websites in minutes, not hours",
    },
    {
      icon: Users,
      title: "No-Code Required",
      description: "Perfect for non-technical founders",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            AI Website Builder
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Create professional websites with the power of AI. No coding
            required - just describe what you want and watch it come to life.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl mb-4">
                <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <button
            onClick={() => onNavigate("projects")}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-lg font-semibold shadow-lg hover:shadow-xl"
          >
            <Play className="w-6 h-6 mr-2" />
            Get Started
          </button>

          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span>v2.0 Enhanced Edition</span>
            <button
              onClick={toggleTheme}
              className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {theme === "light" ? "🌙" : theme === "dark" ? "☀️" : "🔄"} Theme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
