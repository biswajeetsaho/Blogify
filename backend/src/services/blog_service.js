const { createBlog, getAllBlogs, updateBlogById, deleteBlogById, searchPosts, getAllCategoriesFromBlogs, getAllTagsFromBlogs, likeBlog } = require("../models/blog_model");

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

const fetchCategoriesService = async () => {
  const categories = await getAllCategoriesFromBlogs();
  // Map to match frontend Category interface { _id, name }
  return categories.map(c => ({ _id: c._id, name: c._id }));
};

const fetchTagsService = async () => {
  const tags = await getAllTagsFromBlogs();
  // Map to match frontend Tag interface { _id, name }
  return tags.map(t => ({ _id: t._id, name: t._id }));
};

const likeBlogService = async (blogId, userId) => {
  return likeBlog(blogId, userId);
};


module.exports = {
  createBlogService,
  getAllBlogsService,
  updateBlogService,
  deleteBlogService,
  searchBlogService,
  fetchCategoriesService,
  fetchTagsService,
  likeBlogService
};
