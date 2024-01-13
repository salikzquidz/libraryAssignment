const express = require("express");
const cors = require("cors");
const formidableMiddleware = require("express-formidable");
const mongoose = require("mongoose");
const authRoutes = require("./routes/AuthRoutes");
const bookRoutes = require("./routes/BookRoutes");

const PORT = 3001;
const app = express();

mongoose.connect("mongodb://localhost:27017/libraryAssignment");
// Check the connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(formidableMiddleware());
app.use("/auth", authRoutes);
app.use("/book", bookRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
