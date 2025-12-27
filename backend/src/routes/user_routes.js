const express = require("express");
const auth = require("../middlewares/auth_middleware");
const userService = require("../services/user_service");

const router = express.Router();

router.get("/search", auth, async (req, res) => {
  const users = await userService.searchUsers(req.query.q);
  res.json(users);
});

router.put("/theme", auth, async (req, res) => {
  try {
    const updatedUser = await userService.updateUserTheme(req.userId, req.body);
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
