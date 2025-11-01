import React, { useEffect, useState } from "react";
import API from "../api/axios";

const Mappings = () => {
  const [mappings, setMappings] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ patient_id: "", doctor_id: "" });
  const [editingId, setEditingId] = useState(null); // track which mapping is being edited

  // Fetch all patients
  const fetchPatients = async () => {
    const res = await API.get("/patients");
    setPatients(res.data);
  };

  // Fetch all doctors
  const fetchDoctors = async () => {
    const res = await API.get("/doctors");
    setDoctors(res.data);
  };

  // Fetch all mappings
  const fetchMappings = async () => {
    const res = await API.get("/mappings");
    setMappings(res.data);
  };

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
    fetchMappings();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Add or update mapping
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patient_id || !form.doctor_id) return;

    try {
      if (editingId) {
        // Update mapping
        await API.put(`/mappings/${editingId}`, form);
        setEditingId(null); // exit edit mode
      } else {
        // Add new mapping
        await API.post("/mappings", form);
      }
      setForm({ patient_id: "", doctor_id: "" }); // clear form
      fetchMappings();
    } catch (err) {
      console.error("Error saving mapping:", err);
    }
  };

  // Delete mapping
  const deleteMapping = async (id) => {
    await API.delete(`/mappings/${id}`);
    fetchMappings();
  };

  // Edit mapping
  const editMapping = (mapping) => {
    setEditingId(mapping.id);
    setForm({ patient_id: mapping.patient_id, doctor_id: mapping.doctor_id });
  };

  return (
    <div className="page">
      <h2>Patient-Doctor Mappings</h2>

      {/* Form to add/update mapping */}
      <form
        onSubmit={handleSubmit}
        style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}
      >
        <select
          name="patient_id"
          value={form.patient_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.id})
            </option>
          ))}
        </select>

        <select
          name="doctor_id"
          value={form.doctor_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Doctor</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} ({d.id})
            </option>
          ))}
        </select>

        <button type="submit">{editingId ? "Update" : "Assign"}</button>
      </form>

      {/* Mappings Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#1976d2", color: "#fff" }}>
            <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>
              Patient
            </th>
            <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>
              Doctor
            </th>
            <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {mappings.map((m) => {
            const patient = patients.find((p) => p.id === m.patient_id);
            const doctor = doctors.find((d) => d.id === m.doctor_id);

            return (
              <tr key={m.id}>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>
                  {patient?.name || m.patient_id}
                </td>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>
                  {doctor?.name || m.doctor_id}
                </td>
                <td style={{ padding: "0.4rem", border: "1px solid #ccc" }}>
                  <button
                    onClick={() => editMapping(m)}
                    style={{
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      border: "none",
                      padding: "0.3rem 0.6rem",
                      borderRadius: "4px",
                      cursor: "pointer",
                      marginRight: "0.1rem",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMapping(m.id)}
                    style={{
                      backgroundColor: "#d32f2f",
                      color: "#fff",
                      border: "none",
                      padding: "0.3rem 0.6rem",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Mappings;
