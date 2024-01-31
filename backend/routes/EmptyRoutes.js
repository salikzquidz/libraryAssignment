const { Router } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = Router();
const checkCurrentUser = require("../middlewares/checkCurrentUser");

router.get("/", checkCurrentUser, async (req, res, next) => {
  if (!req.user) {
    console.log("Invalidate Token");
    res.status(200).json({ message: "Please login" });
  } else {
    console.log("VALIDATED");
    res.status(200).json({ message: "Validated", userInfo: req.user });
  }

  //res.json({ message: "Hehe" });
});

module.exports = router;
