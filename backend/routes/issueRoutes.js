const express = require("express");
const router = express.Router();
const {
  issueBook,
  returnBook,
  getUserIssues,
  getAllIssues,
} = require("../controllers/issueController");
const { protect, allowRoles } = require("../middleware/auth");

// User routes
router.post("/issue/:bookId", protect, issueBook);
router.post("/return/:bookId", protect, returnBook);
router.get("/my", protect, getUserIssues);

// Admin route
router.get("/all", protect, allowRoles("admin"), getAllIssues);

module.exports = router;
