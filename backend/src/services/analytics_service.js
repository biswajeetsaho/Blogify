const { Blog } = require("../utils/connection");

/* GET ANALYTICS OVERVIEW FOR USER */
const getAnalyticsOverview = async (userId) => {
    const blogs = await Blog.find({ author: userId });

    const totalViews = blogs.reduce((sum, blog) => sum + (blog.analytics?.views || 0), 0);
    const totalLikes = blogs.reduce((sum, blog) => sum + blog.likesCount, 0);
    const totalComments = blogs.reduce((sum, blog) => sum + blog.commentsCount, 0);
    const totalBlogs = blogs.length;
    const engagementRate = totalViews > 0
        ? ((totalLikes + totalComments) / totalViews * 100).toFixed(2)
        : 0;
    const avgViewsPerBlog = totalBlogs > 0 ? Math.round(totalViews / totalBlogs) : 0;

    return {
        totalViews,
        totalLikes,
        totalComments,
        totalBlogs,
        engagementRate: parseFloat(engagementRate),
        avgViewsPerBlog
    };
};

/* GET DETAILED BLOG ANALYTICS */
const getBlogAnalytics = async (userId) => {
    const blogs = await Blog.find({ author: userId })
        .select('title analytics likesCount commentsCount createdAt categories')
        .sort({ 'analytics.views': -1 });

    return blogs.map(blog => ({
        id: blog._id,
        title: blog.title,
        views: blog.analytics?.views || 0,
        likes: blog.likesCount,
        comments: blog.commentsCount,
        engagementRate: parseFloat(blog.analytics?.views > 0
            ? ((blog.likesCount + blog.commentsCount) / blog.analytics.views * 100).toFixed(2)
            : 0),
        createdAt: blog.createdAt,
        categories: blog.categories
    }));

};

/* GET TRENDS DATA */
const getTrendsData = async (userId) => {
    const blogs = await Blog.find({ author: userId });

    // Aggregate view history
    const viewsByDate = {};
    blogs.forEach(blog => {
        if (blog.analytics?.viewHistory) {
            blog.analytics.viewHistory.forEach(entry => {
                const dateKey = new Date(entry.date).toISOString().split('T')[0];
                viewsByDate[dateKey] = (viewsByDate[dateKey] || 0) + entry.count;
            });
        }
    });

    const viewsOverTime = Object.entries(viewsByDate)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(-30); // Last 30 days

    // Category performance
    const categoryStats = {};
    blogs.forEach(blog => {
        blog.categories.forEach(cat => {
            if (!categoryStats[cat]) {
                categoryStats[cat] = { category: cat, views: 0, likes: 0, comments: 0 };
            }
            categoryStats[cat].views += blog.analytics?.views || 0;
            categoryStats[cat].likes += blog.likesCount;
            categoryStats[cat].comments += blog.commentsCount;
        });
    });

    const categoryPerformance = Object.values(categoryStats);

    // Engagement breakdown
    const totalLikes = blogs.reduce((sum, blog) => sum + blog.likesCount, 0);
    const totalComments = blogs.reduce((sum, blog) => sum + blog.commentsCount, 0);

    return {
        viewsOverTime,
        categoryPerformance,
        engagement: {
            likes: totalLikes,
            comments: totalComments
        }
    };
};

/* INCREMENT BLOG VIEW */
const incrementBlogView = async (blogId, userId) => {
    const blog = await Blog.findById(blogId);
    if (!blog) throw new Error("Blog not found");

    const today = new Date().toISOString().split('T')[0];

    // Increment total views
    blog.analytics = blog.analytics || { views: 0, uniqueViewers: [], viewHistory: [] };
    blog.analytics.views += 1;

    // Track unique viewers (if user is logged in)
    if (userId && !blog.analytics.uniqueViewers.includes(userId)) {
        blog.analytics.uniqueViewers.push(userId);
    }

    // Update view history
    const todayEntry = blog.analytics.viewHistory.find(
        entry => new Date(entry.date).toISOString().split('T')[0] === today
    );

    if (todayEntry) {
        todayEntry.count += 1;
    } else {
        blog.analytics.viewHistory.push({ date: new Date(), count: 1 });
    }

    await blog.save();
    return blog;
};

module.exports = {
    getAnalyticsOverview,
    getBlogAnalytics,
    getTrendsData,
    incrementBlogView
};
