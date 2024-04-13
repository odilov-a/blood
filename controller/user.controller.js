const Users = require("../models/User.js");
const { sign } = require("../utils/jwt.js");
const bcrypt = require("bcrypt");

exports.getMe = async (req, res) => {
  try {
    const { userId } = req.headers;
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.json({
      data: {
        _id: user._id,
        login: user.login,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.register = async (req, res) => {
  try {
    const { login, password } = req.body;
    const existingUser = await Users.findOne({ login });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this login already exists",
      });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new Users({
      login,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    return res.json({
      data: {
        token: sign(savedUser._id.toString()),
        login: savedUser.login,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;
    const user = await Users.findOne({ login });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid login credentials",
      });
    }
    return res.json({
      data: {
        token: sign(user._id.toString()),
        login: user.login,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.update = async (req, res) => {
  try {
    const { userId } = req.headers;
    const {
      login,
      password,
    } = req.body;
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (login) {
      user.login = login;
    }
    if (password) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      user.password = hashedPassword;
    }
    const updatedUser = await user.save();
    return res.json({ data: updatedUser });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
