import React, { useEffect, useState } from "react";
import API from "../api/axios";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ name: "", specialization: "" });

  // Fetch all doctors
  const fetchDoctors = async () => {
    try {
      const res = await API.get("/doctors");
      setDoctors(res.data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Handle input changes
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Add new doctor
  const addDoctor = async (e) => {
    e.preventDefault();
    try {
      await API.post("/doctors", form);
      setForm({ name: "", specialization: "" }); // clear form
      fetchDoctors();
    } catch (err) {
      console.error("Error adding doctor:", err);
    }
  };

  // Delete doctor
  const deleteDoctor = async (id) => {
    try {
      await API.delete(`/doctors/${id}`);
      fetchDoctors();
    } catch (err) {
      console.error("Error deleting doctor:", err);
    }
  };

  return (
    <div className="page">
      <h2>Doctors</h2>

      <form onSubmit={addDoctor} style={{ marginBottom: "1rem" }}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="specialization"
          placeholder="Specialization"
          value={form.specialization}
          onChange={handleChange}
          required
        />
        <button type="submit">Add</button>
      </form>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {doctors.map((d) => (
          <li
            key={d.id}
            style={{
              marginBottom: "0.5rem",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          >
            {d.name} - {d.specialization}
            <button
              onClick={() => deleteDoctor(d.id)}
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

export default Doctors;
