const express = require("express");
const authMiddleware = require("../middlewares/auth_middleware");
const Message = require("../models/message_model");
const { User } = require("../utils/connection");

const router = express.Router();

// Send a message (text or shared blog)
router.post("/send", authMiddleware, async (req, res) => {
    try {
        const { recipientId, blogId, content } = req.body;

        if (!recipientId) {
            return res.status(400).json({ error: "Recipient is required" });
        }

        const message = await Message.create({
            sender: req.userId,
            recipient: recipientId,
            blog: blogId || null,
            content: content || ""
        });

        res.json(message);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get conversation with a specific friend
router.get("/:friendId", authMiddleware, async (req, res) => {
    try {
        const { friendId } = req.params;

        const messages = await Message.find({
            $or: [
                { sender: req.userId, recipient: friendId },
                { sender: friendId, recipient: req.userId }
            ]
        })
            .sort({ createdAt: 1 }) // Oldest first for chat history
            .populate("blog", "title _id"); // Populate blog title for display

        res.json(messages);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
