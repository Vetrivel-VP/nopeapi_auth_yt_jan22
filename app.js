const express = require("express");
const app = express();
require("dotenv/config");

const mongoose = require("mongoose");

app.use(express.json());

// import the routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
app.use("/api/user/", authRoute);
app.use("/api/posts/", postRoute);

// db connection
mongoose.connect(process.env.DB_CONNECTION, () => {
  console.log("Connected");
});

app.listen(3000, () => {
  console.log("Server is up and running");
});
