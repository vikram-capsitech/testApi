import asyncHandler from "express-async-handler";
import Message, { IMessage } from "../models/message.model";
import User from "../models/user.model";
import Chat from "../models/chat.model";
import { uploadDocumentToAzure } from "../utils/cloudinary";
const { ObjectId } = require("mongodb");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("owner", "name pic email")
      .populate("chat");
    // const messages = await Message.aggregate([
    //   {
    //     $match: { chat: ObjectId(req.params.chatId) },
    //   },
    //   {
    //     $group: {
    //       _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
    //       chats: { $push: "$$ROOT" },
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       date: "$_id",
    //       chats: "$chats",
    //     },
    //   },
    //   { $sort: { "date": 1 } },
    // ]);
    res.json(messages);
  } catch (error: any) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req: any, res: any) => {
  const { content, chatId } = req.body;

  if (!content && !req.files?.attachments?.length) {
    throw new Error("Message content or attachment is required");
  }

  if (!content || !chatId) {
    console.log("Invalid details");
    return res.sendStatus(400);
  }

  var newMessage = {
    owner: req.user._id,
    content: content,
    chat: chatId,
    // attachment : attachment
  } as IMessage;

  try {
    // const upload = await uploadDocumentToAzure(req.files?.attachments[0]);
    // if(upload){
    //   newMessage.attachment = upload.secure_url
    // }
    // else{
    //   throw new Error('something went wrong');
    // }
    var message: any = await Message.create(newMessage);
    message = await message.populate("owner", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error: any) {
    res.status(400);
    throw new Error(error.message);
  }
});

export { allMessages, sendMessage };
