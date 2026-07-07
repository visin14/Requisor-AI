import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (_, res) => {
  try {
    const users = await prisma.user.findMany();

    res.json({
      success: true,
      totalUsers: users.length,
      users,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

export default router;