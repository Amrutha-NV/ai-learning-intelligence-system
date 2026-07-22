const quizService = require(
    "../services/quizService"
);


/*
POST /api/quizzes/generate/:activityId
*/
const generateQuiz = async (
    req,
    res
) => {
    try {

        const { activityId } =
            req.params;


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
            message: error.message,
        });
    }
};


/*
GET /api/quizzes/:activityId
*/
const getQuiz = async (
    req,
    res
) => {
    try {

        const { activityId } =
            req.params;


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
            message: error.message,
        });
    }
};


/*
POST /api/quizzes/:activityId/attempt
*/
const submitQuizAttempt = async (
    req,
    res
) => {
    try {

        const { activityId } =
            req.params;


        const attempt =
            await quizService
                .saveQuizAttempt(
                    req.user.id,
                    activityId,
                    req.body
                );


        return res.status(201).json({
            success: true,
            data: attempt,
        });

    } catch (error) {

        console.error(
            "Quiz attempt failed:",
            error.message
        );


        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


module.exports = {
    generateQuiz,
    getQuiz,
    submitQuizAttempt,
};