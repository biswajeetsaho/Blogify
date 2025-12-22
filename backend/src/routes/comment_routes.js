// const express = require("express");
// const authMiddleware = require("../middlewares/auth_middleware");
// const {
//   addCommentService,
//   getCommentsService
// } = require("../services/comment_service");

// const router = express.Router();

// router.post("/:blogId", authMiddleware, async (req, res) => {
//   try {
//     const comment = await addCommentService(
//       req.body.content,
//       req.params.blogId,
//       req.userId
//     );
//     res.status(201).json(comment);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// router.get("/:blogId", async (req, res) => {
//   const comments = await getCommentsService(req.params.blogId);
//   res.json(comments);
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const commentService = require("../services/comment_service");

router.post("/", async (req, res) => {
  try {
    const comment = await commentService.createComment(req.body);
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:postId", async (req, res) => {
  const comments = await commentService.getPostComments(req.params.postId);
  res.json(comments);
});

router.post("/reply", async (req, res) => {
  const reply = await commentService.reply(req.body);
  res.json(reply);
});

router.put("/upvote/:id", async (req, res) => {
  const result = await commentService.upvote(req.params.id);
  res.json(result);
});

router.put("/downvote/:id", async (req, res) => {
  const result = await commentService.downvote(req.params.id);
  res.json(result);
});

router.delete("/:id", async (req, res) => {
  const result = await commentService.remove(req.params.id);
  res.json(result);
});

module.exports = router;

