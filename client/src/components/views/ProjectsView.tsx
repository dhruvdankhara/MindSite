import { useState, useEffect } from "react";
import { Plus, Search, Grid, List, Star } from "lucide-react";
import type { ViewType, Project } from "../../types";

interface ProjectsViewProps {
  onNavigate: (view: ViewType) => void;
}

export function ProjectsView({ onNavigate }: ProjectsViewProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(false);

  // Load projects from API
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://mindsite.onrender.com/api/projects"
      );
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async () => {
    const name = prompt("Project name:");
    if (!name) return;

    try {
      const response = await fetch(
        "https://mindsite.onrender.com/api/projects",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            description: "",
            components: [],
            settings: {
              theme: "light",
              primaryColor: "#3b82f6",
              fontFamily: "Inter",
            },
          }),
        }
      );

      if (response.ok) {
        const newProject = await response.json();
        setProjects((prev) => [newProject, ...prev]);
        onNavigate("builder");
      }
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Projects</h1>
              <p className="text-muted-foreground mt-1">
                {filteredProjects.length} project
                {filteredProjects.length !== 1 ? "s" : ""}
              </p>
            </div>

            <button
              onClick={createProject}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Project
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          {/* Search */}
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-border rounded-lg bg-background focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>

          {/* View Toggle */}
          <div className="flex bg-muted rounded-lg p-1 ml-4">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${
                viewMode === "grid" ? "bg-background shadow-sm" : ""
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${
                viewMode === "list" ? "bg-background shadow-sm" : ""
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Projects */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {searchTerm ? "No projects found" : "No projects yet"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm
                ? "Try adjusting your search"
                : "Create your first project to get started"}
            </p>
            {!searchTerm && (
              <button
                onClick={createProject}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Create Project
              </button>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                viewMode={viewMode}
                onOpen={() => onNavigate("builder")}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  viewMode: "grid" | "list";
  onOpen: () => void;
}

function ProjectCard({ project, viewMode, onOpen }: ProjectCardProps) {
  if (viewMode === "list") {
    return (
      <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <span className="text-lg font-bold text-primary">
              {project.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-foreground">{project.name}</h3>
              {project.isStarred && (
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {project.description || "No description"}
            </p>
          </div>
        </div>
        <button
          onClick={onOpen}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Open
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-white/20">
            {project.name.charAt(0).toUpperCase()}
          </span>
        </div>
        {project.isStarred && (
          <Star className="absolute top-3 left-3 w-5 h-5 text-yellow-400 fill-current" />
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-2">{project.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {project.description || "No description"}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {project.components.length} component
            {project.components.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={onOpen}
            className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90"
          >
            Open
          </button>
        </div>
      </div>
    </div>
  );
}
