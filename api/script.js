import express from "express";
import { createClient } from "@libsql/client";
import "dotenv/config";
import cors from "cors";

const app = express();
app.use(express.json()); // Parse JSON body

app.use(
  cors({
    origin: "http://127.0.0.1:5500", // only allow this origin
  })
);
// Initialize Turso client
const turso = createClient({
  url: process.env.local.TURSO_DATABASE_URL,
  authToken: process.env.local.TURSO_AUTH_TOKEN,
});

// POST endpoint to save blogs
app.post("/blogs", async (req, res) => {
  const { title, html, category } = req.body;

  if (!title || !html || !category) {
    return res
      .status(400)
      .json({ success: false, error: "Title or HTML missing" });
  }

  try {
    await turso.execute({
      sql: `INSERT INTO blogs (title, html, categories) VALUES (?, ?, ?)`,
      args: [title, html, category],
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/blogs", async (req, res) => {
  try {
    const result = await turso.execute({
      sql: `SELECT id, title, html, created_at, updated_at, categories FROM blogs ORDER BY created_at DESC`,
    });

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default app;

