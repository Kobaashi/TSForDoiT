import { Router } from "express";
import { 
  getAllRequestsPendingToUser, 
  getAllRequestsPendingFromUser,
  postPendingRequest,  
} from "../controller/requestsController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/requests/pending", postPendingRequest);
router.get("/requests/incoming", authenticate, getAllRequestsPendingToUser);
router.get("/requests/outcoming", authenticate, getAllRequestsPendingFromUser);

export default router;
