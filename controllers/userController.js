const User = require("../models/User");

exports.registerNewUser = async (req, res) => {
  try {
    // User.deleteMany({ email: req.body.email }, (err, data) => {
    //   res.json(data);
    // });
    const userCheck = await User.findOne({ email: req.body.email });
    if (userCheck) {
      return res.status(409).json({
        message: "email already in use"
      });
    }
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    let data = await user.save();
    const token = await user.generateAuthToken(); // here it is calling the method that we created in the model
    res.status(201).json({ data, token });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};
exports.loginUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res
        .status(401)
        .json({ error: "Login failed! Check authentication credentials" });
    }
    const token = await user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};

exports.getUserDetails = async (req, res) => {
  let data = req.user;
  data.password = undefined;
  data.tokens = undefined;
  res.json(data);
};

exports.logoutUser = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send("Logout successful");
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.logoutAllUser = async (req, res) => {
  // Log user out of all devices
  try {
    req.user.tokens.splice(0, req.user.tokens.length);
    await req.user.save();
    res.send("You've been logged out from all devices successfully");
  } catch (error) {
    res.status(500).send(error);
  }
};
