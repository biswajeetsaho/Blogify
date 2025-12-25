const bcrypt = require("bcryptjs");
const {
  User,
  Blog,
  Comment,
  Category,
  Tag
} = require("../utils/connection");

const seedDatabase = async () => {
  const userCount = await User.countDocuments();
  if (userCount > 0) {
    console.log("Database already has data. Skipping seed.");
    return;
  }

  console.log("Seeding extensive Software Engineering demo data...");

  const password = await bcrypt.hash("123456789", 10);

  /* ------------------ CATEGORIES ------------------ */
  const categories = await Category.insertMany([
    { name: "Fullstack Development" },
    { name: "DevOps & Cloud" },
    { name: "Mobile Engineering" },
    { name: "AI & Machine Learning" },
    { name: "Software Architecture" },
    { name: "Testing & QA" }
  ]);

  /* ------------------ TAGS ------------------ */
  const tags = await Tag.insertMany([
    { name: "React" }, { name: "NodeJS" }, { name: "Docker" },
    { name: "Kubernetes" }, { name: "Python" }, { name: "TypeScript" },
    { name: "AWS" }, { name: "GraphQL" }, { name: "CI/CD" }
  ]);

  /* ------------------ USERS ------------------ */
  const users = await User.insertMany([
    { username: "john_doe", email: "john@blogify.com", password },
    { username: "jane_smith", email: "jane@blogify.com", password },
    { username: "alex_dev", email: "alex@blogify.com", password },
    { username: "sarah_cloud", email: "sarah@blogify.com", password },
    { username: "mike_logic", email: "mike@blogify.com", password },
    { username: "emily_ai", email: "emily@blogify.com", password }
  ]);

  /* ------------------ SOCIAL INTERACTIONS (Initial) ------------------ */
  // Friendships
  users[0].friends.push(users[1]._id);
  users[1].friends.push(users[0]._id);
  users[2].friends.push(users[3]._id);
  users[3].friends.push(users[2]._id);

  // Requests
  users[4].sentFriendRequests.push(users[0]._id);
  users[0].receivedFriendRequests.push(users[4]._id);
  users[5].sentFriendRequests.push(users[2]._id);
  users[2].receivedFriendRequests.push(users[5]._id);

  await Promise.all(users.map(u => u.save()));

  /* ------------------ BLOGS GENERATION ------------------ */
  const blogData = [
    {
      title: "Mastering Clean Code in JavaScript",
      subtitle: "Best practices for writing maintainable and scalable JS applications.",
      content: "Clean code is not just about aesthetics; it is about communication. In this post, we explore SOLID principles applied to modern JavaScript.",
      category: "Fullstack Development",
      tags: ["JavaScript", "Software Architecture"],
      authorIdx: 0
    },
    {
      title: "Dockerizing Your Microservices",
      subtitle: "A complete guide to containerizing Node.js and MongoDB apps.",
      content: "Containers have revolutionized how we deploy software. Learn how to write efficient Dockerfiles and use Docker Compose for local development.",
      category: "DevOps & Cloud",
      tags: ["Docker", "NodeJS"],
      authorIdx: 1
    },
    {
      title: "The Rise of TypeScript in 2024",
      subtitle: "Why type safety is becoming mandatory for large scale teams.",
      content: "TypeScript has moved from a niche choice to the industry standard. We discuss how deep type checking prevents production bugs.",
      category: "Frontend Engineering",
      tags: ["TypeScript", "React"],
      authorIdx: 2
    },
    {
      title: "Introduction to Kubernetes for Developers",
      subtitle: "Moving beyond basic containers to orchestration.",
      content: "Kubernetes can be intimidating. Here is a developer-centric guide to understanding Pods, Deployments and Services.",
      category: "DevOps & Cloud",
      tags: ["Kubernetes", "AWS"],
      authorIdx: 3
    },
    {
      title: "Building Real-time Apps with GraphQL Subscriptions",
      subtitle: "Moving away from traditional polling for live updates.",
      content: "GraphQL is not just for queries and mutations. Learn how to implement websocket-based subscriptions for real-time features.",
      category: "Backend Engineering",
      tags: ["GraphQL", "NodeJS"],
      authorIdx: 4
    },
    {
      title: "LLMs for Every Developer",
      subtitle: "Integrating OpenAI and LangChain into your next product.",
      content: "AI is no longer just for data scientists. Discover how easy it is to add semantic search and chat features to your React app.",
      category: "AI & Machine Learning",
      tags: ["Python", "React"],
      authorIdx: 5
    },
    {
      title: "Advanced React Patterns",
      subtitle: "From Render Props to Compound Components.",
      content: "Writing reusable components requires understanding design patterns. We dive deep into hook-based abstractions.",
      category: "Frontend Engineering",
      tags: ["React", "JavaScript"],
      authorIdx: 0
    },
    {
      title: "Securing Your Production API",
      subtitle: "JWT, OAuth2 and Rate Limiting best practices.",
      content: "Security should never be an afterthought. Learn how to protect your Node.js endpoints from common vulnerabilities.",
      category: "Backend Engineering",
      tags: ["NodeJS", "TypeScript"],
      authorIdx: 1
    }
    // ... adding more blogs in the loop below to reach 4-6 per user
  ];

  // Helper to get random items
  const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const createdBlogs = [];

  // Create defined blogs first
  for (const b of blogData) {
    const blog = await Blog.create({
      title: b.title,
      subtitle: b.subtitle,
      content: b.content,
      categories: [b.category],
      tags: b.tags,
      author: users[b.authorIdx]._id,
      media: [{ fileType: "image", filePath: `https://picsum.photos/seed/${b.title}/800/400` }]
    });
    createdBlogs.push(blog);
  }

  // Generate additional blogs to reach 4-6 per user
  for (let i = 0; i < users.length; i++) {
    const currentBlogs = createdBlogs.filter(b => b.author.toString() === users[i]._id.toString());
    const needed = 5 - currentBlogs.length;

    for (let j = 0; j < needed; j++) {
      const title = `Insight ${i}-${j}: Scaling Systems`;
      const blog = await Blog.create({
        title,
        subtitle: "A deep dive into distributed systems and performance optimization.",
        content: "Scalability is about more than just adding servers. It requires a fundamental shift in how we handle state and data consistency.",
        categories: [getRandom(categories).name],
        tags: [getRandom(tags).name, getRandom(tags).name],
        author: users[i]._id,
        media: [{ fileType: "image", filePath: `https://picsum.photos/seed/extra-${i}-${j}/800/400` }]
      });
      createdBlogs.push(blog);
    }
  }

  /* ------------------ LIKES & COMMENTS ------------------ */
  for (const blog of createdBlogs) {
    // Random likes
    const likers = users.slice(0, Math.floor(Math.random() * users.length) + 1);
    blog.likedUsers = likers.map(u => u._id);
    blog.likesCount = likers.length;

    // Comments
    const mainComment = await Comment.create({
      postId: blog._id,
      userId: getRandom(users)._id,
      content: "This is a great read! Really enjoyed the technical depth."
    });

    // Another sub-comment (reply to reply)
    // To test flattening, Tara replies to Dana.
    // In our UI, Tara should be a sibling of Dana under Root.
    // So we use mainComment._id as parent.
    await Comment.create({
      postId: blog._id,
      userId: users[2]._id,
      content: "I agree with the author, the deep dive section was particularly helpful.",
      parentCommentId: mainComment._id
    });

    // Another main comment
    const secondComment = await Comment.create({
      postId: blog._id,
      userId: getRandom(users)._id,
      content: "Could you expand more on the implementation details?"
    });

    // Reply to second comment
    await Comment.create({
      postId: blog._id,
      userId: getRandom(users)._id,
      content: "I'd also like to see more examples!",
      parentCommentId: secondComment._id
    });

    blog.commentsCount = 5;
    await blog.save();
  }

  console.log("Realistic Software Engineering dataset seeded successfully.");
};

module.exports = seedDatabase;
