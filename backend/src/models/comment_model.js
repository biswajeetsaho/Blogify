// const { Comment } = require("../utils/connection");

// const createComment = (data) => Comment.create(data);

// const getCommentsByBlogId = (blogId) =>
//   Comment.find({ blogId }).populate("userId", "email");

// module.exports = {
//   createComment,
//   getCommentsByBlogId
// };


const { Comment } = require("../utils/connection");

module.exports = {
  addComment: (data) => Comment.create(data),

  getCommentsByPost: (postId) =>
    Comment.find({ postId, isDeleted: false }),

  replyToComment: (data) => Comment.create(data),

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

  deleteComment: (commentId) =>
    Comment.findByIdAndUpdate(
      commentId,
      { isDeleted: true },
      { new: true }
    )
};
