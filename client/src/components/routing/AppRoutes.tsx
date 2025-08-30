import { useState } from "react";
import type { ViewType } from "../../types";
import { WelcomeView } from "../views/WelcomeView";
import { ProjectsView } from "../views/ProjectsView";
import { BuilderView } from "../views/BuilderView";

export function AppRoutes() {
  const [currentView, setCurrentView] = useState<ViewType>("welcome");

  const handleNavigate = (view: ViewType) => {
    setCurrentView(view);
  };

  switch (currentView) {
    case "welcome":
      return <WelcomeView onNavigate={handleNavigate} />;

    case "projects":
      return <ProjectsView onNavigate={handleNavigate} />;

    case "builder":
      return <BuilderView />;

    default:
      return <WelcomeView onNavigate={handleNavigate} />;
  }
}
