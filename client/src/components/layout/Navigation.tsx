import { useTheme } from "../../hooks/useTheme";
import { Moon, Sun, Monitor } from "lucide-react";

export function Navigation() {
  const { theme, toggleTheme } = useTheme();

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="w-4 h-4" />;
      case "dark":
        return <Moon className="w-4 h-4" />;
      case "system":
        return <Monitor className="w-4 h-4" />;
      default:
        return <Sun className="w-4 h-4" />;
    }
  };

  return (
    <nav className="fixed top-4 right-4 z-50">
      <button
        onClick={toggleTheme}
        className="p-2 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors shadow-sm"
        title={`Current theme: ${theme}`}
      >
        {getThemeIcon()}
      </button>
    </nav>
  );
}
