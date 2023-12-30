const User = require("../Models/UserModel");
const ChatHistory = require("../Models/chat-history");
//const awsService = require("../services/awsservices");
const { Op } = require("sequelize");

exports.saveChatHistory = async (req, res, next) => {
  try {
    const user = request.user;
    const { message, GroupId } = request.body;
    if (GroupId == 0) {
      await user.createChatHistory({
        message,
      });
    } else {
      await user.createChatHistory({
        message,
        GroupId,
      });
    }
    return response
      .status(200)
      .json({ message: "Message saved to database succesfully" });
  } catch (error) {
    return response.status(500).json({ message: "Internal Server error!" });
  }
};
