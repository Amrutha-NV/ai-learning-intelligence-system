const AI_SERVICE_URL =
    process.env.AI_SERVICE_URL || "http://localhost:8000";

const AI_CALLBACK_URL =
    process.env.AI_CALLBACK_URL;


const processActivity = async (activity) => {

    if (!AI_CALLBACK_URL) {
        throw new Error(
            "AI_CALLBACK_URL is not configured"
        );
    }

    const response = await fetch(
        `${AI_SERVICE_URL}/api/process/`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                activity_id:
                    activity._id.toString(),

                callback_url:
                    AI_CALLBACK_URL,

                url: activity.url,
                title: activity.title,
                content: activity.content || "",
                platform: activity.platform,
                metadata: activity.metadata || {},
            }),
        }
    );

    if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(
            `AI Processing Service failed: ${response.status} ${errorBody}`
        );
    }

    return await response.json();
};


const getProcessingResult = async (taskId) => {

    const response = await fetch(
        `${AI_SERVICE_URL}/api/process/${taskId}`
    );

    if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(
            `Failed to get AI processing result: ${response.status} ${errorBody}`
        );
    }

    return await response.json();
};


module.exports = {
    processActivity,
    getProcessingResult,
};