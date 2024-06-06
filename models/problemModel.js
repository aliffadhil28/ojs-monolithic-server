const { DataTypes, Sequelize } = require("sequelize");
const { dbConnect } = require("../config.js");

const Problem = dbConnect.define(
  "Problem",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(4000),
      allowNull: false,
    },
    testCases: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    workTime: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    startDate:{
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    endDate:{
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    baseImport: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "import sys\nimport time\n\n",
    },
    baseFunction: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    baseMain: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    dbConnect,
    tableName: "problems",
    timestamps: true,
    modelName: "Problems",
  }
);

module.exports =  Problem ;
