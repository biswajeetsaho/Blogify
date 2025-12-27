import api from "./api";

export const getAnalyticsOverview = () =>
    api.get("/analytics/overview");

export const getBlogAnalytics = () =>
    api.get("/analytics/blogs");

export const getTrendsData = () =>
    api.get("/analytics/trends");

export const trackBlogView = (blogId: string) =>
    api.post(`/analytics/view/${blogId}`);
