const express = require("express");

const router = express.Router();

const protect = require(
    "../middleware/authMiddleware"
);

const {
    generateQuiz,
    getQuiz,
    submitQuizAttempt,
} = require(
    "../controllers/quizController"
);


/*
Prepare / generate Quiz
*/
router.post(
    "/generate/:activityId",
    protect,
    generateQuiz
);


/*
Get Quiz
*/
router.get(
    "/:activityId",
    protect,
    getQuiz
);


/*
Save Quiz attempt
*/
router.post(
    "/:activityId/attempt",
    protect,
    submitQuizAttempt
);


module.exports = router;