const { Sequelize, DataTypes } = require("sequelize");
const { dbConnect } = require("../config.js");
const bcrypt = require("bcrypt");

const User = dbConnect.define("User", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM,
    values: ["admin", "student"],
    allowNull: true,
    defaultValue: "student",
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    set(val) {
      const hashedPassword = bcrypt.hashSync(val, 10);
      return this.setDataValue("password", hashedPassword);
    },
  },
  noInduk: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize: dbConnect,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
