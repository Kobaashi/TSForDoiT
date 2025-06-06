import { db } from "../server.js";

export const postRequest = async (req, res) => {
  const { from_user_id, to_user_id, status } = req.body


  try {

    if (!from_user_id || !to_user_id || !status) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }


    const existingRequest = await db.matchRequest.findFirst({
      where: {
        from_user_id,
        to_user_id
      }
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Request already exists"
      });
    }

    const newRequest = await db.matchRequest.create({
      data: {
        from_user_id,
        to_user_id,
        status,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    return res.status(201).json({
      success: true,
      data: newRequest,
      message: "Request created successfully"
    });

  } catch (error) {
    console.error("postRequest error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}
