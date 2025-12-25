export interface User {
  _id: string;
  username: string;
  email: string;
  password?: string; // Optional as we might not fetch it in all contexts
  friends: string[]; // Array of User IDs
  sentFriendRequests: string[]; // Array of User IDs
  receivedFriendRequests: string[]; // Array of User IDs
  createdAt?: string;
  updatedAt?: string;
}

export interface Media {
  fileType: "image" | "video";
  filePath: string;
}

export interface Blog {
  _id: string;
  title: string;
  subtitle: string;
  content: string;
  categories: string[]; // Array of Category names (strings) based on Schema/Seed
  tags: string[]; // Array of Tag names (strings) based on Schema/Seed
  media: Media[];
  likesCount: number;
  likedUsers: string[]; // Array of User IDs
  commentsCount: number;
  author: string | User; // User ID or populated User object
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  createdAt?: string;
}

export interface Tag {
  _id: string;
  name: string;
  createdAt?: string;
}

export interface Comment {
  _id: string;
  postId: string; // Blog ID
  userId: string | User; // User ID or populated User object
  content: string;
  parentCommentId: string | null;
  upvotes: number;
  downvotes: number;
  isDeleted: boolean;
  createdAt: string;
}
