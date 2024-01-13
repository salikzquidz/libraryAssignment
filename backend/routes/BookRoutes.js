const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const books = await Book.find();

    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  const { title, description } = req.body;
  const imagePath = req.file?.path;
  try {
    const book = new Book({ title, description, image: imagePath });
    await book.save();

    res.status(201).json({ message: "New Book Created" });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  const bookId = req.params.id;
  const { title, description } = req.body;
  const imagePath = req.file ? req.file.path : undefined;
  try {
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    book.title = title;
    book.description = description;

    if (imagePath) {
      book.image = imagePath;
    }

    const updatedBook = await book.save();

    res.json(updatedBook);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  const bookId = req.params.id;
  try {
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.image) {
      await fs.unlink(book.image);
    }
    const deletedBook = await Book.findByIdAndDelete();

    res.json(deletedBook);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
