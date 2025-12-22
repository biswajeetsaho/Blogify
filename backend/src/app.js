const express = require("express");
const cors = require("cors");
const { connectDB } = require("./utils/connection");
const setupDemoData = require("./models/dbSetup_model");

const authRoutes = require("./routes/auth_routes");
const blogRoutes = require("./routes/blog_routes");
const categoryRoutes = require("./routes/category_routes");
const tagRoutes = require("./routes/tag_routes");
const commentRoutes = require("./routes/comment_routes");

const app = express();

// connectDB();
connectDB().then(() => {
    setupDemoData(); // 👈 seed demo data
  });

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", blogRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/tags", tagRoutes);
app.use("/api/v1/comments", commentRoutes);

module.exports = app;
