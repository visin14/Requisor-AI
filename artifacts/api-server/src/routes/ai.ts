import { Router } from "express";
import OpenAI from "openai";
import { logger } from "../lib/logger";

const router = Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ── POST /api/ai/analyze-resume ─────────────────────────────────────────── */
router.post("/analyze-resume", async (req, res) => {
  try {
    const { resumeText } = req.body as { resumeText: string };
    if (!resumeText?.trim()) {
      res.status(400).json({ error: "resumeText is required" });
      return;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 2000,
      messages: [
        {
          role: "system",
          content: `You are an expert resume analyst. Analyze the resume and return a JSON object with exactly this structure:
{
  "overallScore": <number 0-100>,
  "name": "<candidate name or 'Unknown'>",
  "title": "<inferred job title>",
  "summary": "<2-3 sentence professional summary>",
  "scores": {
    "technicalFit": <number 0-100>,
    "experienceDepth": <number 0-100>,
    "impactMetrics": <number 0-100>,
    "communicationClarity": <number 0-100>
  },
  "skills": ["skill1", "skill2", ...],
  "experience": [{"company": "...", "role": "...", "duration": "..."}],
  "strengths": ["strength1", "strength2", "strength3"],
  "gaps": [{"severity": "critical|moderate|minor", "area": "...", "detail": "..."}],
  "roadmap": [{"step": 1, "action": "...", "detail": "...", "timeframe": "..."}],
  "aiGenerated": <boolean — true if resume appears AI-written>,
  "aiGeneratedReason": "<brief reason if aiGenerated is true, else null>"
}
Return ONLY the JSON, no markdown, no explanation.`,
        },
        {
          role: "user",
          content: `Analyze this resume:\n\n${resumeText}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    let data: unknown;
    try {
      data = JSON.parse(raw);
    } catch {
      logger.error({ raw }, "Failed to parse resume analysis JSON");
      res.status(500).json({ error: "AI returned invalid JSON" });
      return;
    }
    res.json(data);
  } catch (err) {
    logger.error(err, "analyze-resume error");
    res.status(500).json({ error: "Resume analysis failed" });
  }
});

/* ── POST /api/ai/analyze-jd ─────────────────────────────────────────────── */
router.post("/analyze-jd", async (req, res) => {
  try {
    const { jdText } = req.body as { jdText: string };
    if (!jdText?.trim()) {
      res.status(400).json({ error: "jdText is required" });
      return;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 1500,
      messages: [
        {
          role: "system",
          content: `You are a job description analyst. Return a JSON object with exactly this structure:
{
  "role": "<job title>",
  "seniority": "<Junior|Mid|Senior|Lead|Director>",
  "mustHaveSkills": ["skill1", "skill2", ...],
  "niceToHaveSkills": ["skill1", ...],
  "keyResponsibilities": ["resp1", "resp2", ...],
  "redFlags": ["anything unusual or concerning in the JD"],
  "salarySignals": "<inferred salary range or null>",
  "companyCulture": "<inferred culture traits>",
  "difficultyScore": <number 0-100, how hard to fill this role>,
  "summary": "<2 sentence summary of what this role really needs>"
}
Return ONLY the JSON.`,
        },
        {
          role: "user",
          content: `Analyze this job description:\n\n${jdText}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    let data: unknown;
    try {
      data = JSON.parse(raw);
    } catch {
      res.status(500).json({ error: "AI returned invalid JSON" });
      return;
    }
    res.json(data);
  } catch (err) {
    logger.error(err, "analyze-jd error");
    res.status(500).json({ error: "JD analysis failed" });
  }
});

/* ── POST /api/ai/match ──────────────────────────────────────────────────── */
router.post("/match", async (req, res) => {
  try {
    const { resumeText, jdText } = req.body as { resumeText: string; jdText: string };
    if (!resumeText?.trim() || !jdText?.trim()) {
      res.status(400).json({ error: "resumeText and jdText are required" });
      return;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 1500,
      messages: [
        {
          role: "system",
          content: `You are a semantic resume-to-job matcher. Return a JSON object with exactly this structure:
{
  "matchScore": <number 0-100>,
  "verdict": "<Strong Match|Good Match|Partial Match|Weak Match|No Match>",
  "matchedSkills": ["skill1", ...],
  "missingSkills": ["skill1", ...],
  "semanticInsights": "<2-3 sentences on semantic alignment beyond keyword matching>",
  "interviewFocus": ["question1", "question2", "question3"],
  "hiringRisk": "<Low|Medium|High>",
  "hiringRiskReason": "<brief explanation>"
}
Return ONLY the JSON.`,
        },
        {
          role: "user",
          content: `RESUME:\n${resumeText}\n\n---\n\nJOB DESCRIPTION:\n${jdText}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    let data: unknown;
    try {
      data = JSON.parse(raw);
    } catch {
      res.status(500).json({ error: "AI returned invalid JSON" });
      return;
    }
    res.json(data);
  } catch (err) {
    logger.error(err, "match error");
    res.status(500).json({ error: "Matching failed" });
  }
});

/* ── POST /api/ai/decision ───────────────────────────────────────────────── */
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

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 1500,
      messages: [
        {
          role: "system",
          content: `You are a senior hiring manager AI. Provide a comprehensive hiring decision analysis. Return JSON:
{
  "decision": "<Strongly Recommend|Recommend|Maybe|Do Not Recommend>",
  "confidence": <number 0-100>,
  "reasoning": "<3-4 sentence reasoning>",
  "pros": ["pro1", "pro2", "pro3"],
  "cons": ["con1", "con2"],
  "suggestedNextStep": "<Phone Screen|Technical Interview|Panel Interview|Offer|Reject>",
  "compensationBenchmark": "<suggested comp range based on role/experience>",
  "onboardingNeeds": ["area1", "area2"],
  "retentionRisk": "<Low|Medium|High>",
  "retentionRiskReason": "<brief reason>"
}
Return ONLY the JSON.`,
        },
        {
          role: "user",
          content: `RESUME:\n${resumeText}\n\n---\n\nJOB DESCRIPTION:\n${jdText}\n\n${matchScore != null ? `Match Score: ${matchScore}/100\n` : ""}${notes ? `Recruiter Notes: ${notes}` : ""}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    let data: unknown;
    try {
      data = JSON.parse(raw);
    } catch {
      res.status(500).json({ error: "AI returned invalid JSON" });
      return;
    }
    res.json(data);
  } catch (err) {
    logger.error(err, "decision error");
    res.status(500).json({ error: "Decision engine failed" });
  }
});

export default router;
