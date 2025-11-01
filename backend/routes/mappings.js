// routes/mappings.js
const express = require("express");
const router = express.Router();
const {
  createMapping,
  getMappings,
  getDoctorsForPatient,
  updateMapping,
  deleteMapping,
} = require("../controllers/mappingsController");

router.post("/", createMapping);
router.get("/", getMappings);
router.get("/:patient_id", getDoctorsForPatient);
router.put("/:id", updateMapping); // NEW
router.delete("/:id", deleteMapping);

module.exports = router;
