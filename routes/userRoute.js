const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const User = require("../model/userModel");
const secret = config.get("secret");
const router = express.Router();

//CREATE user (must be the one, like admin)
//PUBLIC
router.post("/createuserifyouneedit", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are require" });
  }
  bcrypt.hash(password, 8, (err, hash) => {
    if (err) {
      console.log("bcrypt error ", err);
    } else {
      User.findOne({ email })
        .then(user => {
          if (user) {
            return res.status(409).json({ message: "Request error" });
          }
          const admin = new User({
            email: email,
            password: hash
          });
          admin
            .save()
            .then(admin => {
              jwt.sign(
                { id: admin._id },
                secret,
                { expiresIn: 600 },
                (err, token) => {
                  if (err) {
                    res.json({
                      message: "token error",
                      error: err
                    });
                  } else {
                    res.status(201).json({
                      token,
                      admin: {
                        id: admin._id,
                        email: admin.email
                      }
                    });
                  }
                }
              );
            })
            .catch(err => console.log("create error ", err));
        })
        .catch(err => console.log("find error ", err));
    }
  });
});

//LOG IN
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are require" });
  } else {
    User.findOne({ email }).then(admin => {
      if (!admin) {
        res.status(404).json({
          message: "user not found"
        });
      } else {
        bcrypt.compare(password, admin.password).then(match => {
          if (!match) {
            res.status(400).json({
              message: "user or password incorrect"
            });
          } else {
            jwt.sign(
              { id: admin._id },
              secret,
              { expiresIn: 600 },
              (err, token) => {
                if (err) {
                  res.json({
                    message: "token error",
                    error: err
                  });
                } else {
                  res.json({
                    token,
                    admin: {
                      id: admin._id,
                      email: admin.email
                    }
                  });
                }
              }
            );
          }
        });
      }
    });
  }
});

module.exports = router;
