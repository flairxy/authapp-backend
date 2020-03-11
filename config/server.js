const mongoose = require("mongoose");
const URL = process.env.MONGODB_URL;

//connect to the database
mongoose
  .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch(error => {
    console.error("connection error:", error);
  });
const db = mongoose.connection;

db.once("open", _ => {
  console.log("Database connected:", URL);
});
