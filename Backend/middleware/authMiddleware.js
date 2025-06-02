import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";
import { PrismaClient } from "@prisma/client";

const Prisma = new PrismaClient();

export const verifyJWT = async (req, res, next) => {
  try {
    const token = 
      req.cookies.accessToken || 
      req.header("Authorization")?.replace("Bearer ", "");

    if(!token) {
      return res
        .status(401)
        .json(new ApiResponse(false, 401, {}, "Unauthorized request"));
    }

    const decodedToken = jwt.verify(token, 'secretKey');
    const user = await Prisma.user.findUnique({
      where: {
        user_id: decodedToken.userId,
      },
      select: {
        user_id: true,
        email: true,
        name: true,
        created_at: true,
        updated_at: true,
      }
    });

    if(!user) {
      return res
        .status(401)
        .json(new ApiResponse(false, 401, {}, "Invalid Access Token"));
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json(new ApiResponse(false, 401, null, error.message || "Invalid access token"));
  }
};
