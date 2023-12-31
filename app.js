//imports
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const sequelize = require("./util/database");
const cookieparser = require("cookie-parser");
const PORT = process.env.PORT;
const cronService = require("./services/cron");

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

//cron job
cronService.job.start();

//Routes
const mainpage = require("./routes/mainpageRoutes");
const user = require("./routes/user");
const chat = require("./routes/chatRoutes");
const group = require("./routes/group");
const resetpassword = require("./routes/resetpassword");

//Models
const User = require("./Models/UserModel");
const ChatHistory = require("./Models/chat-history");
const Groups = require("./Models/groups");
const GroupMember = require("./Models/group-members");
const Forgotpassword = require("./Models/forgotpassword");
const websocketconnection = require("./services/websocket");
//serving file statically
app.use(express.static("Public"));

//redirecting
app.use("/user", user);
app.use("/chat", chat);
app.use("/group", group);
app.use("/password", resetpassword);
app.use(mainpage);

//associations
User.hasMany(ChatHistory);
ChatHistory.belongsTo(User, { constraints: true });
Groups.hasMany(ChatHistory);
ChatHistory.belongsTo(Groups);
User.belongsToMany(Groups, { through: GroupMember });
Groups.belongsToMany(User, { through: GroupMember });
Groups.belongsTo(User, {
  foreignKey: "AdminId",
  constraints: true,
  onDelete: "CASCADE",
});

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

const server = http.createServer(app);

const io = new Server(server);

//socket.io connection handling

io.on("connection", websocketconnection);

//synchronousing the dtabase table and then starting the server using promises
sequelize
  .sync({})
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server Started On PORT ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
