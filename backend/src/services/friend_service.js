const userModel = require("../models/user_model");

module.exports = {
  sendRequest: async (fromId, toId) => {
    if (fromId === toId)
      throw new Error("Cannot send request to yourself");

    await userModel.sendFriendRequestDB(fromId, toId);
  },

  acceptRequest: async (fromId, toId) => {
    await userModel.acceptFriendRequestDB(fromId, toId);
  },

  rejectRequest: async (fromId, toId) => {
    await userModel.rejectFriendRequestDB(fromId, toId);
  }
};
