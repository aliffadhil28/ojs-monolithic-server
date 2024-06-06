const express = require("express");
const { ValidateToken } = require("../config.js");
const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = ValidateToken(token, res);
  const results = [];
  const feedBacks = [];
  const testCases = req.body.testCases;

  const parseElement = (element) => {
    try {
      // Try to parse element as JSON
      return JSON.parse(element);
    } catch (error) {
      // If fails, return the original element
      return element;
    }
  };

  const testCaseArrays = testCases.map((testCase) => {
    const testCaseString = `[${testCase}]`; // Add square brackets to make it an array
    return JSON.parse(testCaseString).map(parseElement);
  });
  var fullCode;
  try {
    for (const array of testCaseArrays) {
      const testArg = req.body.baseMain.replace(/\${test\[\d\]}/g, (match) => {
        const index = parseInt(match.match(/\d/)[0]);
        return array[index];
      });
      const codeInput = req.body.code;
      fullCode = `${codeInput + "\n\r\n" + testArg}`;

      const options = {
        method: "POST",
        url: "https://onecompiler-apis.p.rapidapi.com/api/v1/run",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key":
            "26b00b8cbfmshaffcc5c03ec9d0ep1ea5f7jsn148eab1ea80b",
          "X-RapidAPI-Host": "onecompiler-apis.p.rapidapi.com",
        },
        data: {
          language: "python",
          stdin: null,
          files: [
            {
              name: "index.py",
              content: fullCode,
            },
          ],
        },
      };
      var executionTime;
      try {
        const response = await axios.request(options);
        const output = response.data.stdout;
        executionTime = response.data.executionTime;
        const exception = response.data.exception;
        if (exception == null) {
          const res = output.trim();
          if (res == "False") {
            feedBacks.push("WA");
          } else {
            feedBacks.push("CA");
          }
          results.push(res);
        } else {
          // Handle different types of errors
          results.push("Error");
          if (exception.includes("timeout")) {
            feedBacks.push("TLE"); // Time Limit Exceeded
          } else if (exception.includes("MemoryError")) {
            feedBacks.push("MLE"); // Memory Limit Exceeded
          } else if (exception.includes("Error")) {
            feedBacks.push("RE"); // Runtime Error
          } else {
            feedBacks.push("CE"); // Compile Error
          }
        }
      } catch (error) {
        console.error(error.message);
      }
    }
    res
      .status(200)
      .json({
        success: true,
        results: results,
        feedBacks: feedBacks,
        executionTime: executionTime,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
