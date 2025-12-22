const express = require("express");
const authMiddleware = require("../middlewares/auth_middleware");
const {
  createBlogService,
  getAllBlogsService,
  updateBlogService,
  deleteBlogService,
  searchBlogService
} = require("../services/blog_service");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const blog = await createBlogService(req.body, req.userId);
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const blogs = await getAllBlogsService();
  res.json(blogs);
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const blog = await updateBlogService(
      req.params.id,
      req.body,
      req.userId
    );
    res.json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await deleteBlogService(req.params.id);
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/search", async (req, res) => {
  const { q } = req.query;
  const results = await searchBlogService(q);
  res.json(results);
});



module.exports = router;
