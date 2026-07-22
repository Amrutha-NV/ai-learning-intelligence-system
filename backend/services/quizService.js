const Activity = require("../models/Activity");
const LearningArtifact = require(
    "../models/LearningArtifact"
);


/*
Prepare Quiz Generation

For now:
- verify Activity ownership
- require completed classification
- create/find LearningArtifact
- prepare Quiz state

Later:
- call friend's Quiz AI here
*/
const generateQuiz = async (
    userId,
    activityId
) => {

    const activity = await Activity.findOne({
        _id: activityId,
        userId,
    });

    if (!activity) {
        throw new Error("Activity not found");
    }


    /*
    Quiz should only be generated after
    classification has completed.
    */
    if (
        activity.classificationStatus !==
        "COMPLETED"
    ) {
        throw new Error(
            "Activity classification is not completed"
        );
    }


    /*
    Find or create one LearningArtifact
    for this Activity.
    */
    let artifact =
        await LearningArtifact.findOne({
            activityId: activity._id,
        });


    if (!artifact) {
        artifact =
            await LearningArtifact.create({
                userId,
                activityId: activity._id,
            });
    }


    /*
    Already generated.
    */
    if (
        artifact.quiz.status ===
        "COMPLETED"
    ) {
        return {
            ready: true,
            alreadyGenerated: true,
            status: "COMPLETED",
            quiz: artifact.quiz,
        };
    }


    /*
    AI task already running.
    This will matter once Quiz AI
    integration is connected.
    */
    if (
        artifact.quiz.status ===
        "PROCESSING"
    ) {
        return {
            ready: true,
            alreadyGenerated: false,
            status: "PROCESSING",
            taskId: artifact.quiz.taskId,
        };
    }


    /*
    For now we stop here.

    Later this exact location will call:
    requestQuizGeneration(activity)
    */
    return {
        ready: true,
        alreadyGenerated: false,
        status: artifact.quiz.status,
        activity,
        artifact,
    };
};


/*
Get generated Quiz
*/
const getQuizByActivity = async (
    userId,
    activityId
) => {

    const activity = await Activity.findOne({
        _id: activityId,
        userId,
    });

    if (!activity) {
        throw new Error("Activity not found");
    }


    const artifact =
        await LearningArtifact.findOne({
            activityId,
        });


    if (!artifact) {
        return null;
    }


    return {
        status: artifact.quiz.status,

        taskId: artifact.quiz.taskId,

        questions:
            artifact.quiz.questions,

        generatedAt:
            artifact.quiz.generatedAt,

        error:
            artifact.quiz.error,
    };
};


/*
Save a completed Quiz attempt.

Later the frontend will call this
after the user submits the Quiz.
*/
const saveQuizAttempt = async (
    userId,
    activityId,
    attemptData
) => {

    const activity = await Activity.findOne({
        _id: activityId,
        userId,
    });

    if (!activity) {
        throw new Error("Activity not found");
    }


    const artifact =
        await LearningArtifact.findOne({
            activityId,
        });


    if (!artifact) {
        throw new Error(
            "Learning artifact not found"
        );
    }


    const {
        score,
        totalQuestions,
    } = attemptData;


    if (
        score === undefined ||
        totalQuestions === undefined
    ) {
        throw new Error(
            "score and totalQuestions are required"
        );
    }


    if (
        totalQuestions <= 0 ||
        score < 0 ||
        score > totalQuestions
    ) {
        throw new Error(
            "Invalid quiz attempt"
        );
    }


    const accuracy = Number(
        (
            (score / totalQuestions) *
            100
        ).toFixed(2)
    );


    artifact.quizAttempts.push({
        score,
        totalQuestions,
        accuracy,
    });


    await artifact.save();


    return artifact.quizAttempts[
        artifact.quizAttempts.length - 1
    ];
};


module.exports = {
    generateQuiz,
    getQuizByActivity,
    saveQuizAttempt,
};