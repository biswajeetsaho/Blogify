const { createBlog, getAllBlogs,updateBlogById,deleteBlogById,searchPosts } = require("../models/blog_model");

const createBlogService = async (data, userId) => {
  if (!data.title || !data.content) {
    throw new Error("Title and content are required");
  }

  return createBlog({
    ...data,
    author: userId
  });
};

const getAllBlogsService = async () => {
  return getAllBlogs();
};

const updateBlogService = async (id, data, userId) => {
  const blog = await updateBlogById(id, data);
  if (!blog) throw new Error("Blog not found");
  return blog;
};

const deleteBlogService = async (id) => {
  const blog = await deleteBlogById(id);
  if (!blog) throw new Error("Blog not found");
};

const searchBlogService = async (query) => {
  return await searchPosts(query);
};

module.exports = {
  createBlogService,
  getAllBlogsService,
  updateBlogService,
  deleteBlogService,
  searchBlogService
};
