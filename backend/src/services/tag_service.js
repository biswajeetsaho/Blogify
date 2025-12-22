const {
    createTag,
    getAllTags
  } = require("../models/tag_model");
  
  const createTagService = async (name) => {
    if (!name) throw new Error("Tag name required");
    return createTag({ name });
  };
  
  const getAllTagsService = async () => {
    return getAllTags();
  };
  
  module.exports = {
    createTagService,
    getAllTagsService
  };
  