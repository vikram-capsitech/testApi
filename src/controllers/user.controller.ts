import asyncHandler from "express-async-handler";
import User from "../models/user.model";
import { signJwt } from "../utils/jwt.utils";
var ObjectId = require("mongodb").ObjectId;

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  // const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  const users = await User.find(keyword).find();
  res.send(users);
});

//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      pic: user.pic,
      token: signJwt(user._id.toHexString()),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      pic: user.pic,
      token: signJwt(user._id.toHexString()),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

//@description     Get User Detail
//@route           Get /api/user/:id
//@access          Public
const GetUserDetail = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: ObjectId(`${req.params.clientId}`) });
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      pic: user.pic,
    });
  } else {
    res.status(401);
    throw new Error("Something went wrong");
  }
});

//@description     Update User Detail
//@route           Get /api/user/:id
//@access          Public
const UpdateUserDetail = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.clientId, req.body);
  if (user) {
    res.json(user);
  } else {
    res.status(401);
    throw new Error("Something went wrong");
  }
});

export { allUsers, registerUser, authUser, GetUserDetail, UpdateUserDetail };
