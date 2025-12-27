const {
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
  // Model imports
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  updateCategoryInBlogs,
  countBlogsWithCategory,
  createTag,
  getAllTags,
  getTagById,
  updateTagById,
  deleteTagById,
  updateTagInBlogs,
  countBlogsWithTag,
} = require("../models/blog_model");

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
  // Auto-publish any scheduled blogs that are due
  await updateScheduledToPublished();
  return getAllBlogs();
};

const fetchUserBlogsService = async (userId) => {
  // Also update scheduled blogs when checking my own blogs, ensuring I see up-to-date statuses
  await updateScheduledToPublished();
  return getBlogsByAuthorId(userId);
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

/* CATEGORY SERVICES */
const fetchCategoriesService = async () => {
  return await getAllCategories();
};

const createCategoryService = async (name, userId) => {
  if (!name) throw new Error("Category name is required");
  return await createCategory({ name, creator: userId });
};

const updateCategoryService = async (id, name, userId) => {
  const category = await getCategoryById(id);
  if (!category) throw new Error("Category not found");

  if (category.creator.toString() !== userId.toString()) {
    throw new Error("You are not authorized to edit this category");
  }

  const oldName = category.name;
  if (oldName === name) return category;

  // Update Category Doc
  const updated = await updateCategoryById(id, { name });

  // Update references in Blogs
  await updateCategoryInBlogs(oldName, name);

  return updated;
};

const deleteCategoryService = async (id, userId) => {
  const category = await getCategoryById(id);
  if (!category) throw new Error("Category not found");

  if (category.creator.toString() !== userId.toString()) {
    throw new Error("You are not authorized to delete this category");
  }

  const usageCount = await countBlogsWithCategory(category.name);
  if (usageCount > 0) {
    throw new Error(`This category is used in ${usageCount} blog(s) and cannot be deleted.`);
  }

  return await deleteCategoryById(id);
};

/* TAG SERVICES */
const fetchTagsService = async () => {
  return await getAllTags();
};

const createTagService = async (name, userId) => {
  if (!name) throw new Error("Tag name is required");
  return await createTag({ name, creator: userId });
};

const updateTagService = async (id, name, userId) => {
  const tag = await getTagById(id);
  if (!tag) throw new Error("Tag not found");

  if (tag.creator.toString() !== userId.toString()) {
    throw new Error("You are not authorized to edit this tag");
  }

  const oldName = tag.name;
  if (oldName === name) return tag;

  const updated = await updateTagById(id, { name });

  await updateTagInBlogs(oldName, name);

  return updated;
};

const deleteTagService = async (id, userId) => {
  const tag = await getTagById(id);
  if (!tag) throw new Error("Tag not found");

  if (tag.creator.toString() !== userId.toString()) {
    throw new Error("You are not authorized to delete this tag");
  }

  const usageCount = await countBlogsWithTag(tag.name);
  if (usageCount > 0) {
    throw new Error(`This tag is used in ${usageCount} blog(s) and cannot be deleted.`);
  }

  return await deleteTagById(id);
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
  likeBlogService,
  fetchUserBlogsService,
  // Category & Tag Exports
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
  createTagService,
  updateTagService,
  deleteTagService
};
