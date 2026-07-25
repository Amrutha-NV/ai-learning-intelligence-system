const Activity = require(
    "../models/Activity"
);

const LearningArtifact = require(
    "../models/LearningArtifact"
);


/*
==================================================
DATE HELPERS
==================================================
*/

const getStartOfDay = (date) => {

    const result = new Date(date);

    result.setHours(
        0,
        0,
        0,
        0
    );

    return result;
};


const getDateKey = (date) => {

    const d = new Date(date);

    const year =
        d.getFullYear();

    const month =
        String(
            d.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            d.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;
};


/*
==================================================
GET ANALYTICS
==================================================
*/

const getAnalytics = async (
    userId
) => {

    /*
    ==================================================
    FETCH USER DATA
    ==================================================
    */

    const activities =
        await Activity.find({
            userId,
        })
            .sort({
                createdAt: -1,
            })
            .lean();


    const artifacts =
        await LearningArtifact.find({
            userId,
        })
            .populate(
                "activityId",
                "classification createdAt"
            )
            .lean();


    /*
    ==================================================
    1. TOTAL STUDY TIME
    ==================================================

    activeStudyTime is assumed to be seconds.

    Keep seconds in backend calculation and
    return hours for dashboard.
    ==================================================
    */

    const totalStudySeconds =
        activities.reduce(
            (total, activity) =>
                total +
                (
                    Number(
                        activity.activeStudyTime
                    ) || 0
                ),
            0
        );


    const totalStudyTime =
        Number(
            (
                totalStudySeconds /
                3600
            ).toFixed(2)
        );


    /*
    ==================================================
    2. TOPICS STUDIED
    ==================================================

    Count unique classification.topic values.
    ==================================================
    */

    const topics = new Set();


    activities.forEach(
        (activity) => {

            const topic =
                activity.classification
                    ?.topic
                    ?.trim();


            if (topic) {
                topics.add(topic);
            }
        }
    );


    const topicsStudied =
        topics.size;


    /*
    ==================================================
    3. QUIZ ACCURACY
    ==================================================

    Average accuracy across all quiz attempts.
    ==================================================
    */

    const allQuizAttempts = [];


    artifacts.forEach(
        (artifact) => {

            if (
                Array.isArray(
                    artifact.quizAttempts
                )
            ) {

                artifact.quizAttempts.forEach(
                    (attempt) => {

                        if (
                            typeof attempt.accuracy ===
                            "number"
                        ) {
                            allQuizAttempts.push(
                                attempt.accuracy
                            );
                        }
                    }
                );
            }
        }
    );


    let quizAccuracy = 0;


    if (
        allQuizAttempts.length > 0
    ) {

        const totalAccuracy =
            allQuizAttempts.reduce(
                (total, accuracy) =>
                    total + accuracy,
                0
            );


        quizAccuracy =
            Number(
                (
                    totalAccuracy /
                    allQuizAttempts.length
                ).toFixed(2)
            );
    }


    /*
    ==================================================
    4. STUDY STREAK
    ==================================================

    Consecutive calendar days containing
    at least one Activity.

    If user studied today:
        today → yesterday → ...

    If user has not studied today but studied
    yesterday, we still preserve the current streak.

    If neither today nor yesterday contains study,
    current streak = 0.
    ==================================================
    */

    const studyDateKeys =
        new Set(
            activities.map(
                (activity) =>
                    getDateKey(
                        activity.createdAt
                    )
            )
        );


    const today =
        getStartOfDay(
            new Date()
        );


    const yesterday =
        new Date(today);

    yesterday.setDate(
        yesterday.getDate() - 1
    );


    let streakCursor = null;


    if (
        studyDateKeys.has(
            getDateKey(today)
        )
    ) {

        streakCursor =
            new Date(today);

    } else if (
        studyDateKeys.has(
            getDateKey(yesterday)
        )
    ) {

        streakCursor =
            new Date(yesterday);
    }


    let studyStreak = 0;


    while (
        streakCursor &&
        studyDateKeys.has(
            getDateKey(
                streakCursor
            )
        )
    ) {

        studyStreak++;


        streakCursor.setDate(
            streakCursor.getDate() - 1
        );
    }


    /*
    ==================================================
    5. STUDY DISTRIBUTION BY TRACK
    ==================================================
    */

    const trackSeconds = {};


    activities.forEach(
        (activity) => {

            const track =
                activity.classification
                    ?.track
                    ?.trim();


            if (!track) {
                return;
            }


            const studySeconds =
                Number(
                    activity.activeStudyTime
                ) || 0;


            if (!trackSeconds[track]) {
                trackSeconds[track] = 0;
            }


            trackSeconds[track] +=
                studySeconds;
        }
    );


    const classifiedStudySeconds =
        Object.values(
            trackSeconds
        ).reduce(
            (total, seconds) =>
                total + seconds,
            0
        );


    const studyDistribution =
        Object.entries(
            trackSeconds
        )
            .map(
                ([track, seconds]) => {

                    const percentage =
                        classifiedStudySeconds > 0
                            ? Number(
                                (
                                    (
                                        seconds /
                                        classifiedStudySeconds
                                    ) *
                                    100
                                ).toFixed(2)
                            )
                            : 0;


                    return {
                        track,

                        studyTime:
                            Number(
                                (
                                    seconds /
                                    3600
                                ).toFixed(2)
                            ),

                        percentage,
                    };
                }
            )
            .sort(
                (a, b) =>
                    b.studyTime -
                    a.studyTime
            );


    /*
    ==================================================
    6. MOST STUDIED TRACK
    ==================================================
    */

    const mostStudiedTrack =
        studyDistribution.length > 0
            ? studyDistribution[0].track
            : null;


    /*
    ==================================================
    7. HIGHEST QUIZ ACCURACY TOPIC
    ==================================================
    */

    let highestQuizAccuracyTopic =
        null;

    let highestQuizAccuracy =
        -1;


    artifacts.forEach(
        (artifact) => {

            const topic =
                artifact.activityId
                    ?.classification
                    ?.topic;


            if (
                !topic ||
                !Array.isArray(
                    artifact.quizAttempts
                )
            ) {
                return;
            }


            artifact.quizAttempts.forEach(
                (attempt) => {

                    if (
                        typeof attempt.accuracy !==
                        "number"
                    ) {
                        return;
                    }


                    if (
                        attempt.accuracy >
                        highestQuizAccuracy
                    ) {

                        highestQuizAccuracy =
                            attempt.accuracy;

                        highestQuizAccuracyTopic =
                            topic;
                    }
                }
            );
        }
    );


    /*
    ==================================================
    8. ACTIVE DAYS THIS MONTH
    ==================================================
    */

    const now =
        new Date();


    const currentYear =
        now.getFullYear();

    const currentMonth =
        now.getMonth();


    const activeDays =
        new Set();


    activities.forEach(
        (activity) => {

            const activityDate =
                new Date(
                    activity.createdAt
                );


            if (
                activityDate.getFullYear() ===
                    currentYear &&
                activityDate.getMonth() ===
                    currentMonth
            ) {

                activeDays.add(
                    getDateKey(
                        activityDate
                    )
                );
            }
        }
    );


    const activeDaysThisMonth =
        activeDays.size;


    /*
    ==================================================
    9. LAST STUDY SESSION
    ==================================================

    activities were sorted newest first.
    ==================================================
    */

    const lastStudySession =
        activities.length > 0
            ? activities[0].createdAt
            : null;


    /*
    ==================================================
    FINAL RESPONSE
    ==================================================
    */

    return {

        totalStudyTime,

        topicsStudied,

        quizAccuracy,

        studyStreak,

        studyDistribution,

        mostStudiedTrack,

        highestQuizAccuracyTopic,

        activeDaysThisMonth,

        lastStudySession,
    };
};


module.exports = {
    getAnalytics,
};