// const { Comment } = require("../utils/connection");

// const createComment = (data) => Comment.create(data);

// const getCommentsByBlogId = (blogId) =>
//   Comment.find({ blogId }).populate("userId", "email");

// module.exports = {
//   createComment,
//   getCommentsByBlogId
// };


const { Comment, Blog } = require("../utils/connection");

module.exports = {
  // addComment: (data) => Comment.create(data),
  addComment: async (data) => {
    const comment = await Comment.create(data);

    // ✅ increment only for direct comments
    if (!data.parentCommentId) {
      await Blog.findByIdAndUpdate(data.postId, {
        $inc: { commentsCount: 1 }
      });
    }

    return comment;
  },

  getCommentsByPost: (postId) =>
    Comment.find({ postId, isDeleted: false }),

  // replyToComment: (data) => Comment.create(data),
  replyToComment: async (data) => {
    // replies are also comments, but DO NOT increase count
    return Comment.create(data);
  },

  upvoteComment: (commentId) =>
    Comment.findByIdAndUpdate(
      commentId,
      { $inc: { upvotes: 1 } },
      { new: true }
    ),

  downvoteComment: (commentId) =>
    Comment.findByIdAndUpdate(
      commentId,
      { $inc: { downvotes: 1 } },
      { new: true }
    ),

  // deleteComment: (commentId) =>
  //   Comment.findByIdAndUpdate(
  //     commentId,
  //     { isDeleted: true },
  //     { new: true }
  //   )

  deleteComment: async (commentId) => {
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { isDeleted: true },
      { new: true }
    );

    // ✅ decrement count only if it was a direct comment
    if (comment && !comment.parentCommentId) {
      await Blog.findByIdAndUpdate(comment.postId, {
        $inc: { commentsCount: -1 }
      });
    }

    return comment;
  }

};
