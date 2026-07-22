const express = require("express");

const router = express.Router();

const protect = require(
    "../middleware/authMiddleware"
);

const {
    prepareSummary,
    getSummary,
} = require(
    "../controllers/summaryController"
);


/*
Prepare Summary generation.

For now this creates/finds the
LearningArtifact.

Later this endpoint will also trigger
the friend's Summary AI.
*/
router.post(
    "/generate/:activityId",
    protect,
    prepareSummary
);


/*
Get Summary for Activity.
*/
router.get(
    "/:activityId",
    protect,
    getSummary
);


module.exports = router;