const mongoose = require("mongoose");


/*
====================================================
QUIZ ATTEMPT
Stores each completed attempt by the user.
====================================================
*/
const QuizAttemptSchema = new mongoose.Schema(
    {
        score: {
            type: Number,
            required: true,
            min: 0,
        },

        totalQuestions: {
            type: Number,
            required: true,
            min: 1,
        },

        accuracy: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
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
====================================================
SUMMARY
Filled later by Summary AI.
====================================================
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

        subtopic: {
            type: String,
            default: null,
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
====================================================
QUIZ QUESTION
Filled later by Quiz AI.
====================================================
*/
const QuizQuestionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
        },

        options: {
            type: [String],
            default: [],
        },

        correctAnswer: {
            type: String,
            required: true,
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
====================================================
QUIZ
Stores generated quiz + AI processing state.
====================================================
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
====================================================
LEARNING ARTIFACT
One artifact belongs to one Activity.
====================================================
*/
const LearningArtifactSchema = new mongoose.Schema(
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