import { db } from "../server.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getUsers = async (req, res) => {
  try {
    const users = await db.user.findMany()

    if (!users || users.length === 0) {
      return res.status(404).json(new ApiResponse(false, 404, {}, "No users found"));
    }

    return res.status(200).json(new ApiResponse(true, 200, users, "Users fetched successfully"));
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json(new ApiResponse(false, 500, {}, "Internal server error"));
  }
}
