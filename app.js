const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS,GET,POST,PATCH,DELETE,PUT"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

//Import Routes

const user = require("./routes/user");
const student = require("./routes/student");
const certificate = require("./routes/certificate");
// const course= require("./routes/course");
const institute = require("./routes/institute");

app.use(user);
app.use(student);
app.use(certificate);
// app.use(course);
app.use(institute);


console.log(`${process.env.PORT}`);
console.log(`${process.env.MYSQL_HOST}`);
console.log(`${process.env.MYSQL_USER}`);
console.log(`${process.env.MYSQL_PASSWORD}`);
console.log(`${process.env.MYSQL_DATABASE}`);

//error handling
app.use((error, req, res, next) => {
  console.log("\x1b[31m%s\x1b[0m", error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

isProduction = true;
//isProduction = false;

if (isProduction) {
  sequelize
    .sync({ alter: { drop: false } })
    .then(async (result) => {
      // console.log(result);
      app.listen(`${process.env.PORT}`);
      console.log(`app.listen(${process.env.PORT})`);
    })
    .catch((err) => {
      console.log(err);
    });
} else {
  app.listen(`${process.env.PORT}`);
}