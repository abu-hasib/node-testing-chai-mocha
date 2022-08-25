const mongoose = require("mongoose");

const username = "dbase";
const password = "pass";
const dbname = "mongo-sinon";

module.exports = function connectionFactory() {
  const conn = mongoose.createConnection(
    `mongodb+srv://${username}:${password}@cluster0.h1o0j.mongodb.net/?retryWrites=true&w=majority`
  );

  // conn.model("User", require("./src/models/user.model"));

  return conn;
};
