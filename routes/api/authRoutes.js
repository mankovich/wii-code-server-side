const express = require("express");
const router = express.Router();
const { createNewUser, validateToken, newToken, findUserByEmail } = require('../../controllers/authController');
// const { User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


router.post("/signup", async (req, res) => {

  const userJson = req.body;
  if (!userJson.password || !userJson.email) {
    throw new Error("Invalid user json.");
  }
  const newUser = await createNewUser(userJson);
  res.json({
    ...newUser,
  })

});

router.post("/login", async (req, res) => {
  const user = await findUserByEmail(req.body.email);
  if (user) {
    console.log(user)
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Incorrect password" });
    }
    const token = newToken(user);
    res.status(200).json({
      token,
      user,
    });
  } else {
    res.status(401).json({
      msg: 'user not found',
    });
  }

});

router.get("/profile", (req, res) => {

  const token = req.headers.authorization?.split(" ")[1];
  try {
    console.log({ token });
    const tokenData = validateToken(token);
    res.json({ user: tokenData });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      msg: "invalid token",
      error: error,
    });
  }
});

module.exports = router;