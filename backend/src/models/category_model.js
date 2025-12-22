const { Category } = require("../utils/connection");

const createCategory = (data) => Category.create(data);

const getAllCategories = () => Category.find();

module.exports = {
  createCategory,
  getAllCategories
};
