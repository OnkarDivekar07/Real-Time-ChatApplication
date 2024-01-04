const User = require("../Models/UserModel");
const ChatHistory = require("../Models/chat-history");
const Group = require("../Models/groups");
const { Op } = require("sequelize");
//for creating a group
exports.createGroup = async (req, res, next) => {
  try {
    const user = req.user;
    const { name, membersNo, membersIds } = req.body;

    const group = await user.createGroup({
      name,
      membersNo,
      AdminId: user.id,
    });

    membersIds.push(user.id);
    await group.addUsers(
      membersIds.map((ele) => {
        return Number(ele);
      })
    );

    return res
      .status(200)
      .json({ group, message: "Group is successfully created" });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ message: "Group with the same name already exists." });
    }

    console.error(error);
    return res.status(500).json({ message: "Internal Server error!" });
  }
};

//for updating group
exports.updateGroup = async (req, res, next) => {
  try {
    const user = req.user;
    const { groupId } = req.query;
    const group = await Group.findOne({ where: { id: Number(groupId) } });
    const { name, membersNo, membersIds } = req.body;
    const updatedGroup = await group.update({
      name,
      membersNo,
      AdminId: user.id,
    });
    membersIds.push(user.id);
    await updatedGroup.setUsers(null);
    await updatedGroup.addUsers(
      membersIds.map((ele) => {
        return Number(ele);
      })
    );
    return res
      .status(200)
      .json({ updatedGroup, message: "Group is succesfylly updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error!" });
  }
};

//fetched chat history from model to show group chats on screen
exports.getGroupChatHistory = async (req, res, next) => {
  try {
    const { groupId } = req.query;
    const chatHistories = await ChatHistory.findAll({
      include: [
        {
          model: User,
          attibutes: ["id", "name", "date_time"],
        },
      ],
      order: [["date_time", "ASC"]],
      where: {
        GroupId: Number(groupId),
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

//fetching group data from group table to update the group details and for showing groups when user clicks on it
exports.getGroupbyId = async (req, res, next) => {
  try {
    const { groupId } = req.query;
    const group = await Group.findOne({ where: { id: Number(groupId) } });
    res
      .status(200)
      .json({ group, message: "Group details succesfully fetched" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error!" });
  }
};

//fetching data from group model to show groups related to that perticular user  when user redirect to group page
exports.getMygroups = async (req, res, next) => {
  try {
    const user = req.user;
    const groups = await user.getGroups();
    return res
      .status(200)
      .json({ groups, message: "All groups succesfully fetched" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error!" });
  }
};
//getting group members id and data to showcase list of current members in group update model
exports.getGroupMembersbyId = async (req, res, next) => {
  try {
    const { groupId } = req.query;
    const group = await Group.findOne({ where: { id: Number(groupId) } });
    const AllusersData = await group.getUsers();
    const users = AllusersData.map((ele) => {
      return {
        id: ele.id,
        name: ele.name,
      };
    });

    res
      .status(200)
      .json({ users, message: "Group members name succesfully fetched" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error!" });
  }
};

//it is fetch all the users except the current user to show search list during group creation
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

//sending group page to the frontend
exports.getgroupfile = (req, res) => {
  res.sendFile("group.html", { root: "View" });
};
