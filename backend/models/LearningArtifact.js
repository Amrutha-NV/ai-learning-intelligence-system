const mongoose = require("mongoose");


/*
==================================================
SUMMARY
==================================================
Friend's Summary AI currently returns:

content: [
    "Point 1",
    "Point 2",
    ...
]

We store that as summary.keyPoints.
==================================================
*/

const SummarySchema = new mongoose.Schema(
    {
        status: {
            type: String,
            enum: [
                "NOT_STARTED",
                "PROCESSING",
                "COMPLETED",
                "FAILED",
            ],
            default: "NOT_STARTED",
        },

        taskId: {
            type: String,
            default: null,
        },

        keyPoints: {
            type: [String],
            default: [],
        },

        generatedAt: {
            type: Date,
            default: null,
        },

        error: {
            type: String,
            default: null,
        },
    },
    {
        _id: false,
    }
);


/*
==================================================
QUIZ QUESTIONS
==================================================

Friend's Quiz AI can return:

correctAnswer: 0

where the number represents the index in options[].

Example:

options: [
    "A",
    "B",
    "C",
    "D"
]

correctAnswer: 1

means option B.
==================================================
*/

const QuizQuestionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
        },

        options: {
            type: [String],
            required: true,
        },

        correctAnswer: {
            type: Number,
            required: true,
            min: 0,
        },

        explanation: {
            type: String,
            default: "",
        },
    },
    {
        _id: true,
    }
);


/*
==================================================
GENERATED QUIZ
==================================================
*/

const QuizSchema = new mongoose.Schema(
    {
        status: {
            type: String,
            enum: [
                "NOT_STARTED",
                "PROCESSING",
                "COMPLETED",
                "FAILED",
            ],
            default: "NOT_STARTED",
        },

        taskId: {
            type: String,
            default: null,
        },

        questions: {
            type: [QuizQuestionSchema],
            default: [],
        },

        generatedAt: {
            type: Date,
            default: null,
        },

        error: {
            type: String,
            default: null,
        },
    },
    {
        _id: false,
    }
);


/*
==================================================
QUIZ ATTEMPTS
==================================================
*/

const QuizAttemptSchema = new mongoose.Schema(
    {
        score: {
            type: Number,
            required: true,
        },

        totalQuestions: {
            type: Number,
            required: true,
        },

        accuracy: {
            type: Number,
            required: true,
        },

        completedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        _id: true,
    }
);


/*
==================================================
LEARNING ARTIFACT
==================================================

One LearningArtifact belongs to one Activity.

Activity
   ↓
LearningArtifact
   ├── Summary
   ├── Quiz
   └── Quiz Attempts
==================================================
*/

const LearningArtifactSchema =
    new mongoose.Schema(
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
                index: true,
            },

            activityId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Activity",
                required: true,
                unique: true,
                index: true,
            },

            summary: {
                type: SummarySchema,
                default: () => ({}),
            },

            quiz: {
                type: QuizSchema,
                default: () => ({}),
            },

            quizAttempts: {
                type: [QuizAttemptSchema],
                default: [],
            },
        },
        {
            timestamps: true,
        }
    );


module.exports = mongoose.model(
    "LearningArtifact",
    LearningArtifactSchema
);