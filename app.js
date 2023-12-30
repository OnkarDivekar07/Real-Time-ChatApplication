//imports
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./util/database");
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

//Routes
const mainpage = require("./routes/mainpage");
const user = require("./routes/user");

//Models
const User = require("./Models/UserModel");

//serving file statically
app.use(express.static("public"));

//redirecting
app.use("/user", user);
app.use(mainpage);

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
