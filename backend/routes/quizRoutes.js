const express = require(
    "express"
);

const router =
    express.Router();

const protect = require(
    "../middleware/authMiddleware"
);

const {
    generateQuiz,
    getQuiz,
    receiveQuizAICallback,
    retryQuizGeneration,
} = require(
    "../controllers/quizController"
);


/*
Frontend → Backend

Generate Quiz
*/

router.post(
    "/generate/:activityId",
    protect,
    generateQuiz
);


/*
Frontend → Backend

Get generated Quiz
*/

router.get(
    "/:activityId",
    protect,
    getQuiz
);


/*
AI Service → Backend

Do NOT use normal user authentication
middleware here.

The Celery worker is calling this route,
not a logged-in browser user.
*/

router.post(
    "/ai-callback",
    receiveQuizAICallback
);

module.exports = router;