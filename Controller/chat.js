const User = require("../Models/UserModel");
const ChatHistory = require("../Models/chat-history");
const awsService = require("../services/awss3");
const { Op } = require("sequelize");

//store chat history for common-groups
exports.saveChatHistory = async (req, res, next) => {
  try {
    const user = req.user;
    const { message, GroupId } = req.body;

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
    return res
      .status(200)
      .json({ message: "Message saved to the database successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server error!" });
  }
};

//fetch chat history for common groups
exports.getAllChatHistory = async (req, res, next) => {
  try {
    const lastMessageId = req.query.lastMessageId || 0;
    const chatHistories = await ChatHistory.findAll({
      include: [
        {
          model: User,
          attibutes: ["id", "name", "date_time"],
        },
      ],
      order: [["date_time", "ASC"]],
      where: {
        GroupId: null,
        id: {
          [Op.gt]: lastMessageId,
        },
      },
    });
    const chats = chatHistories.map((ele) => {
      const user = ele.User;
      return {
        messageId: ele.id,
        message: ele.message,
        isImage: ele.isImage,
        name: user.name,
        userId: user.id,
        date_time: ele.date_time,
      };
    });
    return res
      .status(200)
      .json({ chats, message: "User chat History Fetched" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error!" });
  }
};

//fetch current user to display chat on right side
exports.getcurrentuser = async (req, res, next) => {
  const user = req.user;
  res.json({ userId: user.id, user });
};

//store the images we get from the user
exports.saveChatImages = async (req, res, next) => {
  try {
    const user = req.user;
    const image = req.file;
    const { GroupId } = req.body;
    const filename = `chat-images/group${GroupId}/user${
      user.id
    }/${Date.now()}_${image.originalname}`;
    const imageUrl = await awsService.uploadToS3(image.buffer, filename);
    if (GroupId == 0) {
      await user.createChatHistory({
        message: imageUrl,
        isImage: true,
      });
    } else {
      await user.createChatHistory({
        message: imageUrl,
        GroupId,
        isImage: true,
      });
    }

    return res
      .status(200)
      .json({ message: "image saved to database succesfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error!" });
  }
};
