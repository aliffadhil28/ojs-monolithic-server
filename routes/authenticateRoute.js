const express = require("express");
const jwt = require("jsonwebtoken");
const User = require('../models/userModel.js')
const bcrypt = require("bcrypt");
const { jwtKey } = require("../config.js");
const validator = require('validator')

const router = express.Router();

router.post("/login",async (req, res, next) => {
  try {
    let { email, password } = req.body;
    
    let userExist
    // validator.isStrongPassword
    if (validator.isEmail(email)) {
      userExist = await User.findOne({
        where: {
          email: email,
        },
      });
  
    }
    
    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User not found please check your credential again",
      });
    }

    if (!bcrypt.compareSync(password, userExist.password)) {
      return res.status(404).json({
        success: false,
        message: "Incorrect password",
      });
    }

    let token;

    token = await jwt.sign(
      {
        id: userExist.id,
        email: userExist.email,
        role: userExist.role,
      },
      jwtKey,
      { expiresIn: "2h" }
    );

    // req.session.token = token;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user : userExist,
      token: token
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Route for register
router.post("/register", async (req, res, next) => {
  try {
    if (req.body.password != req.body.confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password not matched",
      });
    }
    const dataStored = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      noInduk: req.body.noInduk,
    };

    const user = await User.create(dataStored);
    let token;
    try{
      token = jwt.sign(
        {
          noInduk: user.noInduk,
          role: user.role,
        },
        jwtKey,
        { expiresIn: "2h" }
      );
    }catch(err){
      return res.status(501).json({
        success: false,
        message: err,
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
      token: token,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err,
    });
  }
});

// Refresh JWT Token
router.post("/refresh-token", async (req, res, next) => {
  try {
    let { email } = req.body;

    const userExist = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User not found please check your credential again",
      });
    }

    let token;

    token = await jwt.sign(
      {
        email: userExist.email,
        role: userExist.role,
      },
      jwtKey,
      { expiresIn: "2h" }
    );

    req.session.token = token;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user : userExist
      // token: token,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err,
    });
  }
});

module.exports = router;
