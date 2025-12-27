import { createClient } from "@libsql/client";
import DOMPurify from "isomorphic-dompurify";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export default async function handler(req, res) {
  // 1. Handle GET Single Post or All Posts
  if (req.method === "GET") {
    const { id } = req.query;

    if (id) {
      const result = await turso.execute({
        sql: "SELECT ID, title, html, created_at, updated_at, categories FROM blogs WHERE ID = ?",
        args: [id],
      });

      if (!result.rows.length) {
        return res.status(404).json({ error: "Post not found" });
      }
      return res.json(result.rows[0]);
    }

    const result = await turso.execute(
      "SELECT ID as id, title, html, created_at, updated_at, categories FROM blogs ORDER BY created_at DESC"
    );
    return res.status(200).json(result.rows);
  }

  // 2. Handle POST (Create New Blog)
  if (req.method === "POST") {
    const { title, html, category } = req.body;

    if (!title || !html) {
      return res.status(400).json({ error: "Title and content required" });
    }

    // SANITIZE: Clean the HTML before saving to DB
    const cleanHtml = DOMPurify.sanitize(html);

    try {
      await turso.execute({
        sql: "INSERT INTO blogs (title, html, categories) VALUES (?, ?, ?)",
        args: [title, cleanHtml, category || "Uncategorized"],
      });
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
  }

  res.status(405).end();
}
