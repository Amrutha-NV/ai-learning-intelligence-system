const Activity = require("../models/Activity");

const LearningArtifact = require(
    "../models/LearningArtifact"
);


/*
Find Activity and verify that it belongs
to the authenticated user.
*/
const getUserActivity = async (
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

    return activity;
};


/*
Prepare a LearningArtifact for Summary generation.

This does NOT call the friend's AI yet.
*/
const prepareSummary = async (
    userId,
    activityId
) => {

    const activity = await getUserActivity(
        userId,
        activityId
    );


    /*
    Summary should use classified learning data.
    */
    if (
        activity.classificationStatus !==
        "COMPLETED"
    ) {
        throw new Error(
            "Activity classification is not completed"
        );
    }


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
        artifact.summary.status ===
        "COMPLETED"
    ) {
        return {
            ready: true,
            alreadyGenerated: true,
            status: "COMPLETED",
            artifact,
        };
    }


    return {
        ready: true,
        alreadyGenerated: false,
        status:
            artifact.summary.status,
        activity,
        artifact,
    };
};


/*
Get Summary for an Activity.
*/
const getSummaryByActivity = async (
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
            artifact.summary.status,

        taskId:
            artifact.summary.taskId,

        keyPoints:
            artifact.summary.keyPoints,

        subtopic:
            artifact.summary.subtopic,

        generatedAt:
            artifact.summary.generatedAt,

        error:
            artifact.summary.error,
    };
};


/*
Save the completed Summary.

Later the friend's AI result/callback
will call this function.
*/
const completeSummary = async (
    userId,
    activityId,
    summaryData
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
        throw new Error(
            "Learning artifact not found"
        );
    }


    const {
        keyPoints,
        subtopic,
    } = summaryData;


    if (
        !Array.isArray(keyPoints) ||
        keyPoints.length === 0
    ) {
        throw new Error(
            "Summary keyPoints are required"
        );
    }


    artifact.summary.status =
        "COMPLETED";

    artifact.summary.keyPoints =
        keyPoints;

    artifact.summary.subtopic =
        subtopic || null;

    artifact.summary.generatedAt =
        new Date();

    artifact.summary.error = null;


    await artifact.save();


    return artifact.summary;
};


module.exports = {
    prepareSummary,
    getSummaryByActivity,
    completeSummary,
};