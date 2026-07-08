import { Router } from "express";
import { getCurrentUser } from "../lib/currentUser";
import { prisma } from "../lib/prisma";

const router = Router();

/* GET /api/candidate/stats */
router.get("/stats", async (req, res) => {
  let user;
  try {
    user = await getCurrentUser(req);
  } catch {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const analyses = await prisma.resumeAnalysis.findMany({
      where: { resume: { userId: user.id } },
      orderBy: { createdAt: "desc" },
      select: { atsScore: true, createdAt: true },
    });

    const totalAnalyses = analyses.length;
    const avgScore =
      totalAnalyses > 0
        ? Math.round(
            analyses.reduce((sum, a) => sum + (a.atsScore ?? 0), 0) /
              totalAnalyses,
          )
        : 0;
    const lastAnalysisDate = analyses[0]?.createdAt ?? null;

    res.json({ totalAnalyses, avgScore, lastAnalysisDate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* GET /api/candidate/analyses */
router.get("/analyses", async (req, res) => {
  let user;
  try {
    user = await getCurrentUser(req);
  } catch {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 50);

    const analyses = await prisma.resumeAnalysis.findMany({
      where: { resume: { userId: user.id } },
      include: { resume: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    res.json(
      analyses.map((a) => ({
        id: a.id,
        resumeTitle: a.resume.title,
        overallScore: a.atsScore ?? 0,
        createdAt: a.createdAt,
        summary: a.summary ?? null,
      })),
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* POST /api/candidate/save-analysis */
router.post("/save-analysis", async (req, res) => {
  let user;
  try {
    user = await getCurrentUser(req);
  } catch {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const { resumeTitle, analysis } = req.body as {
      resumeTitle?: string;
      analysis?: {
        name?: string;
        overallScore?: number;
        strengths?: string[];
        gaps?: { area: string }[];
        roadmap?: { action: string }[];
        scores?: Record<string, number>;
      };
    };

    if (!analysis || typeof analysis !== "object") {
      res.status(400).json({ error: "analysis object is required" });
      return;
    }

    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        title: resumeTitle || analysis.name || "Resume",
        parsedText: "",
      },
    });

    const saved = await prisma.resumeAnalysis.create({
      data: {
        resumeId: resume.id,
        atsScore: analysis.overallScore ?? 0,
        strengths: analysis.strengths ?? [],
        weaknesses: analysis.gaps?.map((g) => g.area) ?? [],
        missingSkills: [],
        suggestions: analysis.roadmap?.map((r) => r.action) ?? [],
        summary: JSON.stringify(analysis),
      },
    });

    res.json({ success: true, analysisId: saved.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save analysis" });
  }
});

export default router;
