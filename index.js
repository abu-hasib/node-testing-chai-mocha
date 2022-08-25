const express = require("express");
const app = express();

const mongoose = require("mongoose");
const connectionFactory = require("./app");
const username = "dbase";
const password = "pass";
const dbname = "mongo-sinon";
const { userSchema } = require("./src/models/user.model");

async function main() {
  const User = connectionFactory().model("User", userSchema);
  mongoose.connect(
    `mongodb+srv://${username}:${password}@cluster0.h1o0j.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true }
  );

  const db = await mongoose.connection;
  db.on("error", console.error.bind(console, "connection error: "));
  db.once("open", async function () {
    console.log("Connected successfully");
  });

  const count = await User.countDocuments({ profileId: 200 });
  console.log("Here please:", count);

  // Post API to add user to Database
  app.post("/", async (req, res, next) => {
    try {
      const { profileId, name, dob, experience } = req.body;
      const user = await saveUser({ profileId, name, dob, experience });
      res.json({
        message: "Inserted Successfully",
        user: user,
      });
    } catch (err) {
      next(err);
    }
  });

  // Get API to get user by his profileId
  app.get("/:profileId", async (req, res, next) => {
    try {
      const { profileId } = req.params;
      const user = await getUser({ profileId });
      res.json({
        message: "Fetched Successfully",
        user: user,
      });
    } catch (err) {
      next(err);
    }
  });

  app.listen(3030, () => {
    console.log("Server started on port 3030");
  });
}

main();
