const { Blog } = require("../utils/connection");

const createBlog = (data) => Blog.create(data);

const getAllBlogs = () => Blog.find().populate("author", "username email");

const updateBlogById = (id, data) => {
  return Blog.findByIdAndUpdate(id, data, { new: true });
};

const deleteBlogById = (id) => {
  return Blog.findByIdAndDelete(id);
};


const searchPosts = (query) => {
  const searchString = String(query || ""); // Fallback to empty string if null/undefined

  return Blog.find({
    $or: [
      { title: { $regex: searchString, $options: "i" } },
      { categories: searchString },
      { tags: searchString }
    ]
  });
};

/* GET ALL UNIQUE CATEGORIES */
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

const likeBlog = (blogId, userId) => {
  return Blog.findByIdAndUpdate(
    blogId,
    {
      $addToSet: { likedUsers: userId },
      $inc: { likesCount: 1 }
    },
    { new: true }
  );
};




module.exports = {
  createBlog,
  getAllBlogs,
  updateBlogById,
  deleteBlogById,
  searchPosts,
  getAllCategoriesFromBlogs,
  getAllTagsFromBlogs,
  likeBlog
};
