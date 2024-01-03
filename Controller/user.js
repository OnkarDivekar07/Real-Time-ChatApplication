const { Op } = require("sequelize");
const User = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

exports.userSignup = async (req, res) => {
  try {
    const { name, email, phonenumber, password } = req.body;
    let userExist = await User.findOne({
      where: {
        [Op.or]: [{ email }, { phoneNumber: phonenumber }],
      },
    });

    if (!userExist) {
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({
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
        .json({ message: "User account created successfully" });
    } else {
      return res
        .status(409)
        .json({ message: "Email or Phone Number already exists!" });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.userSignin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let userExist = await User.findOne({ where: { email } });
    if (userExist) {
      const isPasswordValid = await bcrypt.compare(
        password,
        userExist.password
      );
      if (isPasswordValid) {
        const token = jwt.sign({ userId: userExist.id }, secretKey, {
          expiresIn: "1h",
        });
        res.cookie("token", token, { maxAge: 3600000 });
        return res
          .status(201)
          .json({ message: "Username and password correct" });
      } else {
        return res.status(401).json({ message: "Invalid Password!" });
      }
    } else {
      return res.status(409).json({ message: "Account does not exist!" });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAlluser = async (req, res, next) => {
  try {
    const user = req.user;
    const users = await User.findAll({
      attributes: ["id", "name"],
      where: {
        id: {
          [Op.not]: user.id,
        },
      },
    });
    return res
      .status(200)
      .json({ users, message: "All users succesfully fetched" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error!" });
  }
};

exports.getmainpage = (req, res) => {
  res.sendFile("main.html", { root: "View" });
};
