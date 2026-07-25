const Activity = require(
    "../models/Activity"
);

const LearningArtifact = require(
    "../models/LearningArtifact"
);

const {
    requestQuizGeneration,
} = require(
    "./quizAIService"
);


/*
==================================================
HELPER
==================================================
*/

const getUserActivity = async (
    userId,
    activityId
) => {

    const activity =
        await Activity.findOne({
            _id: activityId,
            userId,
        });


    if (!activity) {
        throw new Error(
            "Activity not found"
        );
    }


    return activity;
};


/*
==================================================
GENERATE QUIZ
==================================================
*/

const generateQuiz = async (
    userId,
    activityId
) => {

    /*
    Verify Activity ownership.
    */

    const activity =
        await getUserActivity(
            userId,
            activityId
        );


    /*
    Quiz should only be generated from
    classified learning content.
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
    Summary must already exist because
    Quiz generation uses the Summary.
    */

    const artifact =
        await LearningArtifact.findOne({
            activityId:
                activity._id,

            userId,
        });


    if (!artifact) {
        throw new Error(
            "Learning artifact not found"
        );
    }


    if (
        artifact.summary.status !==
        "COMPLETED"
    ) {
        throw new Error(
            "Summary must be completed before generating quiz"
        );
    }


    if (
        !Array.isArray(
            artifact.summary.keyPoints
        ) ||
        artifact.summary.keyPoints.length === 0
    ) {
        throw new Error(
            "Summary does not contain key points"
        );
    }


    /*
    Don't regenerate completed Quiz.
    */

    if (
        artifact.quiz.status ===
        "COMPLETED"
    ) {
        return {
            alreadyGenerated: true,

            status: "COMPLETED",

            artifact,
        };
    }


    /*
    Prevent duplicate Celery jobs.
    */

    if (
        artifact.quiz.status ===
        "PROCESSING"
    ) {
        return {
            alreadyGenerated: false,

            status: "PROCESSING",

            taskId:
                artifact.quiz.taskId,

            artifact,
        };
    }


    try {

        /*
        Node → Quiz AI
        */

        const aiResponse =
            await requestQuizGeneration(
                activity,
                artifact.summary
            );


        /*
        Support both naming conventions.
        */

        const taskId =
            aiResponse.task_id ||
            aiResponse.taskId ||
            null;


        /*
        Normal Celery case.
        */

        if (taskId) {

            /*
            Re-fetch because the AI callback
            could theoretically arrive before
            this request finishes.
            */

            const currentArtifact =
                await LearningArtifact.findById(
                    artifact._id
                );


            /*
            Never overwrite COMPLETED if the
            callback already finished.
            */

            if (
                currentArtifact.quiz.status !==
                "COMPLETED"
            ) {

                currentArtifact.quiz.status =
                    "PROCESSING";

                currentArtifact.quiz.taskId =
                    taskId;

                currentArtifact.quiz.error =
                    null;


                await currentArtifact.save();
            }


            return {
                alreadyGenerated: false,

                status:
                    currentArtifact.quiz.status,

                taskId:
                    currentArtifact.quiz.taskId,

                artifact:
                    currentArtifact,
            };
        }


        /*
        Handle cache hit without assuming
        that absence of task ID means failure.
        */

        if (
            aiResponse.message ===
            "Cache hit"
        ) {

            const currentArtifact =
                await LearningArtifact.findById(
                    artifact._id
                );


            return {
                alreadyGenerated: false,

                cached: true,

                status:
                    currentArtifact.quiz.status,

                artifact:
                    currentArtifact,
            };
        }


        throw new Error(
            "Quiz AI did not return a task ID"
        );

    } catch (error) {

        /*
        Re-fetch before setting FAILED so
        we don't overwrite a callback that
        already completed successfully.
        */

        const currentArtifact =
            await LearningArtifact.findById(
                artifact._id
            );


        if (
            currentArtifact &&
            currentArtifact.quiz.status !==
            "COMPLETED"
        ) {

            currentArtifact.quiz.status =
                "FAILED";

            currentArtifact.quiz.error =
                error.message;


            await currentArtifact.save();
        }


        throw error;
    }
};


/*
==================================================
GET QUIZ
==================================================
*/

const getQuizByActivity = async (
    userId,
    activityId
) => {

    await getUserActivity(
        userId,
        activityId
    );


    const artifact =
        await LearningArtifact.findOne({
            activityId,
            userId,
        });


    if (!artifact) {
        return null;
    }


    return {
        status:
            artifact.quiz.status,

        taskId:
            artifact.quiz.taskId,

        questions:
            artifact.quiz.questions,

        generatedAt:
            artifact.quiz.generatedAt,

        error:
            artifact.quiz.error,
    };
};


/*
==================================================
QUIZ AI CALLBACK
==================================================

Expected:

{
    activityId: "...",
    status: "COMPLETED",

    quiz: {
        questions: [...]
    }
}
*/

const handleQuizCallback = async ({
    activityId,
    taskId,
    status,
    quiz,
    questions,
    error,
}) => {

    if (!activityId) {
        throw new Error(
            "activityId is required"
        );
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


    /*
    FAILED callback
    */

    if (status === "FAILED") {

        artifact.quiz.status =
            "FAILED";

        artifact.quiz.error =
            error ||
            "Quiz generation failed";


        if (taskId) {
            artifact.quiz.taskId =
                taskId;
        }


        await artifact.save();


        return artifact;
    }


    /*
    Primary contract:
        quiz.questions

    Also tolerate:
        questions

    so backend is not unnecessarily
    coupled to one wrapper shape.
    */

    const generatedQuestions =
        quiz?.questions ||
        questions;


    if (
        !Array.isArray(
            generatedQuestions
        ) ||
        generatedQuestions.length === 0
    ) {
        throw new Error(
            "Quiz callback does not contain questions"
        );
    }


    /*
    Validate basic question structure.
    */

    for (
        const question of
        generatedQuestions
    ) {

        if (
            !question.question ||
            !Array.isArray(
                question.options
            ) ||
            question.options.length === 0
        ) {
            throw new Error(
                "Invalid quiz question format"
            );
        }


        if (
            !Number.isInteger(
                question.correctAnswer
            )
        ) {
            throw new Error(
                "Quiz correctAnswer must be an option index"
            );
        }


        if (
            question.correctAnswer < 0 ||
            question.correctAnswer >=
                question.options.length
        ) {
            throw new Error(
                "Quiz correctAnswer index is out of range"
            );
        }
    }


    /*
    Save Quiz.
    */

    artifact.quiz.status =
        "COMPLETED";

    artifact.quiz.questions =
        generatedQuestions;

    artifact.quiz.generatedAt =
        new Date();

    artifact.quiz.error =
        null;


    if (taskId) {
        artifact.quiz.taskId =
            taskId;
    }


    await artifact.save();


    return artifact;
};

/*
==================================================
SUBMIT QUIZ
==================================================
*/

const submitQuiz = async (
    userId,
    activityId,
    answers
) => {

    /*
    Verify Activity belongs to user.
    */

    await getUserActivity(
        userId,
        activityId
    );


    /*
    Find generated quiz.
    */

    const artifact =
        await LearningArtifact.findOne({
            activityId,
            userId,
        });


    if (!artifact) {
        throw new Error(
            "Learning artifact not found"
        );
    }


    /*
    Quiz must already be generated.
    */

    if (
        artifact.quiz.status !==
        "COMPLETED"
    ) {
        throw new Error(
            "Quiz is not completed yet"
        );
    }


    const questions =
        artifact.quiz.questions;


    if (
        !Array.isArray(questions) ||
        questions.length === 0
    ) {
        throw new Error(
            "Quiz has no questions"
        );
    }


    /*
    Validate submitted answers.
    */

    if (!Array.isArray(answers)) {
        throw new Error(
            "answers must be an array"
        );
    }


    if (
        answers.length !==
        questions.length
    ) {
        throw new Error(
            `Expected ${questions.length} answers`
        );
    }


    /*
    Calculate score.
    */

    let score = 0;


    questions.forEach(
        (question, index) => {

            const selectedAnswer =
                answers[index];


            if (
                !Number.isInteger(
                    selectedAnswer
                )
            ) {
                throw new Error(
                    `Answer ${index + 1} must be an option index`
                );
            }


            if (
                selectedAnswer < 0 ||
                selectedAnswer >=
                    question.options.length
            ) {
                throw new Error(
                    `Invalid answer for question ${index + 1}`
                );
            }


            if (
                selectedAnswer ===
                question.correctAnswer
            ) {
                score++;
            }
        }
    );


    const totalQuestions =
        questions.length;


    const accuracy =
        Number(
            (
                (score /
                    totalQuestions) *
                100
            ).toFixed(2)
        );


    /*
    Save attempt.
    */

    artifact.quizAttempts.push({
        score,
        totalQuestions,
        accuracy,
        completedAt:
            new Date(),
    });


    await artifact.save();


    const savedAttempt =
        artifact.quizAttempts[
            artifact.quizAttempts.length - 1
        ];


    return {
        attemptId:
            savedAttempt._id,

        score,

        totalQuestions,

        accuracy,

        completedAt:
            savedAttempt.completedAt,
    };
};

module.exports = {
    generateQuiz,
    getQuizByActivity,
    handleQuizCallback,
    submitQuiz,
};