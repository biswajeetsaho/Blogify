const express = require("express");
const authMiddleware = require("../middlewares/auth_middleware");
const analyticsService = require("../services/analytics_service");

const router = express.Router();

/* GET ANALYTICS OVERVIEW */
router.get("/overview", authMiddleware, async (req, res) => {
    try {
        const overview = await analyticsService.getAnalyticsOverview(req.userId);
        res.json(overview);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* GET BLOG ANALYTICS */
router.get("/blogs", authMiddleware, async (req, res) => {
    try {
        const blogs = await analyticsService.getBlogAnalytics(req.userId);
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* GET TRENDS DATA */
router.get("/trends", authMiddleware, async (req, res) => {
    try {
        const trends = await analyticsService.getTrendsData(req.userId);
        res.json(trends);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* TRACK BLOG VIEW */
router.post("/view/:blogId", async (req, res) => {
    try {
        // userId is optional (guest users can view too)
        const userId = req.headers.authorization ? req.userId : null;
        await analyticsService.incrementBlogView(req.params.blogId, userId);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
