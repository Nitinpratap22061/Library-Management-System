const Issue = require("../models/Issue");
const Book = require("../models/Book");

// Issue a book to a user
const issueBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.quantity <= 0) {
      return res.status(400).json({ message: "Book not available" });
    }

    // Decrease quantity
    book.quantity -= 1;
    await book.save();

    // Get issue date and calculate due date (10 days from now)
    const issueDate = new Date();
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + 10);

    const issue = new Issue({
      user: req.user.id,
      book: bookId,
      issueDate: issueDate,
      dueDate: dueDate
    });

    await issue.save();

    res.status(201).json({ 
      message: "Book issued successfully", 
      issue,
      dueDate: dueDate
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Return a book
const returnBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const issue = await Issue.findOne({
      user: req.user.id,
      book: bookId,
      isReturned: false
    });

    if (!issue) {
      return res.status(404).json({ message: "No such issued book found" });
    }

    issue.returnDate = new Date();
    issue.isReturned = true;
    await issue.save();

    // Increase quantity back
    const book = await Book.findById(bookId);
    book.quantity += 1;
    await book.save();

    res.json({ message: "Book returned successfully", issue });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all books issued by a specific user
const getUserIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ user: req.user.id })
      .populate("book")
      .sort({ issueDate: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin: Get all issues
const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find().populate("book").populate("user", "name email");
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  issueBook,
  returnBook,
  getUserIssues,
  getAllIssues,
};
