// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require("./routes/auth");
const patientsRoutes = require("./routes/patients");
const doctorsRoutes = require("./routes/doctors");
const mappingsRoutes = require("./routes/mappings");

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientsRoutes);
app.use("/api/doctors", doctorsRoutes);
app.use("/api/mappings", mappingsRoutes);

app.get("/", (req, res) => res.send("Healthcare backend running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
