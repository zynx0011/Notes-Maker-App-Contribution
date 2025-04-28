const express = require("express");
const dotenv = require("dotenv");
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const multer = require("multer");
const cloudinary = require("cloudinary");
const jwt = require("jsonwebtoken");
const Notes = require("../Models/Notes");

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

    // if (
    //   firstName ||
    //   lastName ||
    //   userBio ||
    //   userEmail ||
    //   userMobile ||
    //   userName === ""
    // ) {
    //   return res.status(401).send("Please provide all the details");
    // }

    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
      return res.status(401).send("User Already Exists with this email");
    }

    // Check if file is provided
    // console.log(req.file, "req.file");
    // if (!req.file) {
    //   return res.status(400).json({ error: "No Profile Image Provided" });
    // }

    // const result = await cloudinary.uploader.upload(req.file.path);
    // console.log(result);

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
      // profileImage: result.secure_url,
    });

    await newUser.save();

    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET);

    return res
      .cookie("token", token, {
        httpOnly: true,
        samesite: "none",
        secure: true,
      })
      .status(200)
      .json({
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
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log(token, "token");

    if (user.isAdmin === true) {
      const passwordMatch = await bcrypt.compare(
        userPassword,
        user.userPassword
      );
      if (!passwordMatch) {
        return res.json({ status: "Error", getUser: false });
      }

      const allUsers = await User.find();
      return res
        .cookie("Access-token", token, {
          httpOnly: true,
          samesite: "none",
          secure: true,
        })
        .status(200)
        .json({ allUsers, user });
    } else {
      if (user) {
        const passwordMatch = await bcrypt.compare(
          userPassword,
          user.userPassword
        );
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        if (passwordMatch) {
          return res
            .cookie("Access-token", token, {
              httpOnly: true,
              samesite: "none",
              secure: true,
            })
            .json(user);
        } else {
          return res.json({ status: "Error", getUser: false });
        }
      } else {
        return res.json({ status: "Error", getUser: false });
      }
    }
  } catch (error) {
    res.status(400).json({ error: "help" + error.message });
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

const getUserNotes = async (req, res) => {
  try {
    const notes = await Notes.find({ uploadedBy: req.params.id });
    res.send({ notes });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { signup, login, deleteUser, fetchUsers, getUserNotes };
