const express = require("express");
const authMiddleware = require("../middlewares/auth_middleware");
const {
  createBlogService,
  getAllBlogsService,
  updateBlogService,
  deleteBlogService,
  searchBlogService,
  fetchCategoriesService,
  fetchTagsService,
  likeBlogService,
  fetchUserBlogsService,
  // New Services
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
  createTagService,
  updateTagService,
  deleteTagService
} = require("../services/blog_service");
const upload = require("../middlewares/upload_middleware");

const router = express.Router();

// router.post("/", authMiddleware, async (req, res) => {
//   try {
//     const blog = await createBlogService(req.body, req.userId);
//     res.status(201).json(blog);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

router.post(
  "/",
  authMiddleware,
  upload.array("media", 5),
  async (req, res) => {
    try {
      const mediaFiles = req.files.map(file => ({
        fileType: file.mimetype.startsWith("image") ? "image" : "video",
        filePath: `/uploads/${file.filename}`
      }));

      const blog = await createBlogService(
        {
          ...req.body,
          media: mediaFiles
        },
        req.userId
      );

      res.status(201).json(blog);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

router.get("/", async (req, res) => {
  const blogs = await getAllBlogsService();
  res.json(blogs);
});

router.get("/my-blogs", authMiddleware, async (req, res) => {
  try {
    const blogs = await fetchUserBlogsService(req.userId);
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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

/* GET ALL CATEGORIES */
router.get("/categories/all", async (req, res) => {
  try {
    const categories = await fetchCategoriesService();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/categories", authMiddleware, async (req, res) => {
  try {
    const category = await createCategoryService(req.body.name, req.userId);
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/categories/:id", authMiddleware, async (req, res) => {
  try {
    const category = await updateCategoryService(req.params.id, req.body.name, req.userId);
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/categories/:id", authMiddleware, async (req, res) => {
  try {
    await deleteCategoryService(req.params.id, req.userId);
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* GET ALL TAGS */
router.get("/tags/all", async (req, res) => {
  try {
    const tags = await fetchTagsService();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/tags", authMiddleware, async (req, res) => {
  try {
    const tag = await createTagService(req.body.name, req.userId);
    res.status(201).json(tag);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/tags/:id", authMiddleware, async (req, res) => {
  try {
    const tag = await updateTagService(req.params.id, req.body.name, req.userId);
    res.json(tag);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/tags/:id", authMiddleware, async (req, res) => {
  try {
    await deleteTagService(req.params.id, req.userId);
    res.json({ message: "Tag deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id/like", authMiddleware, async (req, res) => {
  const blog = await likeBlogService(req.params.id, req.userId);
  res.json(blog);
});


module.exports = router;
