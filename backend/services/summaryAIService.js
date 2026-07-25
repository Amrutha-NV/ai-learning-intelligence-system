const axios = require("axios");

const SUMMARY_AI_SERVICE_URL =
    process.env.SUMMARY_AI_SERVICE_URL;

const requestSummaryGeneration = async (
    activity
) => {

    if (!SUMMARY_AI_SERVICE_URL) {
        throw new Error(
            "SUMMARY_AI_SERVICE_URL is not configured"
        );
    }

    const payload = {
        activityId:
            activity._id.toString(),

        url:
            activity.url,

        title:
            activity.title || "",

        content:
            activity.content || "",

        platform:
            activity.platform || "",

        classification:
            activity.classification || null,

        callbackUrl:
            "http://127.0.0.1:5000/api/summaries/ai-callback",
    };

    console.log(
        "SUMMARY AI URL:",
        `${SUMMARY_AI_SERVICE_URL}/api/learning-session`
    );

    console.log(
        "SUMMARY AI PAYLOAD:",
        JSON.stringify(payload, null, 2)
    );

    try {

        const response = await axios.post(
            `${SUMMARY_AI_SERVICE_URL}/api/learning-session`,
            payload,
            {
                timeout: 15000,
                headers: {
                    "Content-Type":
                        "application/json",
                },
            }
        );

        console.log(
            "SUMMARY AI RESPONSE:",
            response.data
        );

        return response.data;

    } catch (error) {

        console.error(
            "SUMMARY AI ERROR STATUS:",
            error.response?.status
        );

        console.error(
            "SUMMARY AI ERROR DATA:",
            error.response?.data
        );

        throw new Error(
            error.response?.data?.message ||
            error.response?.data?.detail ||
            error.message
        );
    }
};

module.exports = {
    requestSummaryGeneration,
};