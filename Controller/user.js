const { Op } = require("sequelize");
const User = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

exports.userSignup = async (req, res) => {
  try {
    const { name, email, phonenumber, password } = req.body;
    let userExist = await User.findOne({
      [Op.or]: [{ email }, { phonenumber }],
    });
    if (!userExist) {
      const hash = await bcrypt.hash(password, 10);
      const user = User.create({
        name: name,
        email: email,
        phoneNumber: phonenumber,
        password: hash,
      });
      const token = jwt.sign({ userId: user.id }, secretKey, {
        expiresIn: "1h",
      });
      res.cookie("token", token, { maxAge: 3600000 });
      return res
        .status(201)
        .json({ message: "user Account created successfully" });
    } else {
      return res
        .status(409)
        .json({ message: "Email or Phone Number already exist!" });
    }
  } catch (error) {
    console.log(error);
  }
};
