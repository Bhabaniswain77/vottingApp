const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Candidate = require("../models/candidate");

const { jwtAuthMiddleware, generateToken } = require("../jwt");

const checkAdminRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (user.role === "admin") {
      return true;
    }
  } catch (err) {
    return false;
  }
};

//router to add a candidate
router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id)))
      return res.status(403).json({ message: "User dont have admin Role.." });

    const data = req.body;

    const newCandidate = new Candidate(data);

    const response = await newCandidate.save();
    console.log("candidate Data Saved");

    res.status(202).json({ response: response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server error !!!" });
  }
});

router.put("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!checkAdminRole(req.user.id))
      return res.status(403).json({ message: "User dont have admin Role.." });

    const candidateID = req.params.candidateID;
    const updateCandidateData = req.body;

    const response = await Person.findByIdAndUpdate(
      candidateID,
      updateCandidateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!response) {
      res.status(404).json({ error: "Candidate Not found" });
    }

    console.log("Candidate Data Updated");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server error !!!" });
  }
});

router.delete("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!checkAdminRole(req.user.id))
      return res.status(403).json({ message: "User dont have admin Role.." });

    const candidateID = req.params.candidateID;

    const response = await Candidate.findByIdAndDelete(candidateID);

    if (!response) {
      res.status(404).json({ error: "Candidate Not found" });
      console.log("Candidate Not Found!!");
    }

    console.log("Candidate Data Deleted");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server error !!!" });
  }
});

router.post("/vote/:candidateID", jwtAuthMiddleware, async (req, res) => {
  candidateId = req.params.candidateID;
  userId = req.user.id;

  try {
    const candidate = await Candidate.findById(candidateId);
    // console.log(candidate, "DATA");
    if (!candidate) {
      return res.status(404).json({ message: "Candidate Not Found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    if (user.isVoted) {
      return res.status(400).json({ message: "You have Already Voted" });
    }

    if (user.role == "admin") {
      return res.status(403).json({ message: "You are admin, You can't vote" });
    }

    candidate.votes.push({ user: userId, name: user.name });
    candidate.voteCount++;
    await candidate.save();

    user.isVoted = true;
    await user.save();
    res.status(202).json({ message: "Congrats You Have Voted Succesfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server error !!!" });
  }
});
//extra added by me

router.get("/vote/count", async (req, res) => {
  try {
    const candidate = await Candidate.find().sort({ voteCount: -1 });

    const voteRecord = candidate.map((data) => {
      return {
        party: data.party,
        count: data.voteCount,
      };
    });
    if (voteRecord.length === 0) {
      return res
        .status(200)
        .json({ message: "VOTE fetch success", voteCount: 0 });
    } else {
      return res.status(200).json(voteRecord);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server error !!!" });
  }
});

router.get("/candidateCount", async (req, res) => {
  try {
    const totalCandidates = await Candidate.countDocuments();
    console.log("Total number of candidates:", totalCandidates);
    return res.status(202).json(totalCandidates);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server error !!!" });
  }
});

router.get("/wonCandidate", async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ voteCount: -1 });

    if (candidates.length === 0) {
      console.log("No candidates found.");
      return;
    }
    const winner = candidates[0];
    res
      .status(200)
      .json(`The winner is ${winner.name} with ${winner.voteCount} votes.`);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server error !!!" });
  }
});

router.get("/looserCandidate", async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ voteCount: 1 });

    if (candidates.length === 0) {
      console.log("No candidates found.");
      return;
    }
    const looser = candidates[0];
    res
      .status(200)
      .json(`The Looser is ${looser.name} with ${looser.voteCount} votes.`);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server error !!!" });
  }
});
module.exports = router;
