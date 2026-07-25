const axios = require("axios");


const SUMMARY_AI_SERVICE_URL =
    process.env.SUMMARY_AI_SERVICE_URL;

const QUIZ_CALLBACK_URL =
    process.env.QUIZ_CALLBACK_URL;


const requestQuizGeneration = async (
    activity,
    summary
) => {

    if (!SUMMARY_AI_SERVICE_URL) {
        throw new Error(
            "SUMMARY_AI_SERVICE_URL is not configured"
        );
    }

    if (!QUIZ_CALLBACK_URL) {
        throw new Error(
            "QUIZ_CALLBACK_URL is not configured"
        );
    }


    const payload = {
        activityId:
            activity._id.toString(),

        url:
            activity.url,

        title:
            activity.title,

        content:
            activity.content || "",

        classification: {
            track:
                activity.classification?.track || "",

            topic:
                activity.classification?.topic || "",

            subtopics:
                activity.classification?.subtopics || [],
        },

        summary: {
            keyPoints:
                summary.keyPoints || [],

            // AI schema currently expects this.
            // Our backend does not depend on it.
            subtopic: "",
        },

        callbackUrl:
            QUIZ_CALLBACK_URL,

        quiz: {
            questions: [],
        },
    };


    const response = await axios.post(
        `${SUMMARY_AI_SERVICE_URL}/api/quiz-generate`,
        payload,
        {
            timeout: 10000,
        }
    );


    return response.data;
};


module.exports = {
    requestQuizGeneration,
};