//imports
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./util/database");
const cookieparser = require("cookie-parser");
const PORT = process.env.PORT;

//express handler function
const app = express();

//middleware for jason parsing and cors handling
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);
app.use(cookieparser());

//Routes
const mainpage = require("./routes/mainpageRoutes");
const user = require("./routes/user");
const chat = require("./routes/chatRoutes");

//Models
const User = require("./Models/UserModel");
const ChatHistory = require("./Models/chat-history");

//serving file statically
app.use(express.static("public"));

//redirecting
app.use("/user", user);
app.use("/chat", chat);
app.use(mainpage);

//associations
User.hasMany(ChatHistory);
ChatHistory.belongsTo(User, { constraints: true });

//synchronousing the dtabase table and then starting the server using promises
sequelize
  .sync({})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Started On PORT ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
