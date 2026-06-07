/**
 * ════════════════════════════════════════════════════════════════════
 * Match Routes — Gender-specific matching algorithms
 * ════════════════════════════════════════════════════════════════════
 * 
 * FOR MALE CUSTOMERS:
 *   Match with women who are younger, shorter, earn less, and
 *   have matching views on children (from TDC PDF requirements).
 *
 * FOR FEMALE CUSTOMERS:
 *   Match based on compatibility in profession, values,
 *   relocation preferences, and family alignment.
 *
 * Each match includes a compatibility score (0-100) calculated
 * from weighted criteria.
 */

const express = require("express");
const profiles = require("../data/profiles");
const router = express.Router();

/**
 * GET /api/matches/:id
 * Returns matched profiles for a given customer ID
 * Automatically detects gender and applies correct algorithm
 */
router.get("/:id", (req, res) => {
  const customer = profiles.find((p) => p.id === req.params.id);
  if (!customer) {
    return res.status(404).json({ error: "Profile not found" });
  }

  let matches;
  if (customer.gender === "Male") {
    matches = findMatchesForMale(customer);
  } else {
    matches = findMatchesForFemale(customer);
  }

  // Sort by compatibility score (highest first)
  matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  // Return top 10 matches
  res.json({
    customer: { id: customer.id, name: `${customer.firstName} ${customer.lastName}` },
    matches: matches.slice(0, 10),
    totalPotential: matches.length,
  });
});

/**
 * POST /api/matches/send
 * Simulates sending a match introduction
 */
router.post("/send", (req, res) => {
  const { customerId, matchId } = req.body;

  const customer = profiles.find((p) => p.id === customerId);
  const match = profiles.find((p) => p.id === matchId);

  if (!customer || !match) {
    return res.status(404).json({ error: "Profile(s) not found" });
  }

  // Update status to "Match Sent"
  customer.status = "Match Sent";

  res.json({
    success: true,
    message: `Match introduction sent between ${customer.firstName} and ${match.firstName}`,
    customer: { id: customer.id, name: `${customer.firstName} ${customer.lastName}` },
    match: { id: match.id, name: `${match.firstName} ${match.lastName}` },
    sentAt: new Date().toISOString(),
  });
});

// ════════════════════════════════════════════════════════════════════
// MATCHING ALGORITHMS
// ════════════════════════════════════════════════════════════════════

/**
 * Male → Female matching algorithm
 * Criteria: younger, shorter, earns less, matching kids views
 * Each criterion has a weight that contributes to the score.
 */
function findMatchesForMale(male) {
  const females = profiles.filter((p) => p.gender === "Female");

  return females
    .map((female) => {
      let score = 0;
      let reasons = [];

      // 1. Age: Female must be younger (weight: 20)
      if (female.age < male.age) {
        const ageDiff = male.age - female.age;
        if (ageDiff >= 1 && ageDiff <= 5) {
          score += 20;
          reasons.push("Ideal age difference");
        } else if (ageDiff > 5 && ageDiff <= 8) {
          score += 12;
          reasons.push("Acceptable age gap");
        } else {
          score += 5;
        }
      }

      // 2. Height: Female must be shorter (weight: 15)
      if (female.heightCm < male.heightCm) {
        const heightDiff = male.heightCm - female.heightCm;
        if (heightDiff >= 5 && heightDiff <= 20) {
          score += 15;
          reasons.push("Complementary height");
        } else {
          score += 8;
        }
      }

      // 3. Income: Female earns less (weight: 10)
      if (female.incomeNumeric < male.incomeNumeric) {
        score += 10;
        reasons.push("Financial compatibility");
      } else if (female.incomeNumeric === male.incomeNumeric) {
        score += 5;
      }

      // 4. Kids preference: Must match (weight: 20)
      if (female.wantKids === male.wantKids) {
        score += 20;
        reasons.push("Aligned on children");
      } else if (female.wantKids === "Maybe" || male.wantKids === "Maybe") {
        score += 10;
        reasons.push("Open about children");
      }

      // 5. Religion match (weight: 15)
      if (female.religion === male.religion) {
        score += 15;
        reasons.push("Same faith");
      }

      // 6. City proximity (weight: 10)
      if (female.city === male.city) {
        score += 10;
        reasons.push("Same city");
      } else if (female.openToRelocate === "Yes") {
        score += 5;
        reasons.push("Open to relocate");
      }

      // 7. Diet compatibility (weight: 5)
      if (female.dietaryPreference === male.dietaryPreference) {
        score += 5;
        reasons.push("Compatible diet");
      }

      // 8. Family values (weight: 5)
      if (female.familyValues === male.familyValues) {
        score += 5;
        reasons.push("Matching family values");
      }

      return {
        ...female,
        compatibilityScore: Math.min(score, 100),
        matchReasons: reasons,
      };
    })
    .filter((m) => m.compatibilityScore >= 25); // Minimum threshold
}

/**
 * Female → Male matching algorithm
 * Criteria: profession compatibility, values alignment,
 * relocation preferences, and holistic compatibility.
 */
function findMatchesForFemale(female) {
  const males = profiles.filter((p) => p.gender === "Male");

  // Profession categories for compatibility matching
  const professionCategories = {
    tech: ["Software Engineer", "Data Scientist", "VP Engineering", "Team Lead", "UX Designer"],
    finance: ["Investment Banker", "Senior Analyst", "Chartered Accountant", "Business Analyst"],
    consulting: ["Consultant", "Product Manager", "Management Trainee", "Associate Director"],
    medical: ["Doctor"],
    creative: ["Architect", "UX Designer"],
    legal: ["Lawyer"],
    business: ["Founder", "Operations Manager", "Marketing Manager"],
  };

  function getProfCategory(designation) {
    for (const [cat, roles] of Object.entries(professionCategories)) {
      if (roles.includes(designation)) return cat;
    }
    return "other";
  }

  const femaleProf = getProfCategory(female.designation);

  return males
    .map((male) => {
      let score = 0;
      let reasons = [];

      // 1. Profession compatibility (weight: 20)
      const maleProf = getProfCategory(male.designation);
      if (maleProf === femaleProf) {
        score += 20;
        reasons.push("Professional synergy");
      } else if (
        (femaleProf === "tech" && maleProf === "consulting") ||
        (femaleProf === "finance" && maleProf === "consulting") ||
        (femaleProf === "medical" && maleProf === "medical")
      ) {
        score += 12;
        reasons.push("Complementary careers");
      } else {
        score += 5;
      }

      // 2. Family values alignment (weight: 20)
      if (male.familyValues === female.familyValues) {
        score += 20;
        reasons.push("Shared family values");
      } else if (
        (male.familyValues === "Moderate" && female.familyValues !== "Traditional") ||
        (female.familyValues === "Moderate" && male.familyValues !== "Traditional")
      ) {
        score += 10;
        reasons.push("Compatible outlook");
      }

      // 3. Relocation preferences (weight: 15)
      if (male.city === female.city) {
        score += 15;
        reasons.push("Same city");
      } else if (male.openToRelocate === "Yes" || female.openToRelocate === "Yes") {
        score += 10;
        reasons.push("Flexible on location");
      } else if (male.openToRelocate === "Maybe" || female.openToRelocate === "Maybe") {
        score += 5;
      }

      // 4. Age: Male should be same age or older (weight: 10)
      if (male.age >= female.age) {
        const ageDiff = male.age - female.age;
        if (ageDiff <= 5) {
          score += 10;
          reasons.push("Compatible age");
        } else {
          score += 5;
        }
      }

      // 5. Religion match (weight: 15)
      if (male.religion === female.religion) {
        score += 15;
        reasons.push("Same faith");
      }

      // 6. Kids preference alignment (weight: 10)
      if (male.wantKids === female.wantKids) {
        score += 10;
        reasons.push("Aligned on children");
      } else if (male.wantKids === "Maybe" || female.wantKids === "Maybe") {
        score += 5;
      }

      // 7. Diet compatibility (weight: 5)
      if (male.dietaryPreference === female.dietaryPreference) {
        score += 5;
        reasons.push("Diet compatible");
      }

      // 8. Pets preference (weight: 5)
      if (male.openToPets === female.openToPets) {
        score += 5;
        reasons.push("Pet compatibility");
      }

      return {
        ...male,
        compatibilityScore: Math.min(score, 100),
        matchReasons: reasons,
      };
    })
    .filter((m) => m.compatibilityScore >= 25);
}

module.exports = router;
