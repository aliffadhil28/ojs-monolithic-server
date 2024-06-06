const express = require("express");
const { ValidateToken } = require("../config.js");
// const Solution = require("./models/submitionModel.js");
const db = require("../models/index.js");
const Solution = db.Solution;
const User = db.User;
const Problem = db.Problem;
const validator = require("validator");

const router = express.Router();

// Get Solution
router.get("/", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const data = req.body;
    const decodedToken = ValidateToken(token);
    if (decodedToken.role !== "admin") {
      return res.status(404).json({
        success: true,
        message: "Not Authorized Account",
      });
    }
    let solution
    if (
      validator.isString(data.testPass) &&
      validator.isString(data.executeTime) && 
      validator.isJSON(data.workTime) &&
      validator.isString(data.code) &&
      validator.isString(data.feedback)
    ) {
      solution = await Solution.findAll();
    }
    return res.status(200).json({
      success: true,
      total: solution.length,
      data: solution,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Store
router.post("/", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = ValidateToken(token);
    const solution = await Solution.create(req.body);

    return res.status(200).json({
      success: true,
      message: "Data stored successfully",
      data: solution,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

/*
 * Get Solutions using Problem ID
 */
router.get("/solutions/:id", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = ValidateToken(token);
    if (decodedToken.role !== "admin") {
      return res.status(404).json({
        success: true,
        message: "Not Authorized Account",
      });
    }
    const { id } = req.params;
    const userSolutions = await Solution.findAll({
      include: {
        model: User,
        attributes: ["id", "username", "noInduk"], // Atribut yang ingin ditampilkan dari tabel User
      },
      where: { problemId: id },
    });

    // Mengelompokkan submisi berdasarkan pengguna
    const users = {};
    userSolutions.forEach((solution) => {
      const userId = solution.User.id;
      if (!users[userId]) {
        users[userId] = {
          id: solution.User.id,
          username: solution.User.username,
          noInduk: solution.User.noInduk,
          submitions: [],
        };
      }
      users[userId].submitions.push({
        id: solution.id,
        code: solution.code,
        testPass: solution.testPass,
        workTime: solution.workTime,
        executeTime: solution.executeTime,
        isReviewed: solution.isReviewed,
        feedback: solution.feedback,
        score: solution.score,
        success: solution.success,
        createdAt: solution.createdAt,
        updatedAt: solution.updatedAt,
        problemId: solution.problemId,
      });
    });

    return res.status(200).json({ success: true, data: Object.values(users) });
  } catch (error) {
    return res.status(500).json({ message: "Data not found" });
  }
});

/*
 *Get Solutions Using User ID
 */
router.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userSolutions = await Solution.findAll({
      include: {
        model: Problem,
        attributes: ["id", "title", "code"],
      },
      where: { userId: id },
    });

    // Mengelompokkan submisi berdasarkan problem
    const problems = {};
    userSolutions.forEach((solution) => {
      const problemId = solution.problemId;
      if (!problems[problemId]) {
        problems[problemId] = {
          id: solution.Problem.id,
          title: solution.Problem.title,
          code: solution.Problem.code,
          submitions: [],
        };
      }
      problems[problemId].submitions.push({
        id: solution.id,
        code: solution.code,
        testPass: solution.testPass,
        workTime: solution.workTime,
        executeTime: solution.executeTime,
        isReviewed: solution.isReviewed,
        feedback: solution.feedback,
        score: solution.score,
        success: solution.success,
        createdAt: solution.createdAt,
        updatedAt: solution.updatedAt,
      });
    });

    // Mengubah objek problems menjadi array
    const data = Object.values(problems);

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ message: "Data not found" });
  }
});

// Get Solution by Id
router.get("/:id", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = ValidateToken(token);
    if (decodedToken.role !== "admin") {
      return res.status(404).json({
        success: true,
        message: "Not Authorized Account",
      });
    }
    const { id } = req.params;

    const solution = await Solution.findByPk(id);

    if (!solution) {
      return res.status(500).json({ message: "Data not found" });
    }

    return res.status(200).json({
      success: true,
      data: solution,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update Solution
router.put("/:id", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = ValidateToken(token);
    if (decodedToken.role !== "admin") {
      return res.status(404).json({
        success: true,
        message: "Not Authorized Account",
      });
    }
    const { id } = req.params;

    const solution = await Solution.update(id, req.body);

    if (!solution) {
      return res.status(500).json({ message: "Data not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Data updated successfully",
      data: solution,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete Solution
router.delete("/:id", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = ValidateToken(token);
    if (decodedToken.role !== "admin") {
      return res.status(404).json({
        success: true,
        message: "Not Authorized Account",
      });
    }
    const { id } = req.params;

    const rowsDeleted = await Solution.destroy({
      where: { id },
    });

    if (rowsDeleted > 0) {
      return res.status(200).json({
        success: true,
        message: "Solution deleted successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Solution not found",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
