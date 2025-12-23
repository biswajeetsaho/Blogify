
const commentModel = require("../models/comment_model");

const extractMentions = (content) => {
  const regex = /@(\w+)/g;
  return [...content.matchAll(regex)].map(m => m[1]);
};

module.exports = {

  createComment: async (data) => {
    // ✅ validation (keep this)
    if (!data.content || !data.content.trim()) {
      throw new Error("Comment content required");
    }
  
    // ✅ extract @mentions
    const mentions = extractMentions(data.content);
    // e.g. ["rahul", "john"]
  
    return await commentModel.addComment({
      ...data,
      mentions
    });
  },  

  getPostComments: async (postId) => {
    return await commentModel.getCommentsByPost(postId);
  },

  
  reply: async (data) => {
    if (!data.content || !data.parentCommentId) {
      throw new Error("Reply content and parentCommentId required");
    }

    return await commentModel.replyToComment(data);
  },

  upvote: async (commentId) => {
    return await commentModel.upvoteComment(commentId);
  },

  downvote: async (commentId) => {
    return await commentModel.downvoteComment(commentId);
  },

  remove: async (commentId) => {
    return await commentModel.deleteComment(commentId);
  }
};
