import { Router } from "express";
import authRoutes from "./auth";
import emailRoutes from "./email";

const router = Router();

router.use("/auth", authRoutes);
router.use("/email", emailRoutes);

export default router;