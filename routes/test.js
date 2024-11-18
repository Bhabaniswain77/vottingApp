const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const Candidate = require("../models/candidate");

router.post("/newSignup", async (req, res) => {
  try {
    const info = req.body;
    const newUser = new User(info);

    const response = await newUser.save();
    console.log("data saved", response);
    res.status(200).json({ message: "saved" });
  } catch (err) {
    console.log("error in signup", err);
    res.status(400).json({ message: "internal error" });
  }
});

router.post("/update/:userId", (req, res) => {
  try {
    const userId = req.params.body;
    const updateUser = req.body;

    const response = updateUser.set();
    console.log(response);
  } catch (err) {
    console.log(err);
  }
});

//nested object update in mongoDB

router.patch("/candidate/:candidateId/votes/:voteId", async (req, res) => {
  const candidateId = req.params.candidateId;
  const voteId = req.params.voteId;
  const name = req.body.name;

  try {
    const response = await Candidate.findOneAndUpdate(
      { _id: candidateId, "votes.user": voteId },
      { $set: { "votes.$.name": name } },
      { new: true }
    );

    if (!response) {
      return res.status(404).json({ message: "Candidate or Vote not found" });
    }

    const userResponse = await User.findOneAndUpdate(
      { _id: voteId },
      { $set: { name: name } },
      { new: true }
    );

    if (!userResponse) {
      return res.status(404).json({ message: "Candidate or Vote not found" });
    }

    console.log("Vote name updated successfully", response,">>>>>>>>>>>>...............<<<<<<<<<<<",userResponse);
    res.status(200).json({ message: "Voter name updated successfully" });
  } catch (err) {
    console.log("Error in Vote Upadte", err);
    res.status(500).json({ message: "Something went Wrong!!" });
  }
});

// let ids = ["6732f8f1b163f7f788a3a587", "6732fd0709eb7050b88833bd"];

router.post("/gettingIdData", async (req, res) => {
  const ids = req.body.ids;
  console.log("Hitting", ids);
  try {
    const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));
    console.log("Hitting", objectIds);
    const users = await User.find({ _id: { $nin: objectIds } });
    res.status(200).json({message:"Fetching success"});
    console.log(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went Wrong!!" });
  }
});

module.exports = router;
