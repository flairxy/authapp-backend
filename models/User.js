const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var validator = require("validator");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Include your name"]
  },
  email: {
    type: String,
    required: [true, "Please Include your email"],
    validate: {
      validator: value => {
        return validator.isEmail(value);
      },
      message: `Email is not valid`
    }
  },
  password: {
    type: String,
    required: [true, "Please Include your password"]
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});

//this method will hash the password before saving the user model
userSchema.pre("save", async function(next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

//this method generates an auth token for the user
userSchema.methods.generateAuthToken = async function() {
  const user = this;
  // const token = jwt.sign(
  //   { _id: user._id, name: user.name, email: user.email },
  //   process.env.JWT_KEY
  // );
  const token = jwt.sign(
    { _id: user._id, name: user.name, email: user.email },
    process.env.JWT_KEY,
    { expiresIn: "5h" }
  );
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

//this method search for a user by email and password.
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    return;
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return;
  }
  return user;
};

userSchema.statics.userExists = async function(email) {
  const userCheck = await User.findOne(email);
  if (userCheck) {
    return res.status(409).json({
      message: "email already in use"
    });
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
