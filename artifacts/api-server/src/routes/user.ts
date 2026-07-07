import { Router } from "express";
import { getAuth } from "@clerk/express";
import { prisma } from "../lib/prisma";

const router = Router();

router.post("/sync", async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { email, name, image } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: { email, name, image },
      create: { clerkId: userId, email, name, image },
    });

    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "User sync failed" });
  }
});

export default router;
