const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

/* USER SCHEMA */
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    friends: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],

    sentFriendRequests: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],

    receivedFriendRequests: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ]
  },
  { timestamps: true }
);



/* BLOG SCHEMA */

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      required: true
    },

    categories: {
      type: [String],
      default: []
    },

    tags: {
      type: [String],
      default: []
    },

    /* 🔹 MULTIMEDIA */
    media: [
      {
        fileType: {
          type: String, // "image" | "video"
          enum: ["image", "video"]
        },
        filePath: {
          type: String // stored file path / URL
        }
      }
    ],

    /* 🔹 LIKES */
    likesCount: {
      type: Number,
      default: 0
    },

    likedUsers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: []
    },

    /* 🔹 COMMENTS COUNT (DIRECT ONLY) */
    commentsCount: {
      type: Number,
      default: 0
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);


/* CATEGORY SCHEMA */
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

/* TAG SCHEMA */
const tagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

/* COMMENT SCHEMA */



const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: String,
    required: true
  },
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null   // null = top-level comment
  },
  upvotes: {
    type: Number,
    default: 0
  },
  downvotes: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
const Blog = mongoose.model("Blog", blogSchema);
const Category = mongoose.model("Category", categorySchema);
const Tag = mongoose.model("Tag", tagSchema);
const Comment = mongoose.model("Comment", commentSchema);

module.exports = {
  connectDB,
  User,
  Blog,
  Category,
  Tag,
  Comment
};
