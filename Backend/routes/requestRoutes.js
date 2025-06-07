import { Router } from "express";
import { 
  getAllRequestsPendingToUser, 
  getAllRequestsPendingFromUser,
  getAllAcceptedRequestsByUserId,
  changeRequestStatusToDecline,
  getAllDeclinedRequestsByUserId,
  postPendingRequest,
  changeRequestStatusToAccepted,  
} from "../controller/requestsController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/requests/pending", postPendingRequest);
router.put("/requests/:id/accept", authenticate, changeRequestStatusToAccepted);
router.put("/requests/:id/decline", authenticate, changeRequestStatusToDecline);
router.get("/requests/incoming", authenticate, getAllRequestsPendingToUser);
router.get("/requests/outcoming", authenticate, getAllRequestsPendingFromUser);
router.get("/requests/accept", authenticate, getAllAcceptedRequestsByUserId);
router.get("/requests/decline", authenticate, getAllDeclinedRequestsByUserId);

export default router;
