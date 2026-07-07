import "dotenv/config";
import { Router } from "express";
import Groq from "groq-sdk";
import { logger } from "../lib/logger";

const router = Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function runGroq(messages: any[], max_tokens = 1500) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens,
    temperature: 0.2,
    messages,
  });

  let raw = completion.choices[0]?.message?.content ?? "{}";

raw = raw
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

return JSON.parse(raw);
}

/* POST /api/ai/analyze-resume */
router.post("/analyze-resume", async (req, res) => {
  try {
    const { resumeText } = req.body as { resumeText: string };

    if (!resumeText?.trim()) {
      res.status(400).json({ error: "resumeText is required" });
      return;
    }

    const data = await runGroq([
      {
        role: "system",
        content: `You are an expert resume analyst. Return ONLY valid JSON with this structure:
{
  "overallScore": 0,
  "name": "Unknown",
  "title": "",
  "summary": "",
  "scores": {
    "technicalFit": 0,
    "experienceDepth": 0,
    "impactMetrics": 0,
    "communicationClarity": 0
  },
  "skills": [],
  "experience": [{"company": "", "role": "", "duration": ""}],
  "strengths": [],
  "gaps": [{"severity": "critical|moderate|minor", "area": "", "detail": ""}],
  "roadmap": [{"step": 1, "action": "", "detail": "", "timeframe": ""}],
  "aiGenerated": false,
  "aiGeneratedReason": null
}`,
      },
      {
        role: "user",
        content: `Analyze this resume:\n\n${resumeText}`,
      },
    ], 2000);

    res.json(data);
  } catch (err) {
    logger.error(err, "analyze-resume error");
    res.status(500).json({ error: "Resume analysis failed" });
  }
});

/* POST /api/ai/analyze-jd */
router.post("/analyze-jd", async (req, res) => {
  try {
    const { jdText } = req.body as { jdText: string };

    if (!jdText?.trim()) {
      res.status(400).json({ error: "jdText is required" });
      return;
    }

    const data = await runGroq([
      {
        role: "system",
        content: `You are a job description analyst. Return ONLY valid JSON:
{
  "role": "",
  "seniority": "Junior|Mid|Senior|Lead|Director",
  "mustHaveSkills": [],
  "niceToHaveSkills": [],
  "keyResponsibilities": [],
  "redFlags": [],
  "salarySignals": null,
  "companyCulture": "",
  "difficultyScore": 0,
  "summary": ""
}`,
      },
      {
        role: "user",
        content: `Analyze this job description:\n\n${jdText}`,
      },
    ]);

    res.json(data);
  } catch (err) {
    logger.error(err, "analyze-jd error");
    res.status(500).json({ error: "JD analysis failed" });
  }
});

/* POST /api/ai/match */
router.post("/match", async (req, res) => {
  try {
    const { resumeText, jdText } = req.body as {
      resumeText: string;
      jdText: string;
    };

    if (!resumeText?.trim() || !jdText?.trim()) {
      res.status(400).json({ error: "resumeText and jdText are required" });
      return;
    }

    const data = await runGroq([
      {
        role: "system",
        content: `You are a semantic resume-to-job matcher. Return ONLY valid JSON:
{
  "matchScore": 0,
  "verdict": "Strong Match|Good Match|Partial Match|Weak Match|No Match",
  "matchedSkills": [],
  "missingSkills": [],
  "semanticInsights": "",
  "interviewFocus": [],
  "hiringRisk": "Low|Medium|High",
  "hiringRiskReason": ""
}`,
      },
      {
        role: "user",
        content: `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jdText}`,
      },
    ]);

    res.json(data);
  } catch (err) {
    logger.error(err, "match error");
    res.status(500).json({ error: "Matching failed" });
  }
});

/* POST /api/ai/decision */
router.post("/decision", async (req, res) => {
  try {
    const { resumeText, jdText, matchScore, notes } = req.body as {
      resumeText: string;
      jdText: string;
      matchScore?: number;
      notes?: string;
    };

    if (!resumeText?.trim() || !jdText?.trim()) {
      res.status(400).json({ error: "resumeText and jdText are required" });
      return;
    }

    const data = await runGroq([
      {
        role: "system",
        content: `You are a senior hiring manager AI. Return ONLY valid JSON:
{
  "decision": "Strongly Recommend|Recommend|Maybe|Do Not Recommend",
  "confidence": 0,
  "reasoning": "",
  "pros": [],
  "cons": [],
  "suggestedNextStep": "Phone Screen|Technical Interview|Panel Interview|Offer|Reject",
  "compensationBenchmark": "",
  "onboardingNeeds": [],
  "retentionRisk": "Low|Medium|High",
  "retentionRiskReason": ""
}`,
      },
      {
        role: "user",
        content: `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jdText}\n\n${
          matchScore != null ? `Match Score: ${matchScore}/100\n` : ""
        }${notes ? `Recruiter Notes: ${notes}` : ""}`,
      },
    ]);

    res.json(data);
  } catch (err) {
    logger.error(err, "decision error");
    res.status(500).json({ error: "Decision engine failed" });
  }
});

export default router;