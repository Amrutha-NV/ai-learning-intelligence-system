const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getFlashcards,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
} = require("../controllers/flashcardController");

router.get("/", protect, getFlashcards);

router.post("/", protect, createFlashcard);

router.patch("/:id", protect, updateFlashcard);

router.delete("/:id", protect, deleteFlashcard);

module.exports = router;