import { Router } from "express";
import { getUsers, updateLanguages, searchPartners } from "../controller/userController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/me", getUsers);
router.put("/me/languages", verifyJWT, updateLanguages);
router.get("/filter" , verifyJWT, searchPartners);

export default router;
