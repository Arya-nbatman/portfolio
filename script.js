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
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// POST endpoint to save blogs
app.post("/blogs", async (req, res) => {
  const { title, html } = req.body;

  if (!title || !html) {
    return res
      .status(400)
      .json({ success: false, error: "Title or HTML missing" });
  }

  try {
    await turso.execute({
      sql: `INSERT INTO blogs (title, html) VALUES (?, ?)`,
      args: [title, html],
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));

const toggleBtn = document.getElementById("theme-toggle");
const htmlElement = document.documentElement;

