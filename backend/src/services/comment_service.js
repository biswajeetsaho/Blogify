const commentModel = require("../models/comment_model");
const { Blog } = require("../utils/connection");

const extractMentions = (content) => {
  const regex = /@(\w+)/g;
  return [...content.matchAll(regex)].map(m => m[1]);
};

module.exports = {

  createComment: async (data, userId) => {
    // ✅ validation
    if (!data.content || !data.content.trim()) {
      throw new Error("Comment content required");
    }

    // ✅ extract @mentions
    const mentions = extractMentions(data.content);

    return await commentModel.addComment({
      ...data,
      author: userId,
      mentions
    });
  },

  getPostComments: async (postId) => {
    return await commentModel.getCommentsByPost(postId);
  },

  reply: async (data, userId) => {
    if (!data.content || !data.parentCommentId) {
      throw new Error("Reply content and parentCommentId required");
    }

    return await commentModel.replyToComment({
      ...data,
      author: userId
    });
  },

  upvote: async (commentId, userId) => {
    const comment = await commentModel.getCommentById(commentId);
    if (!comment) throw new Error("Comment not found");

    if (comment.author.toString() === userId) {
      throw new Error("You cannot upvote your own comment");
    }

    return await commentModel.upvoteComment(commentId, userId);
  },

  downvote: async (commentId, userId) => {
    const comment = await commentModel.getCommentById(commentId);
    if (!comment) throw new Error("Comment not found");

    if (comment.author.toString() === userId) {
      throw new Error("You cannot downvote your own comment");
    }

    return await commentModel.downvoteComment(commentId, userId);
  },

  approve: async (commentId, userId) => {
    const comment = await commentModel.getCommentById(commentId);
    if (!comment) throw new Error("Comment not found");

    const blog = await Blog.findById(comment.postId);
    if (!blog || blog.author.toString() !== userId) {
      throw new Error("Only the blog owner can approve comments");
    }

    return await commentModel.approveComment(commentId);
  },

  report: async (commentId) => {
    return await commentModel.reportComment(commentId);
  },

  remove: async (commentId, userId) => {
    const comment = await commentModel.getCommentById(commentId);
    if (!comment) throw new Error("Comment not found");

    const blog = await Blog.findById(comment.postId);
    const isCommentAuthor = comment.author.toString() === userId;
    const isBlogOwner = blog && blog.author.toString() === userId;

    if (!isCommentAuthor && !isBlogOwner) {
      throw new Error("You are not authorized to delete this comment");
    }

    return await commentModel.deleteComment(commentId);
  }
};
