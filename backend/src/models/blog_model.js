const { Blog } = require("../utils/connection");

const createBlog = (data) => Blog.create(data);

const getAllBlogs = () => Blog.find().populate("author", "email");

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


module.exports = {
  createBlog,
  getAllBlogs,
  updateBlogById,
  deleteBlogById,
  searchPosts
};
