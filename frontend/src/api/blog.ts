import api from "./api";

/* ---------------- BLOGS ---------------- */

export const getAllBlogs = () => api.get("/posts");

export const getAllCategories = () => api.get("/posts/categories/all");

export const getAllTags = () => api.get("/posts/tags/all");

export const createBlog = (data: FormData) =>
  api.post("/posts", data);

export const likeBlog = (blogId: string) =>
  api.post(`/posts/${blogId}/like`);

export const searchBlogs = (query: string) =>
  api.get(`/posts/search?q=${query}`);

/* ---------------- COMMENTS (BLOG RELATED) ---------------- */

export const getCommentsByPost = (postId: string) =>
  api.get(`/comments/${postId}`);

export const addComment = (data: {
  postId: string;
  content: string;
  parentCommentId?: string;
}) =>
  api.post("/comments", data);

export const replyToComment = (data: {
  postId: string;
  content: string;
  parentCommentId: string;
}) =>
  api.post("/comments/reply", data);

export const upvoteComment = (commentId: string) =>
  api.put(`/comments/upvote/${commentId}`);

export const downvoteComment = (commentId: string) =>
  api.put(`/comments/downvote/${commentId}`);

export const deleteComment = (commentId: string) =>
  api.delete(`/comments/${commentId}`);
