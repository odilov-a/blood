const dotenv = require("dotenv");
dotenv.config();
require("./bot.js");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/router.js");
require("./backup.js");
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 3333;
const app = express();
app.use(express.json());

const logDir = path.join(__dirname, "logs");
function getCurrentDateTime() {
  const now = new Date();
  return `${now.getFullYear()}-${padNumber(now.getMonth() + 1)}-${padNumber(
    now.getDate()
  )}`;
}
function padNumber(num) {
  return num.toString().padStart(2, "0");
}
const logFilePath = path.join(logDir, `${getCurrentDateTime()}.mongodb.log`);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

mongoose.set("debug", function (collectionName, methodName, ...methodArgs) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${collectionName}.${methodName} ${JSON.stringify(
    methodArgs[0]
  )} ${JSON.stringify(methodArgs[1])}\n`;
  fs.appendFileSync(logFilePath, logMessage, "utf8");
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("mongodb connected"))
  .catch((err) => console.log("db error", err.message));

app.use(cors());

app.use("/api", mainRouter);
app.use("/uploads", express.static("uploads"));
app.use("/files", express.static("files"));
app.listen(process.env.PORT || 3333, () =>
  console.log(`server is running ${PORT}`)
);

module.exports = app;