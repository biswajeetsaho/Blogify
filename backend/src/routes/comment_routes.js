

const express = require("express");
const router = express.Router();
const commentService = require("../services/comment_service");
const authMiddleware = require("../middlewares/auth_middleware");

// Public route to get comments
router.get("/:postId", async (req, res) => {
  try {
    const comments = await commentService.getPostComments(req.params.postId);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Protected routes
router.post("/", authMiddleware, async (req, res) => {
  try {
    const comment = await commentService.createComment(req.body, req.userId);
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/reply", authMiddleware, async (req, res) => {
  try {
    const reply = await commentService.reply(req.body, req.userId);
    res.status(201).json(reply);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/upvote/:id", authMiddleware, async (req, res) => {
  try {
    const result = await commentService.upvote(req.params.id, req.userId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/downvote/:id", authMiddleware, async (req, res) => {
  try {
    const result = await commentService.downvote(req.params.id, req.userId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/approve/:id", authMiddleware, async (req, res) => {
  try {
    const result = await commentService.approve(req.params.id, req.userId);
    res.json(result);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

router.post("/report/:id", async (req, res) => {
  try {
    const result = await commentService.report(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const result = await commentService.remove(req.params.id, req.userId);
    res.json({ message: "Comment deleted successfully", result });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

module.exports = router;

