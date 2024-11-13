const express = require("express");
const router = express.Router();
const User = require("../models/user");

const { jwtAuthMiddleware, generateToken } = require("./../jwt");

router.post("/signup", async (req, res) => {
  try {
    const data = req.body;

    const newUser = new User(data);

    const response = await newUser.save();
    console.log("Data Saved");

    const payload = {
      id: response.id,
    };

    console.log(JSON.stringify(payload));
    const token = generateToken(payload);
    console.log("Token is : ", token);

    res.status(202).json({ response: response, token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server error !!!" });
  }
});

// Login Router
router.post("/login", async (req, res) => {
  try {
    const { aadhaarCardNumber, password } = req.body;
    const user = await User.findOne({ aadhaarCardNumber: aadhaarCardNumber });

    if (!user || !(await user.comparePasword(password))) {
      res.status(401).json({ error: "Invalid Username Or Password.." });
    }

    const payload = {
      id: user.id,
    };
    const token = generateToken(payload);
    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server error !!!" });
  }
});

//Profile
router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.user;

    const userId = userData.id;
    const user = await User.findById(userId);
    res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server error !!!" });
  }
});

router.put("/profile/password", async (req, res) => {
  try {
    const userId = req.user.id; //extratinf id from token
    const updateUserData = req.body; //update data for user

    const { currentPassword, newPassword } = res.body;

    const user = await User.findById(userId);

    //if user password dont match this willl throw error
    if (!(await user.comparePasword(currentPassword))) {
      res.status(401).json({ error: "Invalid Username Or Password.." });
    }

    //if its correct
    user.password = newPassword;
    await user.save();

    console.log("Password updated...");
    res.status(200).json({ message: "Password Updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server error !!!" });
  }
});

router.put("/updateName/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const updateUserData = req.body;

    const response = await User.findByIdAndUpdate(userId, updateUserData, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ message: "Profile Updated" });
    console.log(response);
  } catch (err) {
    console.log("upate error", err);
    res.status(500).json({ error: "Internal Server error !!!" });
  }
});

module.exports = router;
