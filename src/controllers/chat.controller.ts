import asyncHandler from "express-async-handler";
import Chat, { IChat } from "../models/chat.model";
import User from "../models/user.model";
import { FilterQuery } from "mongoose";
import { ProjectionWrapper as PartialWrapper } from "../types";
var ObjectId = require("mongodb").ObjectId;

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = asyncHandler(async (req: any, res: any) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var chats: any = await Chat.find({
    "users.2": { $exists: false },
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  } as FilterQuery<IChat>)
    .populate("users", "-password")
    .populate("lastMessage");

  // chats = await User.populate(chats, {
  //   path: "latestMessage.owner",
  //   select: "name pic email",
  // });

  if (chats.length > 0) {
    res.send(chats[0]);
  } else {
    var chatData: PartialWrapper<IChat> = {
      name: "owner",
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(fullChat);
    } catch (error: any) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChats = asyncHandler(async (req: any, res: any) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("owner", "-password")
      .populate("lastMessage")
      .sort({ updatedAt: -1 })
      .then(async (results: any) => {
        res.status(200).send({
          groups: results.filter((u: any) => u.users.length > 2),
          chats: results.filter((u: any) => u.users.length === 2),
        });
      });
  } catch (error: any) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
const createGroupChat = asyncHandler(async (req: any, res: any) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      name: req.body.name,
      users: users,
      owner: req.user.id,
      pic: req.body.pic
    } as PartialWrapper<IChat>);

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("owner", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error: any) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, name } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      name,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("owner", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("owner", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

//@description     get group detail
//@route           GET /api/chat/group/:groupId
//@access          Protected
const getGroupDetail = asyncHandler(async (req: any, res: any) => {
  try {
    const fullGroupChat = await Chat.findOne({
      _id: ObjectId(`${req.params.groupId}`),
    })
      .populate("users", "-password")
      .populate("owner", "-password");
    res.status(200).json(fullGroupChat);
  } catch (error: any) {
    res.status(400);
    throw new Error(error.message);
  }
});

export {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  getGroupDetail,
};
