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
    ],

    /* THEME PREFERENCES */
    themePreferences: {
      backgroundColor: {
        type: String,
        default: '#ffffff'
      },
      fontFamily: {
        type: String,
        default: 'Inter'
      },
      textColor: {
        type: String,
        default: '#000000'
      }
    }
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

    /* 🔹 ANALYTICS */
    analytics: {
      views: {
        type: Number,
        default: 0
      },
      uniqueViewers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
      },
      viewHistory: [{
        date: { type: Date, default: Date.now },
        count: { type: Number, default: 1 }
      }]
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["draft", "published", "scheduled"],
      default: "published"
    },
    publishedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);


/* CATEGORY SCHEMA */
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

/* TAG SCHEMA */
const tagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

/* COMMENT SCHEMA */



const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
    required: true
  },
  author: {
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
  likes: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],
  dislikes: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],
  isApproved: {
    type: Boolean,
    default: true
  },
  reports: {
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
