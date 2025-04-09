const Book = require("../models/Book");

// @desc Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Add a new book
exports.addBook = async (req, res) => {
  const { title, author, description, quantity } = req.body;
  try {
    const book = await Book.create({ 
      title, 
      author, 
      description, 
      quantity: quantity || 1 
    });
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Delete a book
exports.deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Update a book
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
