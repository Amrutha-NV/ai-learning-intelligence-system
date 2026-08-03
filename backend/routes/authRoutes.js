const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  refreshToken,
  googleLogin,
  githubAuth,
  githubCallback,
  githubLogin,
} = require("../controllers/authController");

// Signup route
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh", refreshToken);
router.post("/google", googleLogin);
// Redirect user to GitHub
router.get("/github", githubAuth);

// GitHub redirects back here
router.get("/github/callback", githubCallback);
router.post("/github", githubLogin);

module.exports = router;