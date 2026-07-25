const {
    getAnalytics,
} = require(
    "../services/analyticsService"
);


/*
==================================================
GET DASHBOARD ANALYTICS
==================================================
*/

const getDashboardAnalytics = async (
    req,
    res
) => {

    try {

        const userId =
            req.user.id;


        const analytics =
            await getAnalytics(
                userId
            );


        return res.status(200).json({
            success: true,
            data: analytics,
        });

    } catch (error) {

        console.error(
            "Analytics error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch analytics",
        });
    }
};


module.exports = {
    getDashboardAnalytics,
};