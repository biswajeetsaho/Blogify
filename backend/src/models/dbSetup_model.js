const { User, Blog } = require("../utils/connection");
const bcrypt = require("bcryptjs");

const setupDemoData = async () => {
  // Check if data already exists
  const userCount = await User.countDocuments();
  if (userCount > 0) {
    console.log("Demo data already exists");
    return;
  }

  // Create demo users
  const password = await bcrypt.hash("123456", 10);

  const demoUser = await User.create({
    email: "demo@blogify.com",
    password
  });

  // Create demo blogs
  await Blog.insertMany([
    {
      title: "Welcome to Blogify",
      content: "This is the first demo blog post.",
      categories: ["General"],
      tags: ["Welcome", "Demo"],
      author: demoUser._id
    },
    {
      title: "MERN Stack Blog",
      content: "This blog explains MERN stack basics.",
      categories: ["Tech"],
      tags: ["MERN", "Node"],
      author: demoUser._id
    }
  ]);

  console.log("Demo data inserted successfully");
};

module.exports = setupDemoData;
