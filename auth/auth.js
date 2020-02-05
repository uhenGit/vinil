const jwt = require("jsonwebtoken");
const config = require("config");

const secret = config.get("secret");

const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    res.status(401).json({
      message: "Access denied. Not authorized"
    });
  } else {
    try {
      const verifyToken = jwt.verify(token, secret);
      req.user = verifyToken;
      next();
    } catch (e) {
      res.status(400).json({
        message: "invalid token"
      });
    }
  }
};

module.exports = auth;
