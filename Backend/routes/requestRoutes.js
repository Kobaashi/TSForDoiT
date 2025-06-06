import { Router } from "express";
import { getAllRequestsByUserId, postRequest } from "../controller/requestsController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/requests", postRequest);
router.get("/requests/incoming", authenticate, getAllRequestsByUserId);

export default router;
