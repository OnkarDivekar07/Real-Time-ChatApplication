const User = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

exports.authorization = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decode = jwt.verify(token, secretKey);
    const user = await User.findByPk(decode.userId);
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(401).send({ message: "Unauthorized" });
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "Time out please sign in again" });
    } else {
      res
        .status(500)
        .json({ message: "Something went wrong  - please sign again" });
    }
  }
};
