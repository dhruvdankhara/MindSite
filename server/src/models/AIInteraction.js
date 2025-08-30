const { getDatabase } = require("../config/database");

class AIInteraction {
  constructor(data) {
    this.id = data.id;
    this.prompt = data.prompt;
    this.response = data.response;
    this.component_generated =
      typeof data.component_generated === "object"
        ? data.component_generated
        : JSON.parse(data.component_generated || "null");
    this.created_at = data.created_at;
  }

  static async create(interactionData) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      const id = Date.now().toString();
      const now = new Date().toISOString();

      const query = `INSERT INTO ai_interactions 
        (id, prompt, response, component_generated, created_at) 
        VALUES (?, ?, ?, ?, ?)`;

      const values = [
        id,
        interactionData.prompt,
        interactionData.response || "",
        JSON.stringify(interactionData.component_generated || null),
        now,
      ];

      db.run(query, values, function (err) {
        if (err) {
          reject(err);
        } else {
          const newInteraction = new AIInteraction({
            id,
            ...interactionData,
            created_at: now,
          });
          resolve(newInteraction);
        }
      });
    });
  }

  static async getRecentInteractions(limit = 10) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();

      db.all(
        "SELECT * FROM ai_interactions ORDER BY created_at DESC LIMIT ?",
        [limit],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const interactions = rows.map((row) => new AIInteraction(row));
            resolve(interactions);
          }
        }
      );
    });
  }

  static async getInteractionStats() {
    return new Promise((resolve, reject) => {
      const db = getDatabase();

      const queries = [
        "SELECT COUNT(*) as total FROM ai_interactions",
        'SELECT COUNT(*) as today FROM ai_interactions WHERE DATE(created_at) = DATE("now")',
        'SELECT COUNT(*) as this_week FROM ai_interactions WHERE created_at >= DATE("now", "-7 days")',
      ];

      Promise.all(
        queries.map(
          (query) =>
            new Promise((resolve, reject) => {
              db.get(query, (err, row) => {
                if (err) reject(err);
                else resolve(row);
              });
            })
        )
      )
        .then((results) => {
          resolve({
            total:
              results[0].total || results[0].today || results[0].this_week || 0,
            today: results[1].today || 0,
            thisWeek: results[2].this_week || 0,
          });
        })
        .catch(reject);
    });
  }

  toJSON() {
    return {
      id: this.id,
      prompt: this.prompt,
      response: this.response,
      component_generated: this.component_generated,
      created_at: this.created_at,
    };
  }
}

module.exports = AIInteraction;
