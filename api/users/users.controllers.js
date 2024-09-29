const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const generateToken = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  return token;
};

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

exports.signup = async (req, res) => {
  try {
    const { password } = req.body;
    const securePassword = await hashPassword(password);
    req.body.password = securePassword;
    const newUser = await User.create(req.body);
    const token = generateToken(newUser);
    res.status(201).json({ token: token });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.signin = async (req, res) => {
  try {
    const token = generateToken(req.user);
    res.status(201).json({ token: token });
  } catch (err) {
    res.status(500).json("Server Error");
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("urls");
    res.status(201).json(users);
  } catch (err) {
    next(err);
  }
};
