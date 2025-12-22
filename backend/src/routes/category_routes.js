const express = require("express");
const {
  createCategoryService,
  getAllCategoriesService
} = require("../services/category_service");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const category = await createCategoryService(req.body.name);
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const categories = await getAllCategoriesService();
  res.json(categories);
});

module.exports = router;
