const Project = require("../models/Project");

class ProjectController {
  async getAllProjects(req, res) {
    try {
      const { page = 1, limit = 20, search } = req.query;
      const offset = (page - 1) * limit;

      let projects;

      if (search) {
        projects = await Project.search(search, {
          limit: parseInt(limit),
          offset: parseInt(offset),
        });
      } else {
        projects = await Project.findAll({
          limit: parseInt(limit),
          offset: parseInt(offset),
        });
      }

      const total = await Project.count();

      res.json({
        projects: projects.map((project) => project.toJSON()),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({
        error: "Failed to fetch projects",
        message: error.message,
      });
    }
  }

  async getProjectById(req, res) {
    try {
      const { id } = req.params;
      const project = await Project.findById(id);

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.json(project.toJSON());
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({
        error: "Failed to fetch project",
        message: error.message,
      });
    }
  }

  async createProject(req, res) {
    try {
      const { name, description, components = [], settings = {} } = req.body;

      // Validation
      if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: "Project name is required" });
      }

      if (name.length > 100) {
        return res
          .status(400)
          .json({ error: "Project name must be less than 100 characters" });
      }

      const projectData = {
        name: name.trim(),
        description: description?.trim() || "",
        components,
        settings,
      };

      const project = await Project.create(projectData);

      res.status(201).json(project.toJSON());
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({
        error: "Failed to create project",
        message: error.message,
      });
    }
  }

  async updateProject(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Validation for name if provided
      if (updates.name !== undefined) {
        if (!updates.name || updates.name.trim().length === 0) {
          return res
            .status(400)
            .json({ error: "Project name cannot be empty" });
        }
        if (updates.name.length > 100) {
          return res
            .status(400)
            .json({ error: "Project name must be less than 100 characters" });
        }
        updates.name = updates.name.trim();
      }

      if (updates.description !== undefined) {
        updates.description = updates.description?.trim() || "";
      }

      await project.update(updates);

      res.json({
        message: "Project updated successfully",
        project: project.toJSON(),
      });
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({
        error: "Failed to update project",
        message: error.message,
      });
    }
  }

  async deleteProject(req, res) {
    try {
      const { id } = req.params;

      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      await project.delete();

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({
        error: "Failed to delete project",
        message: error.message,
      });
    }
  }

  async duplicateProject(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const originalProject = await Project.findById(id);
      if (!originalProject) {
        return res.status(404).json({ error: "Project not found" });
      }

      const duplicatedProject = await originalProject.duplicate(name);

      res.status(201).json(duplicatedProject.toJSON());
    } catch (error) {
      console.error("Error duplicating project:", error);
      res.status(500).json({
        error: "Failed to duplicate project",
        message: error.message,
      });
    }
  }
}

module.exports = new ProjectController();
