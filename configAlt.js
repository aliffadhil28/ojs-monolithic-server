const { Sequelize } = require("sequelize");
const jwt = require("jsonwebtoken");

const dbConnect = new Sequelize(
  "bv6yjuvs51tztywd5jna",
  "uqoxygb8dmbzb1hu",
  "DeRcOVDNLTBxn2zg5tgI",
  {
    host: "bv6yjuvs51tztywd5jna-mysql.services.clever-cloud.com",
    dialect: "mysql",
    timezone: "Asia/Jakarta",
  }
);

// export const PORT = 8000;

// export const mongoDBURL =
//   "mongodb+srv://root:root@react-learn.ekqwiyr.mongodb.net/problem_solving?retryWrites=true&w=majority";

const jwtKey = "bismillahLulusGenap2024";

function ValidateToken(token, successDecode, res,key = jwtKey) {
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Error!Token was not provided.",
    });
  }
  console.log("tokenize");
  //Decoding the token
  try {
    const decodedToken = jwt.verify(token, key);
    return decodedToken;
  } catch (err) {
    successDecode = 0
    return successDecode
  }
}

module.exports = { dbConnect, jwtKey, ValidateToken };
