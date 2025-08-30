const { getDatabase } = require("../config/database");

class Project {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.components = Array.isArray(data.components)
      ? data.components
      : JSON.parse(data.components || "[]");
    this.settings =
      typeof data.settings === "object"
        ? data.settings
        : JSON.parse(data.settings || "{}");
    this.thumbnail = data.thumbnail;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findAll(options = {}) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      const { limit = 50, offset = 0, orderBy = "updated_at DESC" } = options;

      const query = `SELECT * FROM projects ORDER BY ${orderBy} LIMIT ? OFFSET ?`;

      db.all(query, [limit, offset], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const projects = rows.map((row) => new Project(row));
          resolve(projects);
        }
      });
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();

      db.get("SELECT * FROM projects WHERE id = ?", [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve(new Project(row));
        } else {
          resolve(null);
        }
      });
    });
  }

  static async create(projectData) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      const id = Date.now().toString();
      const now = new Date().toISOString();

      const query = `INSERT INTO projects 
        (id, name, description, components, settings, thumbnail, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

      const values = [
        id,
        projectData.name,
        projectData.description || "",
        JSON.stringify(projectData.components || []),
        JSON.stringify(projectData.settings || {}),
        projectData.thumbnail || null,
        now,
        now,
      ];

      db.run(query, values, function (err) {
        if (err) {
          reject(err);
        } else {
          const newProject = new Project({
            id,
            ...projectData,
            created_at: now,
            updated_at: now,
          });
          resolve(newProject);
        }
      });
    });
  }

  async update(updates) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      const now = new Date().toISOString();

      const setClause = [];
      const values = [];

      if (updates.name !== undefined) {
        setClause.push("name = ?");
        values.push(updates.name);
      }

      if (updates.description !== undefined) {
        setClause.push("description = ?");
        values.push(updates.description);
      }

      if (updates.components !== undefined) {
        setClause.push("components = ?");
        values.push(JSON.stringify(updates.components));
      }

      if (updates.settings !== undefined) {
        setClause.push("settings = ?");
        values.push(JSON.stringify(updates.settings));
      }

      if (updates.thumbnail !== undefined) {
        setClause.push("thumbnail = ?");
        values.push(updates.thumbnail);
      }

      setClause.push("updated_at = ?");
      values.push(now);
      values.push(this.id);

      const query = `UPDATE projects SET ${setClause.join(", ")} WHERE id = ?`;

      db.run(query, values, function (err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          reject(new Error("Project not found"));
        } else {
          // Update instance properties
          Object.assign(this, updates);
          this.updated_at = now;
          resolve(this);
        }
      });
    });
  }

  async delete() {
    return new Promise((resolve, reject) => {
      const db = getDatabase();

      db.run("DELETE FROM projects WHERE id = ?", [this.id], function (err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          reject(new Error("Project not found"));
        } else {
          resolve(true);
        }
      });
    });
  }

  static async search(query, options = {}) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      const { limit = 20, offset = 0 } = options;

      const searchQuery = `
        SELECT * FROM projects 
        WHERE name LIKE ? OR description LIKE ? 
        ORDER BY updated_at DESC 
        LIMIT ? OFFSET ?
      `;

      const searchTerm = `%${query}%`;

      db.all(
        searchQuery,
        [searchTerm, searchTerm, limit, offset],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const projects = rows.map((row) => new Project(row));
            resolve(projects);
          }
        }
      );
    });
  }

  static async count() {
    return new Promise((resolve, reject) => {
      const db = getDatabase();

      db.get("SELECT COUNT(*) as count FROM projects", (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row.count);
        }
      });
    });
  }

  // Instance methods
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      components: this.components,
      settings: this.settings,
      thumbnail: this.thumbnail,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  async duplicate(newName) {
    const duplicateData = {
      name: newName || `${this.name} (Copy)`,
      description: this.description,
      components: [...this.components],
      settings: { ...this.settings },
      thumbnail: this.thumbnail,
    };

    return Project.create(duplicateData);
  }
}

module.exports = Project;
