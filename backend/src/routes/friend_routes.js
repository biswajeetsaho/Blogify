const express = require("express");
const auth = require("../middlewares/auth_middleware");
const friendService = require("../services/friend_service");

const router = express.Router();

/* Send request */
router.post("/send/:userId", auth, async (req, res) => {
  await friendService.sendRequest(req.userId, req.params.userId);
  res.json({ message: "Friend request sent" });
});

/* Accept request */
router.post("/accept/:userId", auth, async (req, res) => {
  await friendService.acceptRequest(req.params.userId, req.userId);
  res.json({ message: "Friend request accepted" });
});

/* Reject request */
router.post("/reject/:userId", auth, async (req, res) => {
  await friendService.rejectRequest(req.params.userId, req.userId);
  res.json({ message: "Friend request rejected" });
});

module.exports = router;
