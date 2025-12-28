import api from "./api";

/* ---------------- BLOGS ---------------- */

export const getAllBlogs = () => api.get("/posts");

export const getAllCategories = () => api.get("/posts/categories/all");
export const createCategory = (name: string) => api.post("/posts/categories", { name });
export const updateCategory = (id: string, name: string) => api.put(`/posts/categories/${id}`, { name });
export const deleteCategory = (id: string) => api.delete(`/posts/categories/${id}`);

export const getAllTags = () => api.get("/posts/tags/all");
export const createTag = (name: string) => api.post("/posts/tags", { name });
export const updateTag = (id: string, name: string) => api.put(`/posts/tags/${id}`, { name });
export const deleteTag = (id: string) => api.delete(`/posts/tags/${id}`);

export const likeBlog = (blogId: string) =>
  api.put(`/posts/${blogId}/like`);

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

export const createBlog = (formData: FormData) =>
  api.post('/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const updateBlog = (id: string, formData: FormData) =>
  api.put(`/posts/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const deleteBlog = (id: string) =>
  api.delete(`/posts/${id}`);

export const getBlogById = (id: string) =>
  api.get(`/posts/${id}`);

export const deleteComment = (commentId: string) =>
  api.delete(`/comments/${commentId}`);

export const approveComment = (commentId: string) =>
  api.put(`/comments/approve/${commentId}`);

export const reportComment = (commentId: string) =>
  api.post(`/comments/report/${commentId}`);

export const getUserBlogs = () =>
  api.get("/posts/my-blogs");
