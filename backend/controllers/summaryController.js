const summaryService = require(
    "../services/summaryService"
);


const prepareSummary = async (
    req,
    res
) => {
    try {

        const { activityId } =
            req.params;


        const result =
            await summaryService.prepareSummary(
                req.user.id,
                activityId
            );


        return res.status(200).json({
            success: true,
            data: result,
        });

    } catch (error) {

        console.error(
            "Prepare summary failed:",
            error.message
        );


        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


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

        console.error(
            "Get summary failed:",
            error.message
        );


        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


module.exports = {
    prepareSummary,
    getSummary,
};