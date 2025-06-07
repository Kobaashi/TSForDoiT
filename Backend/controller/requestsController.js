import { MatchStatus } from "@prisma/client";
import { db } from "../server.js";

export const postPendingRequest = async (req, res) => {
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
        status: MatchStatus.pending,
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

export const getAllRequestsPendingToUser = async (req, res) => {
  const user_id = req.user?.user_id;

  if (!user_id) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }

  try {
    const pendingRequests = await db.matchRequest.findMany({
      where: {
        to_user_id: user_id,
        status: MatchStatus.pending 
      },
      include: {
        to_user: {
          select: {
            user_id: true,
            name: true,
            full_name: true,
            email: true,
          }
        },
        from_user: {            
          select: {
            user_id: true,
            name: true,
            full_name: true,
            email: true,
          }
        }
      }
    });

    return res.status(200).json({
      success: true,
      data: pendingRequests,
      message: "Pending incoming requests retrieved successfully"
    });

  } catch (error) {
    console.error("getIncomingPendingRequests error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAllRequestsPendingFromUser = async (req, res) => {
  const user_id = req.user?.user_id;

  if (!user_id) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }

  try {
    const pendingRequests = await db.matchRequest.findMany({
      where: {
        from_user_id: user_id,
        status: MatchStatus.pending 
      },
      include: {
        to_user: {
          select: {
            user_id: true,
            name: true,
            full_name: true,
            email: true,
          }
        },
        from_user: {            
          select: {
            user_id: true,
            name: true,
            full_name: true,
            email: true,
          }
        }
      }
    });

    return res.status(200).json({
      success: true,
      data: pendingRequests,
      message: "Pending incoming requests retrieved successfully"
    });

  } catch (error) {
    console.error("getIncomingPendingRequests error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAllAcceptedRequestsByUserId = async (req, res) => {
  const user_id = req.user?.user_id;

  if (!user_id) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }

  try {
    const pendingRequests = await db.matchRequest.findMany({
      where: {
        to_user_id: user_id,
        status: MatchStatus.accepted 
      },
      include: {
        to_user: {
          select: {
            user_id: true,
            name: true,
            full_name: true,
            email: true,
          }
        },
        from_user: {            
          select: {
            user_id: true,
            name: true,
            full_name: true,
            email: true,
          }
        }
      }
    });

    return res.status(200).json({
      success: true,
      data: pendingRequests,
      message: "Pending incoming requests retrieved successfully"
    });

  } catch (error) {
    console.error("getIncomingPendingRequests error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const changeRequestStatusToAccepted = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user?.user_id;

  console.log('req.params:', req.params);
  console.log('req.user:', req.user);

  if (!id || !user_id) {
    return res.status(400).json({ success: false, message: "Request ID and User ID are required" });
  }

  try {
    const requestExists = await db.matchRequest.findFirst({
      where: {
        matchrequest_id: Number(id),
        to_user_id: user_id
      }
    });

    if (!requestExists) {
      return res.status(404).json({ success: false, message: "Request not found or access denied" });
    }

    const updatedRequest = await db.matchRequest.update({
      where: { matchrequest_id: Number(id) },
      data: {
        status: MatchStatus.accepted,
        updated_at: new Date()
      }
    });

    return res.status(200).json({
      success: true,
      data: updatedRequest,
      message: "Request status updated to accepted successfully"
    });

  } catch (error) {
    console.error("changeRequestStatusToAccepted error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export const changeRequestStatusToDecline = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user?.user_id;

  console.log('req.params:', req.params);
  console.log('req.user:', req.user);

  if (!id || !user_id) {
    return res.status(400).json({ success: false, message: "Request ID and User ID are required" });
  }

  try {
    const requestExists = await db.matchRequest.findFirst({
      where: {
        matchrequest_id: Number(id),
        to_user_id: user_id
      }
    });

    if (!requestExists) {
      return res.status(404).json({ success: false, message: "Request not found or access denied" });
    }

    const updatedRequest = await db.matchRequest.update({
      where: { matchrequest_id: Number(id) },
      data: {
        status: MatchStatus.declined,
        updated_at: new Date()
      }
    });

    return res.status(200).json({
      success: true,
      data: updatedRequest,
      message: "Request status updated to accepted successfully"
    });

  } catch (error) {
    console.error("changeRequestStatusToAccepted error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
