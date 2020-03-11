// Express is used to create the API
const express = require("express");
const port = process.env.PORT || 3000;
const logger = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("./config/server");

const corsConfig = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
};

const app = express();
app.use(corsConfig);
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
const userRoutes = require("./routes/user.route");
app.use("/user", userRoutes);

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
