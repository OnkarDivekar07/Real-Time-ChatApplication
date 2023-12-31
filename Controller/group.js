const User = require("../Models/UserModel");
const ChatHistory = require("../Models/chat-history");
const Group = require("../Models/groups");

exports.createGroup = async (request, response, next) => {
  try {
    const user = request.user;
    const { name, membersNo, membersIds } = request.body;
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
    return response
      .status(200)
      .json({ group, message: "Group is succesfylly created" });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal Server error!" });
  }
};
exports.updateGroup = async (request, response, next) => {
  try {
    const user = request.user;
    const { groupId } = request.query;
    const group = await Group.findOne({ where: { id: Number(groupId) } });
    const { name, membersNo, membersIds } = request.body;
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
    return response
      .status(200)
      .json({ updatedGroup, message: "Group is succesfylly updated" });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal Server error!" });
  }
};

exports.getAllgroups = async (request, response, next) => {
  try {
    const groups = await Group.findAll();
    return response
      .status(200)
      .json({ groups, message: "All groups succesfully fetched" });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal Server error!" });
  }
};

exports.getGroupChatHistory = async (request, response, next) => {
  try {
    const { groupId } = request.query;
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
    return response
      .status(200)
      .json({ chats, message: "User chat History Fetched" });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal Server error!" });
  }
};

exports.getGroupbyId = async (request, response, next) => {
  try {
    const { groupId } = request.query;
    const group = await Group.findOne({ where: { id: Number(groupId) } });
    response
      .status(200)
      .json({ group, message: "Group details succesfully fetched" });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal Server error!" });
  }
};

exports.getMygroups = async (request, response, next) => {
  try {
    const user = request.user;
    const groups = await user.getGroups();
    return response
      .status(200)
      .json({ groups, message: "All groups succesfully fetched" });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal Server error!" });
  }
};

exports.getGroupMembersbyId = async (request, response, next) => {
  try {
    const { groupId } = request.query;
    const group = await Group.findOne({ where: { id: Number(groupId) } });
    const AllusersData = await group.getUsers();
    const users = AllusersData.map((ele) => {
      return {
        id: ele.id,
        name: ele.name,
      };
    });

    response
      .status(200)
      .json({ users, message: "Group members name succesfully fetched" });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal Server error!" });
  }
};

exports.getgroupfile = (req, res) => {
  res.sendFile("group.html", { root: "View" });
};
