const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/database");

// Bring User
const User = require("../models/user");

// Register
router.post("/register", (req, res, next) => {
  const { name, email, username, password } = req.body;
  // validation
  User.findOne({ email: email }).then((user) => {
    if (user) {
      // user exist
      res.json({
        success: false,
        msg: "This user is already exist",
      });
    } else {
      // user does not exist
      //create new user object
      const newUser = new User({
        name: name,
        email: email,
        username: username,
        password: password,
      });
      // crypt password
      bcrypt.genSalt(8, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          // Save user
          newUser
            .save()
            .then((user) => {
              res.json({
                success: true,
                msg: "User is registered with Done !!!",
              });
            })
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

//Authenticate
router.post("/authenticate", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({ username: username }, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({ success: false, msg: "user not found" });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign(user.toJSON(), config.secret, {
          expiresIn: 604800 /*week*/,
        });
        res.json({
          success: true,
          token: "JWT " + token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            date: user.date,
          },
        });
      } else {
        // if not match
        res.json({ succes: false, msg: "Wrong Password" });
      }
    });
  });
});

//Profile
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.json({ user: req.user });
  }
);

module.exports = router;
