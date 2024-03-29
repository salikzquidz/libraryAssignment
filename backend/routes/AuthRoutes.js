const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password, isAdmin } = req.body;
  try {
    const newUser = new User({ username, password, isAdmin });
    await newUser.save();

    res.status(201).json({ message: "New User Created" });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // WIll change THIS !! - send token in cookies
    // Generate a JSON Web Token (JWT)
    const token = jwt.sign({ userId: user._id }, "your_secret_key", {
      expiresIn: "1h",
    });

    // set cookies
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 12 * 1000,
      // maxAge: 10000,
    });

    res.json({
      userInfo: {
        username: user.username,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.clearCookie("username");
    res.clearCookie("isAdmin");
    console.log("cookie jwt cleared");
    res.send({});
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

module.exports = router;
