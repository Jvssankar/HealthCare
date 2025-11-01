// controllers/mappingsController.js
const db = require("../db");

const createMapping = async (req, res) => {
  try {
    const { patient_id, doctor_id } = req.body;
    if (!patient_id || !doctor_id)
      return res
        .status(400)
        .json({ message: "patient_id and doctor_id required" });

    // check existence and ownership of patient
    const patientQ = await db.query(
      "SELECT id FROM patients WHERE id = $1 AND created_by = $2",
      [patient_id, req.user.id]
    );
    if (patientQ.rows.length === 0)
      return res
        .status(404)
        .json({ message: "Patient not found or not owned by you" });

    // check doctor existence
    const doctorQ = await db.query("SELECT id FROM doctors WHERE id = $1", [
      doctor_id,
    ]);
    if (doctorQ.rows.length === 0)
      return res.status(404).json({ message: "Doctor not found" });

    // avoid duplicates
    const exist = await db.query(
      "SELECT id FROM mappings WHERE patient_id = $1 AND doctor_id = $2",
      [patient_id, doctor_id]
    );
    if (exist.rows.length > 0)
      return res.status(400).json({ message: "Mapping already exists" });

    const result = await db.query(
      "INSERT INTO mappings (patient_id, doctor_id, created_by) VALUES ($1, $2, $3) RETURNING *",
      [patient_id, doctor_id, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("createMapping", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getMappings = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT m.id, m.patient_id, p.name as patient_name, m.doctor_id, d.name as doctor_name
       FROM mappings m
       JOIN patients p ON p.id = m.patient_id
       JOIN doctors d ON d.id = m.doctor_id
       ORDER BY m.id DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("getMappings", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getDoctorsForPatient = async (req, res) => {
  try {
    const { patient_id } = req.params;

    const patientQ = await db.query(
      "SELECT id FROM patients WHERE id = $1 AND created_by = $2",
      [patient_id, req.user.id]
    );
    if (patientQ.rows.length === 0)
      return res
        .status(404)
        .json({ message: "Patient not found or not owned by you" });

    const result = await db.query(
      `SELECT d.id as doctor_id, d.name as doctor_name, d.specialization, m.id as mapping_id
       FROM mappings m
       JOIN doctors d ON d.id = m.doctor_id
       WHERE m.patient_id = $1`,
      [patient_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("getDoctorsForPatient", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateMapping = async (req, res) => {
  try {
    const { id } = req.params;
    const { patient_id, doctor_id } = req.body;

    // check if mapping exists
    const mappingQ = await db.query("SELECT * FROM mappings WHERE id = $1", [
      id,
    ]);
    if (mappingQ.rows.length === 0)
      return res.status(404).json({ message: "Mapping not found" });

    // ensure the patient belongs to the user
    const patientQ = await db.query(
      "SELECT id FROM patients WHERE id = $1 AND created_by = $2",
      [patient_id, req.user.id]
    );
    if (patientQ.rows.length === 0)
      return res
        .status(403)
        .json({ message: "Not allowed to update this mapping" });

    // check doctor existence
    const doctorQ = await db.query("SELECT id FROM doctors WHERE id = $1", [
      doctor_id,
    ]);
    if (doctorQ.rows.length === 0)
      return res.status(404).json({ message: "Doctor not found" });

    // update mapping
    const result = await db.query(
      "UPDATE mappings SET patient_id = $1, doctor_id = $2 WHERE id = $3 RETURNING *",
      [patient_id, doctor_id, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("updateMapping", err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteMapping = async (req, res) => {
  try {
    const { id } = req.params;
    const mQ = await db.query("SELECT * FROM mappings WHERE id = $1", [id]);
    if (mQ.rows.length === 0)
      return res.status(404).json({ message: "Mapping not found" });

    const mapping = mQ.rows[0];

    const patientQ = await db.query(
      "SELECT id FROM patients WHERE id = $1 AND created_by = $2",
      [mapping.patient_id, req.user.id]
    );
    if (patientQ.rows.length === 0)
      return res
        .status(403)
        .json({ message: "Not allowed to delete this mapping" });

    await db.query("DELETE FROM mappings WHERE id = $1", [id]);
    res.json({ message: "Mapping removed" });
  } catch (err) {
    console.error("deleteMapping", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createMapping,
  getMappings,
  getDoctorsForPatient,
  updateMapping,
  deleteMapping,
};
