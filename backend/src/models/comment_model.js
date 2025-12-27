const { Comment, Blog } = require("../utils/connection");

module.exports = {
  addComment: async (data) => {
    const comment = await Comment.create(data);

    // ✅ increment only for direct comments
    if (!data.parentCommentId) {
      await Blog.findByIdAndUpdate(data.postId, {
        $inc: { commentsCount: 1 }
      });
    }

    return comment.populate("author", "username email");
  },

  getCommentsByPost: (postId) =>
    Comment.find({ postId, isDeleted: false, isApproved: true }).populate("author", "username email"),

  replyToComment: async (data) => {
    // Check if parent comment exists and is not deleted
    const parent = await Comment.findById(data.parentCommentId);
    if (!parent || parent.isDeleted) {
      throw new Error("Cannot reply to a deleted comment");
    }
    const reply = await Comment.create(data);
    return reply.populate("author", "username email");
  },

  upvoteComment: async (commentId, userId) => {
    const comment = await Comment.findById(commentId);
    if (!comment) throw new Error("Comment not found");

    const hasUpvoted = comment.likes.some(id => id.toString() === userId.toString());

    let update = {};
    if (hasUpvoted) {
      update = { $pull: { likes: userId } };
    } else {
      update = {
        $addToSet: { likes: userId },
        $pull: { dislikes: userId } // Ensure they can't have both
      };
    }

    return Comment.findByIdAndUpdate(commentId, update, { new: true }).populate("author", "username email");
  },

  downvoteComment: async (commentId, userId) => {
    const comment = await Comment.findById(commentId);
    if (!comment) throw new Error("Comment not found");

    const hasDownvoted = comment.dislikes.some(id => id.toString() === userId.toString());

    let update = {};
    if (hasDownvoted) {
      update = { $pull: { dislikes: userId } };
    } else {
      update = {
        $addToSet: { dislikes: userId },
        $pull: { likes: userId } // Ensure they can't have both
      };
    }

    return Comment.findByIdAndUpdate(commentId, update, { new: true }).populate("author", "username email");
  },

  approveComment: (commentId) =>
    Comment.findByIdAndUpdate(commentId, { isApproved: true }, { new: true }).populate("author", "username email"),

  reportComment: (commentId) =>
    Comment.findByIdAndUpdate(commentId, { $inc: { reports: 1 } }, { new: true }).populate("author", "username email"),

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
  },

  getCommentById: (id) => Comment.findById(id)
};
