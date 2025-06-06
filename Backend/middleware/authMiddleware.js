import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";
import { PrismaClient } from "@prisma/client";

const Prisma = new PrismaClient();
const jwt_secret = process.env.JWT_SECRET

export const verifyJWT = async (req, res, next) => {
  try {
    const token = 
      req.cookies.accessToken || 
      req.header("Authorization")?.replace("Bearer ", "");
    console.log("Token:", token);
    console.log("Cookies received:", req.cookies);
    if (!token) {
      return res
        .status(401)
        .json(new ApiResponse(false, 401, {}, "Unauthorized request"));
    }

    const decodedToken = jwt.verify(token, jwt_secret);

    const user = await Prisma.user.findUnique({
      where: {
        user_id: decodedToken.user_id,
      },
      select: {
        user_id: true,
        email: true,
        name: true,
        created_at: true,
        updated_at: true,
      }
    });

    if (!user) {
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

export const authenticate = (req, res, next) => {
  const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
  console.log("Token received:", token);

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("User authenticated:", req.user);
    next();
  } catch (err) {
    console.log("Invalid token");
    return res.status(403).json({ message: "Invalid token" });
  }
};

