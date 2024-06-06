const express = require("express");
// const Problem = require("../models/problemModel.js");
const { ValidateToken } = require("../configAlt.js");
const { Op } = require("sequelize");
const validator = require("validator");
const db = require("../models/index.js");
const User = db.User;

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const successDecode = 1;
    const decodedToken = ValidateToken(token, successDecode, res);
    if (!successDecode) {
      return res.status(401).json({
        success: false,
        message: err,
      });
    }
    var users;
    if (decodedToken.role === "admin") {
      users = await User.findAll();
    } else {
      res.status(401).json({ success: false, message: "Action Unauthorized" });
    }
    return res.status(200).json({
      message: "Success",
      total: users.length,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization.split(" ")[1];
    const successDecode = 1;
    console.log(token);
    const decodedToken = ValidateToken(token, successDecode, res);
    if (!successDecode) {
      return res.status(401).json({
        success: false,
        message: err,
      });
    }
    var user;
    if (decodedToken.role === "admin") {
      user = await User.findByPk(id);
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Action Unauthorized" });
    }
    return res.status(200).json({
      success: true,
      message: "Data successfully collected",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const data = req.body;
    const dataStored = {
      username: data.username,
      email: data.email,
      password: data.password,
      noInduk: data.noInduk,
      role : data.role
    };

    const user = await User.create(dataStored);

    return res.status(200).json({
      success: true,
      message: "User saved successfully",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err,
    });
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const data = req.body;
    const { id } = req.params;
    const dataStored = {
      username: data.username,
      email: data.email,
      noInduk: data.noInduk,
      role : data.role
    };

    if (data.password) {
      dataStored.password = data.password
    }

    const user = await User.update(dataStored, {
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization.split(" ")[1];
    const successDecode = 1;
    const decodedToken = ValidateToken(token, successDecode, res);
    if (!successDecode) {
      return res.status(401).json({
        success: false,
        message: err,
      });
    }
    var users;
    if (decodedToken.role === "admin") {
      users = await User.destroy({ where: { id: id } });
    } else {
      res.status(401).json({ success: false, message: "Action Unauthorized" });
    }
    return res.status(200).json({
      success: true,
      message: "Data successfully deleted",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
});

module.exports = router;
