const express = require("express");
const {
  signupService,
  loginService
} = require("../services/auth_service");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    await signupService(req.body.email, req.body.password);
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const token = await loginService(req.body.email, req.body.password);
    res.json({ token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

module.exports = router;
