const { User } = require("../utils/connection");

const createUser = (data) => User.create(data);

const findUserByEmail = (email) => User.findOne({ email });

module.exports = {
  createUser,
  findUserByEmail
};
