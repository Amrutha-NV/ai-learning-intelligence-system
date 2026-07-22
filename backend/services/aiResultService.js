const Activity = require("../models/Activity");

const {
    getProcessingResult,
} = require("./aiProcessingService");

const {
    integrateClassification,
} = require("./dashboardService");


/*
Save classification and update dashboard.
Shared by callback + manual fallback.
*/
const completeActivityClassification = async (
    activity,
    classification,
    taskId = null
) => {

    if (!classification) {
        throw new Error(
            "Classification is required"
        );
    }

    /*
    STEP 1:
    Save classification on Activity.
    */
    activity.classification =
        classification;

    activity.classificationStatus =
        "COMPLETED";

    activity.processed = true;

    if (
        !activity.classificationTaskId &&
        taskId
    ) {
        activity.classificationTaskId =
            taskId;
    }

    await activity.save();


    /*
    STEP 2:
    Classification → Dashboard
    */
    await integrateClassification(
        activity.userId,
        activity._id,
        classification
    );


    return activity;
};


/*
Manual/fallback synchronization.

GET /api/activities/:activityId/ai-result
*/
const syncAIProcessingResult = async (
    activityId
) => {

    const activity =
        await Activity.findById(
            activityId
        );

    if (!activity) {
        throw new Error(
            "Activity not found"
        );
    }

    /*
    If callback already completed it,
    there is nothing else to fetch.
    */
    if (
        activity.classificationStatus ===
        "COMPLETED"
    ) {
        return {
            completed: true,
            status: "COMPLETED",
            activity,
        };
    }

    if (!activity.classificationTaskId) {
        throw new Error(
            "No AI processing task found for this activity"
        );
    }

    const aiResult =
        await getProcessingResult(
            activity.classificationTaskId
        );

    if (
        aiResult.status !==
        "COMPLETED"
    ) {
        return {
            completed: false,
            status: aiResult.status,
            activity,
        };
    }

    const classification =
        aiResult.data?.classification;

    if (!classification) {
        throw new Error(
            "AI processing completed without classification"
        );
    }

    await completeActivityClassification(
        activity,
        classification,
        activity.classificationTaskId
    );

    return {
        completed: true,
        status: "COMPLETED",
        activity,
    };
};


/*
Automatic Celery callback.

POST /api/activities/ai-callback
*/
const handleAIProcessingCallback = async ({
    activityId,
    taskId,
    status,
    classification,
}) => {

    if (!activityId) {
        throw new Error(
            "activityId is required"
        );
    }

    const activity =
        await Activity.findById(
            activityId
        );

    if (!activity) {
        throw new Error(
            "Activity not found"
        );
    }


    /*
    Verify callback belongs to this
    Celery task when task ID exists.
    */
    if (
        activity.classificationTaskId &&
        taskId &&
        activity.classificationTaskId !==
            taskId
    ) {
        throw new Error(
            "Callback task ID does not match activity task ID"
        );
    }


    /*
    SUCCESS
    */
    if (status === "COMPLETED") {

        if (!classification) {
            throw new Error(
                "Classification is required for completed callback"
            );
        }

        await completeActivityClassification(
            activity,
            classification,
            taskId
        );

        return activity;
    }


    /*
    FAILURE
    */
    if (status === "FAILED") {

        activity.classificationStatus =
            "FAILED";

        activity.processed = false;

        if (
            !activity.classificationTaskId &&
            taskId
        ) {
            activity.classificationTaskId =
                taskId;
        }

        await activity.save();

        return activity;
    }


    throw new Error(
        `Unsupported callback status: ${status}`
    );
};


module.exports = {
    syncAIProcessingResult,
    handleAIProcessingCallback,
};