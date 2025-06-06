import { Router } from "express";
import { postRequest } from "../controller/requestsController.js";

const router = Router();

router.post("/requests", postRequest);

export default router;
