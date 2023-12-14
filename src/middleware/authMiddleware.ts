import jwt from "jsonwebtoken";
import User from "../models/user.model";
import asyncHandler from "express-async-handler";

const protect = asyncHandler(async (req: any, res, next) => {
  let token: string;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      //decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET ?? '') as jwt.JwtPayload;
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
  else token = '';

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export { protect };