import React, { useEffect, useState } from "react";
import API from "../api/axios";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ name: "", age: "", disease: "" });

  // Fetch all patients
  const fetchPatients = async () => {
    try {
      const res = await API.get("/patients");
      setPatients(res.data);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Handle input changes
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Add new patient
  const addPatient = async (e) => {
    e.preventDefault();
    try {
      await API.post("/patients", form);
      setForm({ name: "", age: "", disease: "" }); // clear form
      fetchPatients();
    } catch (err) {
      console.error("Error adding patient:", err);
    }
  };

  // Delete patient
  const deletePatient = async (id) => {
    try {
      await API.delete(`/patients/${id}`);
      fetchPatients();
    } catch (err) {
      console.error("Error deleting patient:", err);
    }
  };

  return (
    <div className="page">
      <h2>Patients</h2>

      <form onSubmit={addPatient} style={{ marginBottom: "1rem" }}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="age"
          placeholder="Age"
          type="number"
          value={form.age}
          onChange={handleChange}
          required
        />
        <input
          name="disease"
          placeholder="Disease"
          value={form.disease}
          onChange={handleChange}
          required
        />
        <button type="submit">Add</button>
      </form>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {patients.map((p) => (
          <li
            key={p.id}
            style={{
              marginBottom: "0.5rem",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          >
            {p.name} ({p.age}) - {p.disease}
            <button
              onClick={() => deletePatient(p.id)}
              style={{ marginLeft: "1rem" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Patients;
