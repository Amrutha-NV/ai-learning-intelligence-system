const quizService = require(
    "../services/quizService"
);


/*
==================================================
GENERATE QUIZ
==================================================
*/

const generateQuiz = async (
    req,
    res
) => {

    try {

        const {
            activityId,
        } = req.params;


        const result =
            await quizService.generateQuiz(
                req.user.id,
                activityId
            );


        return res.status(202).json({
            success: true,
            data: result,
        });

    } catch (error) {

        console.error(
            "Quiz generation failed:",
            error.message
        );


        return res.status(500).json({
            success: false,
            message:
                error.message,
        });
    }
};


/*
==================================================
GET QUIZ
==================================================
*/

const getQuiz = async (
    req,
    res
) => {

    try {

        const {
            activityId,
        } = req.params;


        const quiz =
            await quizService
                .getQuizByActivity(
                    req.user.id,
                    activityId
                );


        if (!quiz) {

            return res.status(404).json({
                success: false,
                message:
                    "Quiz not found",
            });
        }


        return res.status(200).json({
            success: true,
            data: quiz,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message:
                error.message,
        });
    }
};


/*
==================================================
AI CALLBACK
==================================================

This route is called by the AI service,
not by the frontend.
*/

const receiveQuizAICallback = async (
    req,
    res
) => {

    try {

        const result =
            await quizService
                .handleQuizCallback(
                    req.body
                );


        console.log(
            "Quiz callback processed for activity",
            req.body.activityId
        );


        return res.status(200).json({
            success: true,
            message:
                "Quiz callback processed",
            data: result,
        });

    } catch (error) {

        console.error(
            "Quiz callback failed:",
            error.message
        );


        return res.status(500).json({
            success: false,
            message:
                error.message,
        });
    }
};

/*
==================================================
SUBMIT QUIZ
==================================================
*/

const submitQuizAttempt = async (
    req,
    res
) => {

    try {

        const userId =
            req.user.id;

        const {
            activityId
        } = req.params;

        const {
            answers
        } = req.body;


        const result =
        await quizService.submitQuiz(
            userId,
            activityId,
            answers
        );


        return res.status(200).json({
            success: true,
            data: result,
        });

    } catch (error) {

        console.error(
            "Quiz submission failed:",
            error.message
        );


        return res.status(400).json({
            success: false,
            message:
                error.message,
        });
    }
};

module.exports = {
    generateQuiz,
    getQuiz,
    receiveQuizAICallback,
    submitQuizAttempt,
};