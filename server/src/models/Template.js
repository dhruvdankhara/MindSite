const { getDatabase } = require("../config/database");

class Template {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.category = data.category;
    this.components = Array.isArray(data.components)
      ? data.components
      : JSON.parse(data.components || "[]");
    this.thumbnail = data.thumbnail;
    this.is_public = data.is_public;
    this.created_at = data.created_at;
  }

  static async findAll(options = {}) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      const {
        category = null,
        isPublic = true,
        limit = 50,
        offset = 0,
      } = options;

      let query = "SELECT * FROM templates WHERE is_public = ?";
      let params = [isPublic ? 1 : 0];

      if (category) {
        query += " AND category = ?";
        params.push(category);
      }

      query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
      params.push(limit, offset);

      db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const templates = rows.map((row) => new Template(row));
          resolve(templates);
        }
      });
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();

      db.get("SELECT * FROM templates WHERE id = ?", [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve(new Template(row));
        } else {
          resolve(null);
        }
      });
    });
  }

  static async create(templateData) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      const id = Date.now().toString();
      const now = new Date().toISOString();

      const query = `INSERT INTO templates 
        (id, name, description, category, components, thumbnail, is_public, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

      const values = [
        id,
        templateData.name,
        templateData.description || "",
        templateData.category || "general",
        JSON.stringify(templateData.components || []),
        templateData.thumbnail || null,
        templateData.is_public !== undefined ? templateData.is_public : 1,
        now,
      ];

      db.run(query, values, function (err) {
        if (err) {
          reject(err);
        } else {
          const newTemplate = new Template({
            id,
            ...templateData,
            created_at: now,
          });
          resolve(newTemplate);
        }
      });
    });
  }

  static async getCategories() {
    return new Promise((resolve, reject) => {
      const db = getDatabase();

      db.all(
        "SELECT DISTINCT category FROM templates WHERE is_public = 1",
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const categories = rows.map((row) => row.category);
            resolve(categories);
          }
        }
      );
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      category: this.category,
      components: this.components,
      thumbnail: this.thumbnail,
      is_public: this.is_public,
      created_at: this.created_at,
    };
  }
}

module.exports = Template;
