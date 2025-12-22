const express = require("express");
const {
  createTagService,
  getAllTagsService
} = require("../services/tag_service");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const tag = await createTagService(req.body.name);
    res.status(201).json(tag);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const tags = await getAllTagsService();
  res.json(tags);
});

module.exports = router;
