const jwt = require("jsonwebtoken");
function checkCurrentUser(req, res, next) {
  if (!req.cookies.jwt) {
    req.user = null;
    next();
  } else {
    try {
      const decode = jwt.verify(req.cookies.jwt, "your_secret_key");
      req.user = decode;
      next();
    } catch (error) {
      console.error(error);
      req.user = null;
      next();
    }
  }
}

module.exports = checkCurrentUser;
