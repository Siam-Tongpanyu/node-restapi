const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const upload = require("./utils/upload");
const {
  port,
  mongo,
  corsOptions
} = require("./config/vars.js");
const feedRoutes = require("./routes/feed");
const userRoutes = require("./routes/user");

// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({
  extended: false
});

const app = express();

app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  "/api/feed",
  jsonParser,
  cors(corsOptions),
  upload.single("image"),
  feedRoutes
);
app.use(
  "/api/auth",
  jsonParser,
  cors(corsOptions),
  upload.single("image"),
  userRoutes
);
app.use((err, req, res, next) => {
  // general error handling
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message;
  if (err.data) {
    data = err.data;
  } else {
    data = "";
  }
  res.status(status).json({
    message: message,
    data: data
  });
});

mongoose
  .connect(mongo.uri, mongo.option)
  .then(result => {
    console.log("database start on " + mongo.uri);
  })
  .catch(err => {
    //  console.log(err);
  });
let server = app.listen(port, () => {
  console.log("server start on port " + port);
});

module.exports = server;