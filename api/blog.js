import { createClient } from "@libsql/client";
import sanitizeHtml from "sanitize-html";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export default async function handler(req, res) {
  // 1. Handle GET (Fetching Data)
  if (req.method === "GET") {
    const { id } = req.query;

    try {
      if (id) {
        // Fetch single post by ID
        const result = await turso.execute({
          sql: "SELECT ID, title, html, created_at, updated_at, categories FROM blogs WHERE ID = ?",
          args: [id],
        });

        if (!result.rows.length) {
          return res.status(404).json({ error: "Post not found" });
        }
        return res.status(200).json(result.rows[0]);
      }

      // Fetch all posts (ordered by newest)
      const result = await turso.execute(
        "SELECT ID as id, title, html, created_at, updated_at, categories FROM blogs ORDER BY created_at DESC"
      );
      return res.status(200).json(result.rows);
    } catch (err) {
      console.error("GET Error:", err);
      return res.status(500).json({ error: "Failed to fetch from database" });
    }
  }

  // 2. Handle POST (Saving New Data)
  if (req.method === "POST") {
    const { title, html, category } = req.body;

    if (!title || !html) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    // SANITIZE: Clean the HTML before it touches the DB
    const cleanHtml = sanitizeHtml(html, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'br']),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        'img': ['src', 'alt', 'loading', 'width', 'height']
      }
    });

    try {
      await turso.execute({
        sql: "INSERT INTO blogs (title, html, categories) VALUES (?, ?, ?)",
        args: [title, cleanHtml, category || "Uncategorized"],
      });
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("POST Error:", err);
      return res.status(500).json({ error: "Database save failed" });
    }
  }

  // Handle Unsupported Methods
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}