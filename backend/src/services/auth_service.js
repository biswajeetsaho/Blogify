const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  createUser,
  findUserByEmail
} = require("../models/user_model");

const signupService = async (email, password) => {
  if (!email || !password) {
    throw new Error("All fields required");
  }

  const userExists = await findUserByEmail(email);
  if (userExists) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  await createUser({ email, password: hashedPassword });
};

const loginService = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
};

module.exports = {
  signupService,
  loginService
};
