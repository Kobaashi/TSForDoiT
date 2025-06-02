import { Router } from "express";
import { getUsers, updateLanguages } from "../controller/userController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/me", getUsers);
router.put("/me/languages", verifyJWT, updateLanguages);

export default router;
