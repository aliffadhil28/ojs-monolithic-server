const express = require("express");
const Problem = require("../models/problemModel.js");
const { ValidateToken } = require("../configAlt.js");
const { Op } = require("sequelize");
const validator = require("validator");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = ValidateToken(token,res);
    let problems
    if (decodedToken.role !== 'admin') {
        problems = await Problem.findAll({
          where : {
            startDate : {
              [Op.lte] : new Date()
            },
            endDate : {
              [Op.gte] : new Date()
            }
          }
        })
    }else{
      problems = await Problem.findAll();
    }
    return res.status(200).json({
      message: "Success",
      total: problems.length,
      data: problems,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = ValidateToken(token,res);
    const { id } = req.params;
    const problem = await Problem.findByPk(id);

    return res.status(200).json({
      success: true,
      data: problem,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const token = req.headers.authorization.split(" ")[1];;
    const decodedToken = ValidateToken(token, res);
    if (decodedToken.role !== 'admin') {
        return res.status(404).json({
          success : true,
          message : "Not Authorized Account"
        });
    }
    if (
      !data.title ||
      !data.description ||
      !data.code ||
      !data.level ||
      !data.testCases ||
      !data.workTime ||
      !data.baseFunction ||
      !data.baseMain
    ) {
      return res
        .status(404)
        .json({ message: "Parameter yang dimasukkan tidak lengkap" });
    }
    const newProblem = {
      title: data.title,
      description: data.description,
      code: data.code,
      level: data.level,
      startDate: data.startDate,
      testCases: data.testCases,
      workTime: data.workTime,
      baseFunction: data.baseFunction,
      baseMain: data.baseMain,
    };

    // await Problem.sync({ force: true });
    const problem = await Problem.create(newProblem);

    return res
      .status(200)
      .json({ message: "Problem saved successfully", data: problem });
  } catch (error) {
    return res.status(501).json({ message: error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = ValidateToken(token,res);
    if (decodedToken.role !== 'admin') {
        return res.status(404).json({
          success : true,
          message : "Not Authorized Account"
        });
    }
    const data = req.body;
    const { id } = req.params;
    if (
      !data.title ||
      !data.description ||
      !data.code ||
      !data.level ||
      !data.testCases ||
      !data.workTime ||
      !data.baseFunction ||
      !data.baseMain ||
      !data.startDate
    ) {
      return res
        .status(404)
        .json({ message: "Parameter yang dimasukkan tidak lengkap" });
    }
    const problem = await Problem.update(req.body, {
      where: { id: id },
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Data updated successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = ValidateToken(token,res);
    if (decodedToken.role !== 'admin') {
        return res.status(404).json({
          success : true,
          message : "Not Authorized Account"
        });
    }
    const { id } = req.params;

    const rowsDeleted = await Problem.destroy({
      where: { id },
    });

    if (rowsDeleted > 0) {
      return res.status(200).json({
        success: true,
        message: "Problem deleted successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }
});

module.exports = router;
