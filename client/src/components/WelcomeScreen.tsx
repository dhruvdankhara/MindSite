import React, { useState } from "react";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  components: string[];
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  const [showTemplates, setShowTemplates] = useState(false);

  const templates: Template[] = [
    {
      id: "blank",
      name: "Blank Canvas",
      description: "Start with a completely empty canvas",
      icon: "📄",
      components: [],
    },
    {
      id: "landing",
      name: "Landing Page",
      description: "Hero section, features, and call-to-action",
      icon: "🚀",
      components: ["navbar", "hero", "features", "cta", "footer"],
    },
    {
      id: "portfolio",
      name: "Portfolio",
      description: "Showcase your work and skills",
      icon: "🎨",
      components: ["navbar", "hero", "gallery", "about", "contact"],
    },
    {
      id: "business",
      name: "Business Site",
      description: "Professional business website",
      icon: "🏢",
      components: ["navbar", "hero", "services", "testimonials", "footer"],
    },
  ];

  const handleTemplateSelect = (template: Template) => {
    // For now, just start the app - in a full implementation, this would set up the template
    console.log("Selected template:", template.name);
    onGetStarted();
  };

  if (showTemplates) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <button
              onClick={() => setShowTemplates(false)}
              className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
            >
              ← Back
            </button>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose a Template
            </h2>
            <p className="text-lg text-gray-600">
              Start with a pre-designed template or create from scratch
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-200"
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">{template.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {template.description}
                  </p>
                  <div className="text-xs text-gray-500">
                    {template.components.length} components
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center">
        {/* Header */}
        <div className="mb-12">
          <div className="text-6xl mb-6">🎨</div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI Website Builder
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create stunning websites without coding. Use our drag-and-drop
            interface combined with AI assistance to build professional sites in
            minutes.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Drag & Drop Builder
            </h3>
            <p className="text-gray-600 text-sm">
              Intuitive visual builder with pre-made components. No coding
              required.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              AI Assistant
            </h3>
            <p className="text-gray-600 text-sm">
              Describe what you want and let AI generate components and layouts
              for you.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">📱</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Responsive Design
            </h3>
            <p className="text-gray-600 text-sm">
              Your websites automatically work perfectly on all devices and
              screen sizes.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={() => setShowTemplates(true)}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors mr-4"
          >
            🚀 Get Started
          </button>
          <button
            onClick={() => handleTemplateSelect(templates[0])}
            className="bg-gray-100 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Start from Scratch
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-sm text-gray-500">
          <p>
            ✨ No technical knowledge required • 🎨 Professional templates • 🚀
            Export ready-to-use code
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
