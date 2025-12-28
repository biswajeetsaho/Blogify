const express = require("express");
const authMiddleware = require("../middlewares/auth_middleware");
const {
  getRecommendationsService,
  getFriendsService,
  getRequestsService,
  sendRequestService,
  acceptRequestService,
  rejectRequestService
} = require("../services/friend_service");

const router = express.Router();

// Get users we might know (not friends)
router.get("/recommendations", authMiddleware, async (req, res) => {
  try {
    const users = await getRecommendationsService(req.userId);
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get my friends
router.get("/list", authMiddleware, async (req, res) => {
  try {
    const friends = await getFriendsService(req.userId);
    res.json(friends);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get pending requests (sent & received)
router.get("/requests", authMiddleware, async (req, res) => {
  try {
    const requests = await getRequestsService(req.userId);
    res.json(requests);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Send Request
router.post("/request/:recipientId", authMiddleware, async (req, res) => {
  try {
    const result = await sendRequestService(req.userId, req.params.recipientId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Accept Request
router.post("/accept/:requesterId", authMiddleware, async (req, res) => {
  try {
    const result = await acceptRequestService(req.userId, req.params.requesterId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Reject/Cancel Request or Unfriend
router.post("/reject/:targetId", authMiddleware, async (req, res) => {
  try {
    // targetId can be the one we sent to (cancel) or one who sent to us (reject)
    const result = await rejectRequestService(req.userId, req.params.targetId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
