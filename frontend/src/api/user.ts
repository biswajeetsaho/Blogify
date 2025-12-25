import api from "./api";

export const searchUsers = (query: string) =>
  api.get(`/users/search?q=${query}`);

export const sendFriendRequest = (userId: string) =>
  api.post(`/friends/send/${userId}`);

export const acceptFriendRequest = (userId: string) =>
  api.post(`/friends/accept/${userId}`);
