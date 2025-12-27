const { Blog, Category, Tag } = require("../utils/connection");

const createBlog = (data) => Blog.create(data);

const getAllBlogs = () =>
  Blog.find({
    $or: [{ status: "published" }, { status: { $exists: false } }],
    publishedAt: { $lte: new Date() }
  }).populate("author", "username email");

const updateBlogById = (id, data) => {
  return Blog.findByIdAndUpdate(id, data, { new: true });
};

const deleteBlogById = (id) => {
  return Blog.findByIdAndDelete(id);
};


const searchPosts = (query) => {
  const searchString = String(query || ""); // Fallback to empty string if null/undefined

  return Blog.find({
    $or: [{ status: "published" }, { status: { $exists: false } }],
    publishedAt: { $lte: new Date() },
    $or: [
      { title: { $regex: searchString, $options: "i" } },
      { categories: searchString },
      { tags: searchString }
    ]
  }).populate("author", "username email");
};

/* GET ALL UNIQUE CATEGORIES (This gets USED categories, potentially we want ALL created categories for the manager) */
const getAllCategoriesFromBlogs = () => {
  return Blog.aggregate([
    { $unwind: "$categories" },
    { $group: { _id: "$categories" } }
  ]);
};

/* GET ALL UNIQUE TAGS */
const getAllTagsFromBlogs = () => {
  return Blog.aggregate([
    { $unwind: "$tags" },
    { $group: { _id: "$tags" } }
  ]);
};

/* CATEGORY CRUD */
const createCategory = (data) => Category.create(data);
const getAllCategories = () => Category.find().sort({ name: 1 });
const getCategoryById = (id) => Category.findById(id);
const updateCategoryById = (id, data) => Category.findByIdAndUpdate(id, data, { new: true });
const deleteCategoryById = (id) => Category.findByIdAndDelete(id);

/* TAG CRUD */
const createTag = (data) => Tag.create(data);
const getAllTags = () => Tag.find().sort({ name: 1 });
const getTagById = (id) => Tag.findById(id);
const updateTagById = (id, data) => Tag.findByIdAndUpdate(id, data, { new: true });
const deleteTagById = (id) => Tag.findByIdAndDelete(id);

const getBlogsByAuthorId = (userId) => {
  return Blog.find({ author: userId }).sort({ createdAt: -1 }).populate("author", "username email");
};

const updateScheduledToPublished = async () => {
  const result = await Blog.updateMany(
    {
      status: "scheduled",
      publishedAt: { $lte: new Date() }
    },
    {
      $set: { status: "published" }
    }
  );
  return result;
};


const likeBlog = async (blogId, userId) => {
  const blog = await Blog.findById(blogId);
  if (!blog) throw new Error("Blog not found");

  const hasLiked = blog.likedUsers.includes(userId);

  if (hasLiked) {
    // Unlike: remove user from likedUsers and decrement count
    return Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likedUsers: userId },
        $inc: { likesCount: -1 }
      },
      { new: true }
    ).populate("author", "username email");
  } else {
    // Like: add user to likedUsers and increment count
    return Blog.findByIdAndUpdate(
      blogId,
      {
        $addToSet: { likedUsers: userId },
        $inc: { likesCount: 1 }
      },
      { new: true }
    ).populate("author", "username email");
  }
};




module.exports = {
  createBlog,
  getAllBlogs,
  updateBlogById,
  deleteBlogById,
  searchPosts,
  getAllCategoriesFromBlogs,
  getAllTagsFromBlogs,
  likeBlog,
  getBlogsByAuthorId,
  updateScheduledToPublished,
  // Categories
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  // Tags
  createTag,
  getAllTags,
  getTagById,
  updateTagById,
  deleteTagById,
  // Bulk Updates for Rename
  updateCategoryInBlogs: async (oldName, newName) => {
    return Blog.updateMany(
      { categories: oldName },
      { $set: { "categories.$": newName } }
    );
  },
  updateTagInBlogs: async (oldName, newName) => {
    return Blog.updateMany(
      { tags: oldName },
      { $set: { "tags.$": newName } }
    );
  },
  // Usage Checks for Delete
  countBlogsWithCategory: (name) => Blog.countDocuments({ categories: name }),
  countBlogsWithTag: (name) => Blog.countDocuments({ tags: name })
};
