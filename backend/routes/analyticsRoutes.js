const express =
    require("express");

const router =
    express.Router();


const protect =
    require(
        "../middleware/authMiddleware"
    );


const {
    getDashboardAnalytics,
} = require(
    "../controllers/analyticsController"
);


/*
==================================================
GET /api/analytics
==================================================

Returns dashboard analytics
for logged-in user.
*/

router.get(
    "/",
    protect,
    getDashboardAnalytics
);


module.exports =
    router;