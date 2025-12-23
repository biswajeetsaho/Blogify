const userModel = require("../models/user_model");

module.exports = {
  searchUsers: async (query) => {
    if (!query) return [];
    return await userModel.searchUsersByUsername(query);
  }
};
