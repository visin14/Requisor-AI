import { Router } from "express";
import ai from "./ai";
import health from "./health";
import testDb from "./test-db";
import user from "./user";
import recruiter from "./recruiter";

const router = Router();

router.use("/ai", ai);
router.use("/health", health);
router.use("/test-db", testDb);
router.use("/user", user);
router.use("/recruiter", recruiter);

export default router;