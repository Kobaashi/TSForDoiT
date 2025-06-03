import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../server.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const jwt_secret = process.env.JWT_SECRET;

export const registerUser = async (req, res) => {
  const { name, email, password, full_name } = req.body;

  try {
    if ([name, email, password, full_name].some(field => !field || field.trim() === "")) {
      return res.status(400).json(new ApiResponse(false, 400, {}, "All fields are required"));
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json(new ApiResponse(false, 400, {}, "Email already taken. Please use another email."));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        name,
        email,
        password_hash: hashedPassword,
        full_name,
      },
    });

    const { password_hash, ...userData } = newUser;

    return res.status(201).json(new ApiResponse(true, 201, userData, "User registered successfully"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiResponse(false, 500, {}, "Internal server error"));
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if ([email, password].some((field) => !field || field.trim() === "")) {
      return res
        .status(400)
        .json(new ApiResponse(false, 400, {}, "Email and password are required"));
    }

    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json(new ApiResponse(false, 401, {}, "Invalid email or password"));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json(new ApiResponse(false, 401, {}, "Invalid email or password"));
    }

    const accessToken = jwt.sign(
      { user_id: user.user_id, email: user.email },
      jwt_secret,
      {
        expiresIn: "1d",
      }
    );

    const { password_hash, ...userData } = user;

    res.cookie("accessToken", accessToken, {
      httpOnly: false,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    return res
      .status(200)
      .json(new ApiResponse(true, 200, userData, "Login successful"));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(false, 500, {}, "Internal server error"));
  }
};


