const Activity = require(
    "../models/Activity"
);

const LearningArtifact = require(
    "../models/LearningArtifact"
);

const {
    requestSummaryGeneration,
} = require(
    "./summaryAIService"
);


/*
==================================================
HELPER
==================================================
Find Activity and verify ownership.
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
GENERATE SUMMARY
==================================================

Activity
   ↓
Verify classification
   ↓
Create/find LearningArtifact
   ↓
Call Summary AI
   ↓
Store Celery task ID
   ↓
Wait for callback
*/

const generateSummary = async (
    userId,
    activityId
) => {

    const activity =
        await getUserActivity(
            userId,
            activityId
        );


    /*
    Summary generation is allowed only
    after classification finishes.
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
    One LearningArtifact per Activity.
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
    Summary already exists.
    Do not regenerate it.
    */

    if (
        artifact.summary.status ===
        "COMPLETED"
    ) {
        return {
            alreadyGenerated: true,
            status: "COMPLETED",
            artifact,
        };
    }


    /*
    Summary generation is already running.
    Prevent duplicate Celery jobs.
    */

    if (
        artifact.summary.status ===
        "PROCESSING"
    ) {
        return {
            alreadyGenerated: false,
            status: "PROCESSING",
            taskId:
                artifact.summary.taskId,
            artifact,
        };
    }


    try {

        /*
        Node → Summary AI
        */

        const aiResponse =
            await requestSummaryGeneration(
                activity
            );


        /*
        Current AI uses task_id.

        taskId is also accepted defensively.
        */

        const taskId =
            aiResponse.task_id ||
            aiResponse.taskId ||
            null;


        /*
        Normal asynchronous Celery flow.
        */

        if (taskId) {

            /*
            Reload from MongoDB.

            The callback could theoretically
            finish before the original AI
            request returns.
            */

            const currentArtifact =
                await LearningArtifact.findById(
                    artifact._id
                );


            if (!currentArtifact) {
                throw new Error(
                    "Learning artifact not found"
                );
            }


            /*
            Never overwrite COMPLETED with
            PROCESSING.
            */

            if (
                currentArtifact.summary.status !==
                "COMPLETED"
            ) {

                currentArtifact.summary.status =
                    "PROCESSING";

                currentArtifact.summary.taskId =
                    taskId;

                currentArtifact.summary.error =
                    null;


                await currentArtifact.save();
            }


            return {
                alreadyGenerated: false,

                status:
                    currentArtifact.summary.status,

                taskId:
                    currentArtifact.summary.taskId,

                artifact:
                    currentArtifact,
            };
        }


        /*
        Cache-hit case.

        The AI service may send the cached
        Summary through the callback instead
        of creating a Celery task.
        */

        if (
            aiResponse.message === "Cache hit"
        ) {

            /*
            Reload because callback may already
            have updated MongoDB.
            */

            const currentArtifact =
                await LearningArtifact.findById(
                    artifact._id
                );


            return {
                alreadyGenerated:
                    currentArtifact.summary.status ===
                    "COMPLETED",

                status:
                    currentArtifact.summary.status,

                cached: true,

                artifact:
                    currentArtifact,
            };
        }


        throw new Error(
            "Summary AI did not return a task ID"
        );

    } catch (error) {

        /*
        Reload before marking FAILED.

        This prevents a successful callback
        from accidentally being overwritten.
        */

        const currentArtifact =
            await LearningArtifact.findById(
                artifact._id
            );


        if (
            currentArtifact &&
            currentArtifact.summary.status !==
            "COMPLETED"
        ) {

            currentArtifact.summary.status =
                "FAILED";

            currentArtifact.summary.error =
                error.message;


            await currentArtifact.save();
        }


        throw error;
    }
};


/*
==================================================
GET SUMMARY
==================================================
*/

const getSummaryByActivity = async (
    userId,
    activityId
) => {

    /*
    Verify that this Activity belongs
    to the authenticated user.
    */

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
            artifact.summary.status,

        taskId:
            artifact.summary.taskId,

        keyPoints:
            artifact.summary.keyPoints,

        generatedAt:
            artifact.summary.generatedAt,

        error:
            artifact.summary.error,
    };
};


/*
==================================================
SUMMARY AI CALLBACK
==================================================

Current AI callback contains:

{
    activityId: "...",
    content: [
        "Point 1",
        "Point 2",
        ...
    ]
}

No Summary subtopic is expected.
*/

const handleSummaryCallback = async ({
    activityId,
    taskId,
    status,
    content,
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
    Explicit failure callback.
    */

    if (status === "FAILED") {

        artifact.summary.status =
            "FAILED";

        artifact.summary.error =
            error ||
            "Summary generation failed";


        if (taskId) {
            artifact.summary.taskId =
                taskId;
        }


        await artifact.save();

        return artifact;
    }


    /*
    Current Summary AI sends the generated
    key points through `content`.
    */

    if (
        !Array.isArray(content) ||
        content.length === 0
    ) {
        throw new Error(
            "Summary callback does not contain summary content"
        );
    }


    /*
    Save generated Summary.
    */

    artifact.summary.status =
        "COMPLETED";

    artifact.summary.keyPoints =
        content;

    artifact.summary.generatedAt =
        new Date();

    artifact.summary.error =
        null;


    /*
    Preserve Celery task ID when supplied.
    */

    if (taskId) {
        artifact.summary.taskId =
            taskId;
    }


    await artifact.save();


    return artifact;
};


module.exports = {
    generateSummary,
    getSummaryByActivity,
    handleSummaryCallback,
};