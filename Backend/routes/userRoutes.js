import { Router } from "express";
import { getUsers } from "../controller/userController.js";

const router = Router();

router.get("/me", getUsers);

export default router;
