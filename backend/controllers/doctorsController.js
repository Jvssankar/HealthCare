// controllers/doctorsController.js
const db = require("../db");

const createDoctor = async (req, res) => {
  try {
    const { name, specialization } = req.body;
    if (!name) return res.status(400).json({ message: "Name required" });

    const result = await db.query(
      `INSERT INTO doctors (name, specialization, created_by) VALUES ($1, $2, $3) RETURNING *`,
      [name, specialization || null, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("createDoctor", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getDoctors = async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM doctors ORDER BY id DESC`);
    res.json(result.rows);
  } catch (err) {
    console.error("getDoctors", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`SELECT * FROM doctors WHERE id = $1`, [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Doctor not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("getDoctorById", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, specialization } = req.body;

    // optionally, enforce only creator can edit; here we allow only creator
    const owned = await db.query(
      "SELECT id FROM doctors WHERE id = $1 AND created_by = $2",
      [id, req.user.id]
    );
    if (owned.rows.length === 0)
      return res
        .status(404)
        .json({ message: "Doctor not found or not owned by you" });

    const result = await db.query(
      `UPDATE doctors SET name = COALESCE($1, name), specialization = COALESCE($2, specialization) WHERE id = $3 RETURNING *`,
      [name, specialization, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("updateDoctor", err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const owned = await db.query(
      "SELECT id FROM doctors WHERE id = $1 AND created_by = $2",
      [id, req.user.id]
    );
    if (owned.rows.length === 0)
      return res
        .status(404)
        .json({ message: "Doctor not found or not owned by you" });

    await db.query("DELETE FROM mappings WHERE doctor_id = $1", [id]); // cleanup mappings
    await db.query("DELETE FROM doctors WHERE id = $1", [id]);
    res.json({ message: "Doctor deleted" });
  } catch (err) {
    console.error("deleteDoctor", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
