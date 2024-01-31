const express = require("express");
const cors = require("cors");
const formidableMiddleware = require("express-formidable");
const mongoose = require("mongoose");
const authRoutes = require("./routes/AuthRoutes");
const bookRoutes = require("./routes/BookRoutes");
const emptyRoutes = require("./routes/EmptyRoutes");
const cookieParser = require("cookie-parser");
const path = require("path");

const PORT = 3001;
const app = express();

mongoose.connect("mongodb://localhost:27017/libraryAssignment");
// Check the connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// CORS
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, // access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use("/auth", authRoutes);
app.use("/book", bookRoutes);
app.use("/check", emptyRoutes);
//app.use("/", currentUserRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
