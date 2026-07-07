import type { Request } from "express";
import { getAuth } from "@clerk/express";
import { prisma } from "./prisma";

export async function getCurrentUser(req: Request) {
  const { userId } = getAuth(req);

  if (!userId) {
    throw new Error("Unauthorized");
  }

  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: `${userId}@clerk.local`,
        name: "Recruiter",
      },
    });
  }

  return user;
}