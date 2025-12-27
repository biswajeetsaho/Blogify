const { User } = require("../utils/connection");

/* AUTH RELATED */
const createUser = (data) => User.create(data);

const findUserByEmail = (email) => User.findOne({ email });

const findUserById = (id) => User.findById(id);

const findUserByUsername = (username) =>
  User.findOne({ username });

/* FRIEND REQUEST OPERATIONS */
const sendFriendRequestDB = async (fromId, toId) => {
  await User.findByIdAndUpdate(fromId, {
    $addToSet: { sentFriendRequests: toId }
  });

  await User.findByIdAndUpdate(toId, {
    $addToSet: { receivedFriendRequests: fromId }
  });
};

const acceptFriendRequestDB = async (fromId, toId) => {
  await User.findByIdAndUpdate(toId, {
    $pull: { receivedFriendRequests: fromId },
    $addToSet: { friends: fromId }
  });

  await User.findByIdAndUpdate(fromId, {
    $pull: { sentFriendRequests: toId },
    $addToSet: { friends: toId }
  });
};

const rejectFriendRequestDB = async (fromId, toId) => {
  await User.findByIdAndUpdate(toId, {
    $pull: { receivedFriendRequests: fromId }
  });

  await User.findByIdAndUpdate(fromId, {
    $pull: { sentFriendRequests: toId }
  });
};

/* USER SEARCH */
const searchUsersByUsername = (query) =>
  User.find({
    username: { $regex: query, $options: "i" }
  }).select("username email");

/* THEME UPDATE */
const updateUserTheme = (userId, themeData) =>
  User.findByIdAndUpdate(
    userId,
    { $set: themeData },
    { new: true }
  ).select('-password');

module.exports = {
  // auth
  createUser,
  findUserByEmail,

  // user
  findUserById,
  findUserByUsername,
  searchUsersByUsername,

  // theme
  updateUserTheme,

  // friends
  sendFriendRequestDB,
  acceptFriendRequestDB,
  rejectFriendRequestDB
};
