const Flashcard = require("../models/Flashcard");

// GET /api/flashcards
const getFlashcards = async (req, res) => {
  try {
    const flashcards = await Flashcard.find({
      userId: req.user.id,
    });

    res.status(200).json(flashcards);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// POST /api/flashcards
const createFlashcard = async (req, res) => {
  try {
    const {
      subject,
      topic,
      question,
      answer,
      difficulty,
    } = req.body;

    if (!subject || !question || !answer) {
      return res.status(400).json({
        message: "Subject, question and answer are required",
      });
    }

    const flashcard = await Flashcard.create({
      userId: req.user.id,
      subject,
      topic,
      question,
      answer,
      difficulty,
    });

    res.status(201).json({
      message: "Flashcard created successfully",
      flashcard,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// PATCH /api/flashcards/:id
const updateFlashcard = async (req, res) => {
  try {
    const flashcard = await Flashcard.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!flashcard) {
      return res.status(404).json({
        message: "Flashcard not found",
      });
    }

    const {
      subject,
      topic,
      question,
      answer,
      difficulty,
      status,
      nextReview,
    } = req.body;

    if (subject) flashcard.subject = subject;
    if (topic !== undefined) flashcard.topic = topic;
    if (question) flashcard.question = question;
    if (answer) flashcard.answer = answer;
    if (difficulty) flashcard.difficulty = difficulty;
    if (status) flashcard.status = status;
    if (nextReview) flashcard.nextReview = nextReview;

    await flashcard.save();

    res.status(200).json({
      message: "Flashcard updated successfully",
      flashcard,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// DELETE /api/flashcards/:id
const deleteFlashcard = async (req, res) => {
  try {
    const flashcard = await Flashcard.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!flashcard) {
      return res.status(404).json({
        message: "Flashcard not found",
      });
    }

    res.status(200).json({
      message: "Flashcard deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getFlashcards,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
};