const sqlite3 = require("sqlite3").verbose();
const path = require("path");

class Database {
  constructor() {
    this.db = null;
    this.init();
  }

  init() {
    const dbPath = path.join(__dirname, "../../database.sqlite");
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error("❌ Error opening database:", err.message);
      } else {
        console.log("✅ Connected to SQLite database");
        this.createTables();
      }
    });
  }

  createTables() {
    this.db.serialize(() => {
      // Projects table
      this.db.run(`CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        components TEXT,
        settings TEXT,
        thumbnail TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Templates table
      this.db.run(`CREATE TABLE IF NOT EXISTS templates (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT,
        components TEXT,
        thumbnail TEXT,
        is_public INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // AI interactions table
      this.db.run(`CREATE TABLE IF NOT EXISTS ai_interactions (
        id TEXT PRIMARY KEY,
        prompt TEXT NOT NULL,
        response TEXT,
        component_generated TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Users table (for future authentication)
      this.db.run(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT,
        name TEXT,
        avatar TEXT,
        settings TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Project collaborators table
      this.db.run(`CREATE TABLE IF NOT EXISTS project_collaborators (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        role TEXT DEFAULT 'viewer',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`);

      console.log("✅ Database tables created/verified");
    });
  }

  getDatabase() {
    return this.db;
  }

  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error("❌ Error closing database:", err.message);
        } else {
          console.log("✅ Database connection closed");
        }
      });
    }
  }
}

// Singleton pattern
let instance = null;

function getDatabase() {
  if (!instance) {
    instance = new Database();
  }
  return instance.getDatabase();
}

function closeDatabase() {
  if (instance) {
    instance.close();
    instance = null;
  }
}

module.exports = {
  getDatabase,
  closeDatabase,
};
