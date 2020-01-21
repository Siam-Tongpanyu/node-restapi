const path = require("path");

require("dotenv-safe").config({
  path: path.join(__dirname, "../../.env"),
  allowEmptyValues: true
});

const whitelist = ["http://localhost:3000"];
const allowMethods = ["GET", "POST", "PUT", "DELETE"];
const allowHeaders = ["Content-Type", "Authorization"];
const corsOptions = {
  origin: whitelist,
  methods: allowMethods,
  allowedHeaders: allowHeaders
};
module.exports = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 8080,
  jwtSecret: process.env.JWT_SECRET || "GCx$Bwfh^M6ZusvGv$Bwj5S!K7#",
  mongo: {
    uri:
      process.env.MONGO_URI ||
      "mongodb+srv://siam_tongpanyu02:Olbanus835@cluster0siam-r5ldc.mongodb.net/test01?retryWrites=true&w=majority",
    option: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  corsOptions: corsOptions
};
