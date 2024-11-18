const express = require("express");
// const rateLimit = require("express-rate-limit");

const app = express();
require("dotenv").config();
const db = require("./db");

const PORT = process.env.PORT || 3000;
app.use(express.json());

const userRoutes = require("./routes/userRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const signUp = require("./routes/test");

// const limiter = rateLimit({
//   windowMs: 10 * 60 * 1000, 
//   max: 5, 
//   message: "Too many requests, please try again later!",
// });

// app.use(limiter);

app.use("/user", userRoutes);
app.use("/candidate", candidateRoutes);
app.use("/new1", signUp);

app.listen(PORT, () => {
  console.log(`App is Listening on ${PORT}`);
});
