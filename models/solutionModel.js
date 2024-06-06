const { DataTypes, Sequelize } = require("sequelize");
const { dbConnect } = require("../config.js");

const Solution = dbConnect.define(
  "Solution",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(5000),
      allowNull: false,
    },
    testPass: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    workTime: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    executeTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isReviewed: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    feedback: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    success : {
      type : DataTypes.BOOLEAN,
      allowNull : true,
      defaultValue : 0
    }
  },
  { 
    dbConnect,
    tableName: "solutions", 
    timestamps: true, 
  }
);

// await Solution.sync()
module.exports = Solution