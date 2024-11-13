const express = require("express");
const router = express.Router();
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
      { _id: candidateId, "votes._id": voteId },
      { $set: { "votes.$.name": name } },
      { new: true }
    );

    if (!response) {
      return res.status(404).json({ message: "Candidate or Vote not found" });
    }

    console.log("Vote name updated successfully", response);
    res.status(200).json({ message: "Voter name updated successfully" });
  } catch (err) {
    console.log("Error in Vote Upadte", err);
    res.status(500).json({ message: "Something went Wrong!!" });
  }
});

module.exports = router;
