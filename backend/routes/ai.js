/**
 * ════════════════════════════════════════════════════════════════════
 * AI Routes — Google Gemini-powered match scoring & explanations
 * ════════════════════════════════════════════════════════════════════
 * Uses Gemini AI for:
 *   1. Match scoring with natural language explanations
 *   2. Personalized email intro generation
 *   3. LLM-based profile fit reasoning
 *
 * Falls back to deterministic scoring if API key is missing.
 */

const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const profiles = require("../data/profiles");
const router = express.Router();

// Initialize Gemini (may be null if no key)
let genAI = null;
let model = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your-gemini-api-key-here") {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite-preview-02-05" });
  console.log("  ✅ Gemini AI model initialized");
}

// ════════════════════════════════════════════════════════════════════
// 1. POST /api/ai/match-score — AI-powered match compatibility
// ════════════════════════════════════════════════════════════════════
router.post("/match-score", async (req, res) => {
  const { profileId, matchId } = req.body;
  const profile = profiles.find((p) => p.id === profileId);
  const match = profiles.find((p) => p.id === matchId);

  if (!profile || !match) {
    return res.status(404).json({ error: "Profile(s) not found" });
  }

  try {
    if (model) {
      // ─── Real Gemini API call ───
      const result = await callGeminiMatchScore(profile, match);
      return res.json(result);
    }
  } catch (err) {
    console.error("Gemini API error, falling back:", err.message);
  }

  // ─── Fallback: deterministic scoring ───
  const result = generateFallbackAnalysis(profile, match);
  res.json(result);
});

// ════════════════════════════════════════════════════════════════════
// 2. POST /api/ai/generate-intro — Personalized intro email
// ════════════════════════════════════════════════════════════════════
router.post("/generate-intro", async (req, res) => {
  const { profileId, matchId } = req.body;
  const profile = profiles.find((p) => p.id === profileId);
  const match = profiles.find((p) => p.id === matchId);

  if (!profile || !match) {
    return res.status(404).json({ error: "Profile(s) not found" });
  }

  try {
    if (model) {
      const prompt = `You are a professional Indian matchmaker at The Date Crew, a premium matchmaking service.
Write a warm, personalized introduction email (3-4 sentences) to introduce ${match.firstName} ${match.lastName} to ${profile.firstName} ${profile.lastName}.

${profile.firstName}'s profile:
- Age: ${profile.age}, Gender: ${profile.gender}, City: ${profile.city}
- Profession: ${profile.designation} at ${profile.company}
- Religion: ${profile.religion}, Family Values: ${profile.familyValues}
- Interests from bio: ${profile.bio}

${match.firstName}'s profile:
- Age: ${match.age}, Gender: ${match.gender}, City: ${match.city}
- Profession: ${match.designation} at ${match.company}
- Religion: ${match.religion}, Family Values: ${match.familyValues}
- Interests from bio: ${match.bio}

Write ONLY the email body text. Be warm, professional, and highlight 1-2 specific compatibility points. Do not include subject line or sign-off.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return res.json({ intro: text.trim(), poweredBy: "Gemini AI" });
    }
  } catch (err) {
    console.error("Gemini intro error, falling back:", err.message);
  }

  // Fallback intro
  const intro = `Hi ${profile.firstName}, I'd love to introduce you to ${match.firstName} — a ${match.age}-year-old ${match.designation} based in ${match.city}. ${match.firstName} shares your ${match.familyValues === profile.familyValues ? "family values" : "enthusiasm for meaningful connections"} and I think you'd have a wonderful conversation over coffee.`;
  res.json({ intro, poweredBy: "Fallback" });
});

// ════════════════════════════════════════════════════════════════════
// 3. POST /api/ai/profile-fit — LLM-based reasoning for profile fit
// ════════════════════════════════════════════════════════════════════
router.post("/profile-fit", async (req, res) => {
  const { profileId, matchId } = req.body;
  const profile = profiles.find((p) => p.id === profileId);
  const match = profiles.find((p) => p.id === matchId);

  if (!profile || !match) {
    return res.status(404).json({ error: "Profile(s) not found" });
  }

  try {
    if (model) {
      const prompt = `You are an expert Indian matchmaker analyzing profile compatibility. Give a brief, structured analysis (5-6 bullet points) of why these two profiles are or aren't compatible.

Profile 1 — ${profile.firstName} ${profile.lastName}:
Age: ${profile.age}, Gender: ${profile.gender}, City: ${profile.city}
Religion: ${profile.religion}, Caste: ${profile.caste}, Family: ${profile.familyType}
Profession: ${profile.designation} at ${profile.company}, Income: ${profile.income}
Education: ${profile.degree} from ${profile.college}
Diet: ${profile.dietaryPreference}, Family Values: ${profile.familyValues}
Want Kids: ${profile.wantKids}, Relocate: ${profile.openToRelocate}, Pets: ${profile.openToPets}

Profile 2 — ${match.firstName} ${match.lastName}:
Age: ${match.age}, Gender: ${match.gender}, City: ${match.city}
Religion: ${match.religion}, Caste: ${match.caste}, Family: ${match.familyType}
Profession: ${match.designation} at ${match.company}, Income: ${match.income}
Education: ${match.degree} from ${match.college}
Diet: ${match.dietaryPreference}, Family Values: ${match.familyValues}
Want Kids: ${match.wantKids}, Relocate: ${match.openToRelocate}, Pets: ${match.openToPets}

Respond in JSON format:
{
  "overallFit": "Strong Fit" | "Good Fit" | "Moderate Fit" | "Weak Fit",
  "reasoning": ["bullet point 1", "bullet point 2", ...],
  "recommendation": "one sentence recommendation for the matchmaker"
}`;

      const result = await model.generateContent(prompt);
      let text = result.response.text().trim();
      // Strip markdown code fences if present
      text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(text);
      return res.json({ ...parsed, poweredBy: "Gemini AI" });
    }
  } catch (err) {
    console.error("Gemini profile-fit error, falling back:", err.message);
  }

  // Fallback
  res.json({
    overallFit: "Good Fit",
    reasoning: [
      `Both are professionals in their respective fields`,
      `${profile.religion === match.religion ? "Same religious background provides cultural alignment" : "Different religious backgrounds — discuss openness"}`,
      `${profile.city === match.city ? "Same city makes dating logistics easy" : "Different cities — check relocation preferences"}`,
      `${profile.wantKids === match.wantKids ? "Aligned on family planning" : "Different views on children — important conversation topic"}`,
      `${profile.familyValues === match.familyValues ? "Matching family values" : "Different family value orientations"}`,
    ],
    recommendation: `This pairing has potential and deserves an introduction. Focus on their shared ${profile.religion === match.religion ? "cultural" : "professional"} background.`,
    poweredBy: "Fallback",
  });
});

// ════════════════════════════════════════════════════════════════════
// GEMINI API HELPER
// ════════════════════════════════════════════════════════════════════

async function callGeminiMatchScore(profile1, profile2) {
  const prompt = `You are a professional Indian matchmaker at The Date Crew analyzing two profiles for compatibility.

Profile 1 — ${profile1.firstName} ${profile1.lastName}:
Age: ${profile1.age}, Gender: ${profile1.gender}, City: ${profile1.city}, Height: ${profile1.height}
Religion: ${profile1.religion}, Caste: ${profile1.caste}, Family Type: ${profile1.familyType}
Profession: ${profile1.designation} at ${profile1.company}, Income: ${profile1.income}
Education: ${profile1.degree} from ${profile1.college}
Diet: ${profile1.dietaryPreference}, Family Values: ${profile1.familyValues}
Want Kids: ${profile1.wantKids}, Open to Relocate: ${profile1.openToRelocate}, Pets: ${profile1.openToPets}
Marital Status: ${profile1.maritalStatus}, Mother Tongue: ${profile1.motherTongue}
Bio: ${profile1.bio}

Profile 2 — ${profile2.firstName} ${profile2.lastName}:
Age: ${profile2.age}, Gender: ${profile2.gender}, City: ${profile2.city}, Height: ${profile2.height}
Religion: ${profile2.religion}, Caste: ${profile2.caste}, Family Type: ${profile2.familyType}
Profession: ${profile2.designation} at ${profile2.company}, Income: ${profile2.income}
Education: ${profile2.degree} from ${profile2.college}
Diet: ${profile2.dietaryPreference}, Family Values: ${profile2.familyValues}
Want Kids: ${profile2.wantKids}, Open to Relocate: ${profile2.openToRelocate}, Pets: ${profile2.openToPets}
Marital Status: ${profile2.maritalStatus}, Mother Tongue: ${profile2.motherTongue}
Bio: ${profile2.bio}

Analyze their compatibility for an Indian matchmaking context. Consider religion, family values, age gap, location, career compatibility, lifestyle, and family planning alignment.

Respond in strict JSON format (no markdown):
{
  "score": <number 0-100>,
  "matchLabel": "<one of: Exceptional Match, High Potential, Worth Exploring, Possible Fit>",
  "explanation": "<2-3 sentence natural language explanation>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "considerations": ["<consideration 1>", "<consideration 2>"],
  "introSnippet": "<3-4 sentence personalized intro email the matchmaker can send>"
}`;

  const result = await model.generateContent(prompt);
  let text = result.response.text().trim();
  // Strip markdown code fences if present
  text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const parsed = JSON.parse(text);

  return {
    score: Math.min(Math.max(parsed.score || 50, 20), 98),
    matchLabel: parsed.matchLabel || "Worth Exploring",
    explanation: parsed.explanation || "These two profiles show interesting compatibility.",
    strengths: parsed.strengths || [],
    considerations: parsed.considerations || [],
    introSnippet: parsed.introSnippet || "",
    profiles: {
      profile1: { id: profile1.id, name: `${profile1.firstName} ${profile1.lastName}` },
      profile2: { id: profile2.id, name: `${profile2.firstName} ${profile2.lastName}` },
    },
    poweredBy: "Gemini AI",
  };
}

// ════════════════════════════════════════════════════════════════════
// FALLBACK SCORING (when Gemini is not available)
// ════════════════════════════════════════════════════════════════════

function generateFallbackAnalysis(profile1, profile2) {
  const male = profile1.gender === "Male" ? profile1 : profile2;
  const female = profile1.gender === "Male" ? profile2 : profile1;

  let score = 50;
  const strengths = [];
  const considerations = [];

  if (male.religion === female.religion) {
    score += 12;
    strengths.push("Shared religious and cultural background");
  } else {
    considerations.push("Different religious backgrounds may need open conversation");
  }

  if (male.familyValues === female.familyValues) {
    score += 8;
    strengths.push(`Both hold ${male.familyValues.toLowerCase()} family values`);
  }

  const ageDiff = male.age - female.age;
  if (ageDiff >= 1 && ageDiff <= 5) {
    score += 7;
    strengths.push("Comfortable age compatibility");
  } else if (ageDiff > 5) {
    score += 3;
    considerations.push("Noticeable age difference to consider");
  }

  if (male.city === female.city) {
    score += 8;
    strengths.push(`Both based in ${male.city} — easy to build connection`);
  } else if (male.openToRelocate === "Yes" || female.openToRelocate === "Yes") {
    score += 4;
    strengths.push("At least one partner is open to relocation");
  }

  if (male.wantKids === female.wantKids) {
    score += 10;
    if (male.wantKids === "Yes") strengths.push("Both excited about starting a family");
    else if (male.wantKids === "No") strengths.push("Aligned on being child-free");
  } else {
    considerations.push("May want to discuss family planning expectations early");
  }

  if (male.dietaryPreference === female.dietaryPreference) {
    score += 3;
    strengths.push(`Shared ${male.dietaryPreference.toLowerCase()} lifestyle`);
  }

  if (male.openToPets === female.openToPets && male.openToPets === "Yes") {
    score += 2;
    strengths.push("Both are pet lovers");
  }

  score = Math.min(Math.max(score, 35), 98);

  const explanation = `${male.firstName} and ${female.firstName} show strong potential. ${strengths[0] || "They share compatible lifestyles"}, and ${strengths[1] || "their professional ambitions complement each other"}. With ${male.firstName}'s background as ${male.designation} at ${male.company} and ${female.firstName}'s role as ${female.designation}, they would bring a balanced dynamic to the relationship.`;

  const introSnippet = `Hi ${female.firstName}, I'd love to introduce you to ${male.firstName} — a ${male.age}-year-old ${male.designation} based in ${male.city}. ${male.firstName} shares your ${male.familyValues === female.familyValues ? "family values" : "enthusiasm for meaningful connections"} and I think you'd have a wonderful conversation over coffee.`;

  return {
    score,
    explanation,
    strengths: strengths.slice(0, 4),
    considerations: considerations.slice(0, 2),
    introSnippet,
    matchLabel: score >= 85 ? "Exceptional Match" : score >= 70 ? "High Potential" : score >= 55 ? "Worth Exploring" : "Possible Fit",
    profiles: {
      profile1: { id: profile1.id, name: `${profile1.firstName} ${profile1.lastName}` },
      profile2: { id: profile2.id, name: `${profile2.firstName} ${profile2.lastName}` },
    },
    poweredBy: "Fallback",
  };
}

module.exports = router;
