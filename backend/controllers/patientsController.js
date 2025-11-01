// controllers/patientsController.js
const db = require("../db");

const createPatient = async (req, res) => {
  try {
    const { name, age, disease } = req.body;
    if (!name) return res.status(400).json({ message: "Name required" });

    const result = await db.query(
      `INSERT INTO patients (name, age, disease, created_by) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, age || null, disease || null, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("createPatient", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getPatients = async (req, res) => {
  try {
    // only patients created by authenticated user
    const result = await db.query(
      `SELECT * FROM patients WHERE created_by = $1 ORDER BY id DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("getPatients", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT * FROM patients WHERE id = $1 AND created_by = $2`,
      [id, req.user.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Patient not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("getPatientById", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, disease } = req.body;

    // check ownership
    const owned = await db.query(
      "SELECT id FROM patients WHERE id = $1 AND created_by = $2",
      [id, req.user.id]
    );
    if (owned.rows.length === 0)
      return res.status(404).json({ message: "Patient not found" });

    const result = await db.query(
      `UPDATE patients SET name = COALESCE($1, name), age = COALESCE($2, age), disease = COALESCE($3, disease) WHERE id = $4 RETURNING *`,
      [name, age, disease, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("updatePatient", err);
    res.status(500).json({ message: "Server error" });
  }
};

const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    // check ownership
    const owned = await db.query(
      "SELECT id FROM patients WHERE id = $1 AND created_by = $2",
      [id, req.user.id]
    );
    if (owned.rows.length === 0)
      return res.status(404).json({ message: "Patient not found" });

    await db.query("DELETE FROM mappings WHERE patient_id = $1", [id]); // cleanup related mappings
    await db.query("DELETE FROM patients WHERE id = $1", [id]);
    res.json({ message: "Patient deleted" });
  } catch (err) {
    console.error("deletePatient", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};
