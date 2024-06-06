const express = require("express");
const { PORT, dbConnect } = require("./config.js");
const problemRouter = require("./routes/problemRoute.js");
const solutionRouter = require("./routes/solutionRoute.js");
const codeRouter = require("./routes/codeRoute.js");
const userRouter = require("./routes/userRoute.js");
const cors = require("cors");
const authRouter = require("./routes/authenticateRoute.js");
const cookieSession = require("cookie-session");
const helmet = require('helmet');

const app = express();

app.use(cors({ credentials: true, origin: ["http://127.0.0.1:4173","https://ojs-client.netlify.app"] }));
// app.use(
//   cookieSession({
//     name: "OJ-session",
//     secret: "bismillahLulusGenap2024",
//     httpOnly: true,
//   })
// );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  // console.log(res);
  return res.status(234).json({ message: "Berhasil terhubung" });
});

app.use("/problems", problemRouter);
app.use("/submition", solutionRouter);
app.use("/judge", codeRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter);

const startServer = async () => {
  try {
    await dbConnect.authenticate();
    console.log("Connection has been established successfully.");
    await dbConnect.sync({ alter: false, force: false });
    app.listen(3000, () => {
      console.log("App is running on port 3000");
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};


try {
  startServer();
} catch (error) {
  console.error(error);
}
