const express = require("express");

const router = express.Router();

const protect = require(
    "../middleware/authMiddleware"
);

const {
    generateSummary,
    getSummary,
    receiveSummaryCallback,
} = require(
    "../controllers/summaryController"
);


/*
==================================================
USER ROUTES
==================================================
*/


/*
Generate Summary

Frontend/User
      ↓
Node
      ↓
Summary AI
*/

router.post(
    "/generate/:activityId",
    protect,
    generateSummary
);


/*
Get generated Summary.
*/

router.get(
    "/:activityId",
    protect,
    getSummary
);


/*
==================================================
AI CALLBACK
==================================================

Do NOT use normal user authentication here.

This request comes from the Summary AI
service/Celery worker, not from the browser user.
*/

router.post(
    "/ai-callback",
    receiveSummaryCallback
);


module.exports = router;