const express = require("express");
const router = express.Router();
// const { User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


router.post("/signup", (req, res) => { 
  const userJson = req.body;
  userJson.password = bcrypt.hashSync(userJson.password, 4)
  User.create(userJson)
    .then((newUser) => {
      const token = jwt.sign(
        {
          id: newUser.id,
          email: newUser.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "2h",
        }
      );
      res.json({
        token,
        user: newUser,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "error occurred", err });
    });
});

router.post("/login", (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((foundUser) => {
      if (!foundUser) {
        return res.status(401).json({ msg: "No user with that email" });
      }
      if (!bcrypt.compareSync(req.body.password, foundUser.password)) {
        return res.status(401).json({ msg: "incorrect password" });
      }
      const token = jwt.sign(
        {
          id: foundUser.id,
          email: foundUser.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "2h",
        }
      );
      res.json({
        token,
        user: foundUser,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "error occurred", err });
    });
});



router.get("/profile", (req, res) => {

  const token = req.headers.authorization?.split(" ")[1];
  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
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