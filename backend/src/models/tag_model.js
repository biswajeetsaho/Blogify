const { Tag } = require("../utils/connection");

const createTag = (data) => Tag.create(data);

const getAllTags = () => Tag.find();

module.exports = {
  createTag,
  getAllTags
};
