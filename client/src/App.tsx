import { useState, useEffect } from "react";
import { Provider, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "./store/store";
import type { RootState } from "./store/store";
import { ComponentLibrarySidebar } from "./components/ComponentLibrarySidebar";
import { DesignCanvas } from "./components/DesignCanvas";
import { PropertiesPanel } from "./components/PropertiesPanel";
import { ExportModal } from "./components/ExportModal";
import WelcomeScreen from "./components/WelcomeScreen";
import EnhancedAIAssistant from "./components/EnhancedAIAssistant";
import ProjectManager from "./components/ProjectManager";
import "./App.css";

type ViewType = "welcome" | "projects" | "builder";

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewType>("welcome");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const currentProject = useSelector(
    (state: RootState) => state.projects.currentProject
  );

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Detect system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Auto-switch to builder view when a project is selected
  useEffect(() => {
    if (currentProject && currentView !== "builder") {
      setCurrentView("builder");
    }
  }, [currentProject, currentView]);

  const handleStartBuilding = () => {
    setCurrentView("projects");
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "welcome":
        return <WelcomeScreen onGetStarted={handleStartBuilding} />;

      case "projects":
        return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <ProjectManager />
            <button
              onClick={() => setCurrentView("builder")}
              className="fixed bottom-6 left-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 shadow-lg"
            >
              Start Building
            </button>
          </div>
        );

      case "builder":
        return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
            <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
              <ComponentLibrarySidebar />
            </div>
            <div className="flex-1 relative">
              <DesignCanvas />
            </div>
            <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
              <PropertiesPanel />
            </div>
            <EnhancedAIAssistant />
            <ExportModal />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`App ${theme}`}>
      {renderCurrentView()}

      {/* Global Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: theme === "dark" ? "#374151" : "#ffffff",
            color: theme === "dark" ? "#ffffff" : "#000000",
            border: `1px solid ${theme === "dark" ? "#4B5563" : "#E5E7EB"}`,
            borderRadius: "8px",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: theme === "dark" ? "#374151" : "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: theme === "dark" ? "#374151" : "#ffffff",
            },
          },
        }}
      />

      {/* Navigation Bar (when not in welcome) */}
      {currentView !== "welcome" && (
        <nav className="fixed top-4 left-4 z-50 flex items-center space-x-2">
          <button
            onClick={() => setCurrentView("projects")}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentView === "projects"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
            }`}
          >
            Projects
          </button>
          {currentView === "builder" && (
            <button
              onClick={() => setCurrentView("projects")}
              className="px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
            >
              ← Back to Projects
            </button>
          )}
          <button
            onClick={toggleTheme}
            className="px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </nav>
      )}

      {/* Version Info */}
      <div className="fixed bottom-4 left-4 text-xs text-gray-500 dark:text-gray-400 z-10">
        AI Website Builder v2.0 - Enhanced Edition
      </div>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
