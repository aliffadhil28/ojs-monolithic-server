const Sequelize = require('sequelize')
const dbConnect = require('../config.js')
const Problem = require('./problemModel.js')
const Solution = require('./solutionModel.js')
const User = require('./userModel.js')

const db = {};

db.dbConnect = dbConnect;
db.Sequelize = Sequelize;

db.Problem = Problem;
db.Solution = Solution;
db.User = User;

// db.User.hasMany(db.Solution,{onUpdate : 'CASCADE'})
db.Solution.belongsTo(db.User,{foreignKey : 'userId'})
// db.Problem.hasMany(db.Solution,{onUpdate : 'CASCADE'})
db.Solution.belongsTo(db.Problem,{foreignKey : 'problemId'})

module.exports = db