// index.js
const express = require("express");
const ideaRoutes = require("./routes/ideaRoutes");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
}));

app.use("/api/ideas", ideaRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Only start server if not in test
if (process.env.NODE_ENV !== "test") {
  const mongoose = require("mongoose");
  mongoose.connect("mongodb+srv://username:password@cluster0.mongodb.net/dbname")
    .then(() => console.log("DB connected"))
    .catch(err => console.log(err));

  app.listen(8080, () => console.log("API running on port 8080"));
}

module.exports = app;  // export app for supertest
