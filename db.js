const mongoose = require("mongoose");
require("dotenv").config();

const mongoURL = process.env.MONGODB_URL_LOCAL;

mongoose
  .connect(mongoURL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));
const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection Error ", err);
});

db.on("disconnected", () => {
  console.log("MongoDB Disconnected");
});

module.exports = db;
