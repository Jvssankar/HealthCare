# Healthcare Management System - Backend

This is the **backend** of a Healthcare Management System built with **Node.js, Express, and PostgreSQL**.  
It provides APIs for **user authentication**, **patient management**, **doctor management**, and **patient-doctor mappings**. The backend is secured with **JWT authentication** and connects to a PostgreSQL database.

---

## Project Overview

The Healthcare Management System allows users to:

- Register and log in securely.
- Manage patients (create, read, update, delete).
- Manage doctors (create, read, update, delete).
- Map patients to doctors and manage these mappings.
- Ensure data privacy with user-specific patient ownership.

---

## Features

### 1. Authentication APIs

- `POST /api/auth/register` - Register a new user with name, email, and password.
- `POST /api/auth/login` - Log in a user and return a JWT token.

### 2. Patient Management APIs

- `POST /api/patients` - Add a new patient (authenticated users only).
- `GET /api/patients` - Retrieve all patients created by the authenticated user.
- `GET /api/patients/:id` - Get details of a specific patient.
- `PUT /api/patients/:id` - Update patient details.
- `DELETE /api/patients/:id` - Delete a patient record.

### 3. Doctor Management APIs

- `POST /api/doctors` - Add a new doctor (authenticated users only).
- `GET /api/doctors` - Retrieve all doctors.
- `GET /api/doctors/:id` - Get details of a specific doctor.
- `PUT /api/doctors/:id` - Update doctor details.
- `DELETE /api/doctors/:id` - Delete a doctor record.

### 4. Patient-Doctor Mapping APIs

- `POST /api/mappings` - Assign a doctor to a patient.
- `GET /api/mappings` - Retrieve all patient-doctor mappings.
- `GET /api/mappings/:patient_id` - Get all doctors assigned to a specific patient.
- `PUT /api/mappings/:id` - Update a patient-doctor mapping.
- `DELETE /api/mappings/:id` - Remove a doctor from a patient.

---

## Technology Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt
- **Environment Variables:** dotenv

---

## Installation & Setup

1. Open the backend folder locally.
2. Install the required dependencies
