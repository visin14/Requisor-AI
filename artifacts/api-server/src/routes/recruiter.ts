import { Router } from "express";
import { getCurrentUser } from "../lib/currentUser";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/stats", async (req, res) => {
  try {
    const user = await getCurrentUser(req);

    const [jobDescriptions, resumes, analyses, interviews] =
      await Promise.all([
        prisma.jobDescription.count({ where: { userId: user.id } }),
        prisma.resume.count({ where: { userId: user.id } }),
        prisma.resumeAnalysis.count({
          where: {
            resume: {
              userId: user.id,
            },
          },
        }),
        prisma.interviewSession.count({ where: { userId: user.id } }),
      ]);

   res.json({
  jobDescriptions,
  candidates: resumes,
  matches: analyses,
  aiDecisions: interviews,
});
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Unauthorized" });
  }
});

router.post("/save-match", async (req, res) => {
  try {
    const user = await getCurrentUser(req);

    const { resumeText, jdText, result } = req.body;

    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        title: "Candidate Resume",
        parsedText: resumeText,
      },
    });

    const jobDescription = await prisma.jobDescription.create({
      data: {
        userId: user.id,
        jobTitle: "Job Description",
        description: jdText,
      },
    });

    const analysis = await prisma.resumeAnalysis.create({
      data: {
        resumeId: resume.id,
        jobDescriptionId: jobDescription.id,
        atsScore: result.matchScore ?? 0,
        strengths: result.matchedSkills ?? [],
        weaknesses: result.missingSkills ?? [],
        missingSkills: result.missingSkills ?? [],
        suggestions: result.interviewFocus ?? [],
        summary: result.semanticInsights ?? "",
      },
    });

    res.json({ success: true, resume, jobDescription, analysis });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save match" });
  }
});

router.post("/save-decision", async (req, res) => {
  try {
    const user = await getCurrentUser(req);

    const { jdText, result } = req.body;

    const jobDescription = await prisma.jobDescription.create({
      data: {
        userId: user.id,
        jobTitle: "Hiring Decision JD",
        description: jdText,
      },
    });

    const interview = await prisma.interviewSession.create({
      data: {
        userId: user.id,
        jobDescriptionId: jobDescription.id,
        overallScore: result.confidence ?? 0,
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    res.json({ success: true, interview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save decision" });
  }
});

export default router;
