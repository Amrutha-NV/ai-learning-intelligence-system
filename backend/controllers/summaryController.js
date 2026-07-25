const summaryService = require(
    "../services/summaryService"
);


/*
==================================================
GENERATE SUMMARY
==================================================

POST
/api/summaries/generate/:activityId
*/

const generateSummary = async (
    req,
    res
) => {

    try {

        const { activityId } =
            req.params;


        const result =
            await summaryService
                .generateSummary(
                    req.user.id,
                    activityId
                );


        return res.status(202).json({
            success: true,
            data: result,
        });

    } catch (error) {

        console.error(
            "Summary generation failed:",
            error.message
        );


        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


/*
==================================================
GET SUMMARY
==================================================

GET
/api/summaries/:activityId
*/

const getSummary = async (
    req,
    res
) => {

    try {

        const { activityId } =
            req.params;


        const summary =
            await summaryService
                .getSummaryByActivity(
                    req.user.id,
                    activityId
                );


        if (!summary) {

            return res.status(404).json({
                success: false,
                message:
                    "Summary not found",
            });
        }


        return res.status(200).json({
            success: true,
            data: summary,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


/*
==================================================
SUMMARY AI CALLBACK
==================================================

POST
/api/summaries/ai-callback

This endpoint is called by the AI service,
not by the frontend.
*/

const receiveSummaryCallback = async (
    req,
    res
) => {

    try {

        const result =
            await summaryService
                .handleSummaryCallback(
                    req.body
                );


        console.log(
            `Summary callback processed for activity ${req.body.activityId}`
        );


        return res.status(200).json({
            success: true,
            message:
                "Summary callback processed successfully",

            data: {
                summary:
                    result.summary,
            },
        });

    } catch (error) {

        console.error(
            "Summary callback failed:",
            error.message
        );


        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


module.exports = {
    generateSummary,
    getSummary,
    receiveSummaryCallback,
};