const express = require("express");
const auth = require("../middlewares/auth_middleware");
const userService = require("../services/user_service");

const router = express.Router();

router.get("/search", auth, async (req, res) => {
  const users = await userService.searchUsers(req.query.q);
  res.json(users);
});

module.exports = router;
