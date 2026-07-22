const axios = require("axios");

const AI_PROCESSING_SERVICE_URL =
    process.env.AI_PROCESSING_SERVICE_URL;


const requestSummaryGeneration = async (
    activity
) => {

    if (!AI_PROCESSING_SERVICE_URL) {
        throw new Error(
            "AI_PROCESSING_SERVICE_URL is not configured"
        );
    }


    const payload = {

        activityId:
            activity._id.toString(),

        sessionId:
            activity.sessionId,

        platform:
            activity.platform,

        url:
            activity.url,

        title:
            activity.title,

        content:
            activity.content || "",

        activeStudyTime:
            activity.activeStudyTime || 0,

        startedAt:
            activity.startedAt.toISOString(),

        completedAt:
            activity.completedAt.toISOString(),

        device:
            activity.device || "",

        classification:
            activity.classification || null,
    };


    const response = await axios.post(
        `${AI_PROCESSING_SERVICE_URL}/api/summaries`,
        payload,
        {
            timeout: 10000,
        }
    );


    return response.data;
};


module.exports = {
    requestSummaryGeneration,
};