const {
    createCategory,
    getAllCategories
  } = require("../models/category_model");
  
  const createCategoryService = async (name) => {
    if (!name) throw new Error("Category name required");
    return createCategory({ name });
  };
  
  const getAllCategoriesService = async () => {
    return getAllCategories();
  };
  
  module.exports = {
    createCategoryService,
    getAllCategoriesService
  };
  