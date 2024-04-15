const express = require("express");
const dotenv = require("dotenv");
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const multer = require("multer");
const cloudinary = require("cloudinary");

dotenv.config();

const router = express.Router();

const storage = multer.memoryStorage();
var upload = multer({
  storage: storage,
});

//Signup Route
const signup = async (req, res) => {
  try {
    const { firstName, lastName, userBio, userEmail, userMobile, userName } =
      req.body;

    // If current user exists

    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
      res.status(401).send("User Already Exists with this email");
    }

    // Check if file is provided
    if (!req.file) {
      return res.status(400).json({ error: "No Profile Image Provided" });
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    console.log(result);

    const password = req.body.userPassword;
    const saltRounds = 10;

    const salt = await bcrypt.genSalt(saltRounds);

    const encryptedPassword = await bcrypt.hash(password, salt);
    console.log("Request Body: ", req.body);

    const newUser = new User({
      firstName,
      lastName,
      userBio,
      userEmail,
      userMobile,
      userName,
      userPassword: encryptedPassword,
      profileImage: result.secure_url,
    });

    await newUser.save();

    return res.status(200).json({
      status: "Ok",
      user: newUser,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const { userEmail, userPassword } = req.body;
    console.log(userEmail);

    const user = await User.findOne({ userEmail });

    console.log(user);

    if (user.isAdmin === true) {
      const passwordMatch = await bcrypt.compare(
        userPassword,
        user.userPassword
      );
      if (!passwordMatch) {
        return res.json({ status: "Error", getUser: false });
      }

      const allUsers = await User.find();
      return res.json({ allUsers, user });
    } else {
      if (user) {
        const passwordMatch = await bcrypt.compare(
          userPassword,
          user.userPassword
        );
        if (passwordMatch) {
          return res.json(user);
        } else {
          return res.json({ status: "Error", getUser: false });
        }
      } else {
        return res.json({ status: "Error", getUser: false });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    await User.deleteOne({ _id: id });
    res.send({ status: "Ok" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};

const fetchUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.send({ users });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { signup, login, deleteUser, fetchUsers };
