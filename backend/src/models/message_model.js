const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        // Optional: if sharing a blog
        blog: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog",
            default: null
        },
        // Optional: text content
        content: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
