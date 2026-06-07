/**
 * ════════════════════════════════════════════════════════════════════
 * Profile Routes — CRUD operations for customer profiles
 * ════════════════════════════════════════════════════════════════════
 * GET /api/profiles         — List all with optional filters
 * GET /api/profiles/:id     — Get single profile by ID
 * PATCH /api/profiles/:id   — Update profile notes/status
 */

const express = require("express");
const profiles = require("../data/profiles");
const router = express.Router();

/**
 * GET /api/profiles
 * Query params: gender, status, city, search, page, limit
 */
router.get("/", (req, res) => {
  let result = [...profiles];
  const { gender, status, city, search, page = 1, limit = 20 } = req.query;

  // Filter by gender
  if (gender) {
    result = result.filter((p) => p.gender.toLowerCase() === gender.toLowerCase());
  }

  // Filter by status
  if (status) {
    result = result.filter((p) => p.status.toLowerCase() === status.toLowerCase());
  }

  // Filter by city
  if (city) {
    result = result.filter((p) => p.city.toLowerCase().includes(city.toLowerCase()));
  }

  // Search by name
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q)
    );
  }

  // Calculate totals before pagination
  const total = result.length;

  // Paginate
  const startIndex = (parseInt(page) - 1) * parseInt(limit);
  const paginatedResults = result.slice(startIndex, startIndex + parseInt(limit));

  res.json({
    profiles: paginatedResults,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / parseInt(limit)),
  });
});

/**
 * GET /api/profiles/stats
 * Returns dashboard statistics
 */
router.get("/stats", (req, res) => {
  const stats = {
    total: profiles.length,
    newLeads: profiles.filter((p) => p.status === "New Lead").length,
    inProgress: profiles.filter((p) => p.status === "In Progress").length,
    matchSent: profiles.filter((p) => p.status === "Match Sent").length,
    paused: profiles.filter((p) => p.status === "Paused").length,
    closed: profiles.filter((p) => p.status === "Closed").length,
    male: profiles.filter((p) => p.gender === "Male").length,
    female: profiles.filter((p) => p.gender === "Female").length,
  };
  res.json(stats);
});

/**
 * GET /api/profiles/:id
 * Returns single profile with full biodata
 */
router.get("/:id", (req, res) => {
  const profile = profiles.find((p) => p.id === req.params.id);
  if (!profile) {
    return res.status(404).json({ error: "Profile not found" });
  }
  res.json(profile);
});

/**
 * PATCH /api/profiles/:id
 * Update notes or status
 */
router.patch("/:id", (req, res) => {
  const profile = profiles.find((p) => p.id === req.params.id);
  if (!profile) {
    return res.status(404).json({ error: "Profile not found" });
  }

  const { notes, status } = req.body;
  if (notes !== undefined) profile.notes = notes;
  if (status !== undefined) profile.status = status;

  res.json(profile);
});

module.exports = router;
