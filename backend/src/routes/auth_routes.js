const express = require("express");
const {
  signupService,
  loginService
} = require("../services/auth_service");
const { findUserById } = require("../models/user_model");
const auth = require("../middlewares/auth_middleware");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const { user, token } = await signupService(username, email, password);

    res.status(201).json({ user, token, message: "User created successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { user, token } = await loginService(req.body.email, req.body.password);
    res.json({ user, token });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const user = await findUserById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
