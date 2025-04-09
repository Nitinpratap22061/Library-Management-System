const express = require("express");
const router = express.Router();
const { getAllBooks, addBook, updateBook, deleteBook } = require("../controllers/bookController");
const { protect, allowRoles } = require("../middleware/auth");

// Public route
router.get("/", getAllBooks);

// Admin-only routes
router.post("/add", protect, allowRoles("admin"), addBook);
router.put("/:id", protect, allowRoles("admin"), updateBook);
router.delete("/:id", protect, allowRoles("admin"), deleteBook);

module.exports = router;
