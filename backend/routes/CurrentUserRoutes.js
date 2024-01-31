const { Router } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = Router();

router.get("/currentuser", async (req, res) => {
  console.log("in currentuser API route"); // for client to populate the logged in user details
  console.log(req.currentUser);
  console.log(req.cookies);

  try {
    if (req.cookies.jwt) {
      const decoded = jwt.verify(req.cookies.jwt, "your_secret_key");
      req.user = decoded;
      console.log(decoded);
      res.status(200).json({ message: "User is validated" });
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid Token" });
  }

  // if (req.currentUser) {
  //   const user = await User.findOne({ _id: req.currentUser.id });
  //   console.log(user);
  //   const { _id, username, isAdmin } = user;
  //   res.send({ id: _id, username, isAdmin });
  // } else {
  //   console.log("guest visit");
  //   res.send("Guest mode, no problem");
  // }
});

module.exports = router;
