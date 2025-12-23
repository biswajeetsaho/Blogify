// const {
//     createComment,
//     getCommentsByBlogId
//   } = require("../models/comment_model");
  
//   const addCommentService = async (content, blogId, userId) => {
//     if (!content) throw new Error("Comment cannot be empty");
  
//     return createComment({
//       content,
//       blogId,
//       userId
//     });
//   };
  
//   const getCommentsService = async (blogId) => {
//     return getCommentsByBlogId(blogId);
//   };
  
//   module.exports = {
//     addCommentService,
//     getCommentsService
//   };
  
const commentModel = require("../models/comment_model");

module.exports = {
  // createComment: async (data) => {
  //   if (!data.content) throw new Error("Comment content required");
  //   return await commentModel.addComment(data);
  // },

  createComment: async (data) => {
    if (!data.content) {
      throw new Error("Comment content required");
    }

    return await commentModel.addComment(data);
  },

  getPostComments: async (postId) => {
    return await commentModel.getCommentsByPost(postId);
  },

  // reply: async (data) => {
  //   return await commentModel.replyToComment(data);
  // },
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
