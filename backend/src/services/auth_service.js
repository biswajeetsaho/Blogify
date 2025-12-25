const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  createUser,
  findUserByEmail,
  findUserByUsername
} = require("../models/user_model");

const signupService = async (username, email, password) => {
  // validation
  if (!username || !email || !password) {
    throw new Error("All fields (username, email, password) are required");
  }

  // check email
  const emailExists = await findUserByEmail(email);
  if (emailExists) throw new Error("Email already exists");

  // check username
  const usernameExists = await findUserByUsername(username);
  if (usernameExists) throw new Error("Username already exists");

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
  const user = await createUser({
    username,
    email,
    password: hashedPassword
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  return { user, token };
};

const loginService = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  return { user, token };
};

module.exports = {
  signupService,
  loginService
};
