const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const chatHistory = sequelize.define(
  "chatHistory",
  {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    message: {
      type: Sequelize.TEXT(),
      allowNull: false,
    },
    isImage: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    date_time: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    timestamps: false,
  }
);

module.exports = chatHistory;
