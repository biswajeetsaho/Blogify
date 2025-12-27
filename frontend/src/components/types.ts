export interface User {
  _id: string;
  username: string;
  email: string;
  password?: string; // Optional as we might not fetch it in all contexts
  friends: string[]; // Array of User IDs
  sentFriendRequests: string[]; // Array of User IDs
  receivedFriendRequests: string[]; // Array of User IDs
  themePreferences?: {
    backgroundColor: string;
    fontFamily: string;
    textColor: string;
  };
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
  likedUsers: string[]; // Array of user IDs who liked this blog
  commentsCount: number;
  author: string | User; // User ID or populated User object
  status?: "published" | "draft" | "scheduled";
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  creator: string; // User ID
  createdAt?: string;
}

export interface Tag {
  _id: string;
  name: string;
  creator: string; // User ID
  createdAt?: string;
}

export interface Comment {
  _id: string;
  postId: string;
  author: string | User;
  content: string;
  likes: string[]; // User IDs
  dislikes: string[]; // User IDs
  parentCommentId?: string;
  replies?: Comment[];
  isApproved?: boolean;
  isReported?: boolean;
  reportReason?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AnalyticsOverview {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalBlogs: number;
  engagementRate: number;
  avgViewsPerBlog: number;
}

export interface BlogMetric {
  id: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  engagementRate: number;
  createdAt: string;
  categories: string[];
}

export interface TrendsData {
  viewsOverTime: { date: string; count: number }[];
  categoryPerformance: { category: string; views: number; likes: number; comments: number }[];
  engagement: { likes: number; comments: number };
}
