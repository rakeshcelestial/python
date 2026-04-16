// Q1. Multi-Field Registration Form with Validation
// Topics: Controlled Components, Validation, Error State

import { useState } from "react";

const validate = (fields) => {
  const errors = {};
  if (!fields.name.trim()) errors.name = "Name is required";
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(fields.email)) errors.email = "Invalid email";
  if (
    fields.password.length < 8 ||
    !/[0-9]/.test(fields.password) ||
    !/[!@#$%^&*]/.test(fields.password)
  )
    errors.password = "Min 8 chars, at least one number and one special character";
  if (fields.password !== fields.confirmPassword)
    errors.confirmPassword = "Passwords do not match";
  const age = Number(fields.age);
  if (!age || age < 18 || age > 100) errors.age = "Age must be between 18 and 100";
  if (!fields.gender) errors.gender = "Please select a gender";
  return errors;
};

export default function RegistrationForm() {
  const initialState = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
  };

  const [fields, setFields] = useState(initialState);
  const [submitted, setSubmitted] = useState(null);
  const [touched, setTouched] = useState({});

  const errors = validate(fields);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = (e) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mark all fields touched on submit attempt
    const allTouched = Object.keys(initialState).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);
    if (isValid) {
      setSubmitted(fields);
      setFields(initialState);
      setTouched({});
    }
  };

  if (submitted) {
    return (
      <div style={styles.successCard}>
        <h2>Registration Successful!</h2>
        <p><strong>Name:</strong> {submitted.name}</p>
        <p><strong>Email:</strong> {submitted.email}</p>
        <p><strong>Age:</strong> {submitted.age}</p>
        <p><strong>Gender:</strong> {submitted.gender}</p>
        <button onClick={() => setSubmitted(null)} style={styles.button}>
          Register Another
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit} noValidate>
        {/* Name */}
        <div style={styles.fieldGroup}>
          <label>Name</label>
          <input
            name="name"
            value={fields.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Full Name"
            style={styles.input}
          />
          {touched.name && errors.name && <span style={styles.error}>{errors.name}</span>}
        </div>

        {/* Email */}
        <div style={styles.fieldGroup}>
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={fields.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="email@example.com"
            style={styles.input}
          />
          {touched.email && errors.email && <span style={styles.error}>{errors.email}</span>}
        </div>

        {/* Password */}
        <div style={styles.fieldGroup}>
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={fields.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Min 8 chars, number & special char"
            style={styles.input}
          />
          {touched.password && errors.password && (
            <span style={styles.error}>{errors.password}</span>
          )}
        </div>

        {/* Confirm Password */}
        <div style={styles.fieldGroup}>
          <label>Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            value={fields.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Repeat password"
            style={styles.input}
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <span style={styles.error}>{errors.confirmPassword}</span>
          )}
        </div>

        {/* Age */}
        <div style={styles.fieldGroup}>
          <label>Age</label>
          <input
            name="age"
            type="number"
            value={fields.age}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="18–100"
            style={styles.input}
          />
          {touched.age && errors.age && <span style={styles.error}>{errors.age}</span>}
        </div>

        {/* Gender */}
        <div style={styles.fieldGroup}>
          <label>Gender</label>
          <select
            name="gender"
            value={fields.gender}
            onChange={handleChange}
            onBlur={handleBlur}
            style={styles.input}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {touched.gender && errors.gender && (
            <span style={styles.error}>{errors.gender}</span>
          )}
        </div>

        <button type="submit" disabled={!isValid} style={styles.button}>
          Register
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: 420, margin: "2rem auto", fontFamily: "sans-serif" },
  fieldGroup: { display: "flex", flexDirection: "column", marginBottom: 14 },
  input: { padding: "8px 10px", fontSize: 14, borderRadius: 6, border: "1px solid #ccc" },
  error: { color: "red", fontSize: 12, marginTop: 4 },
  button: {
    padding: "10px 20px", background: "#4F46E5", color: "#fff",
    border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14,
  },
  successCard: {
    maxWidth: 420, margin: "2rem auto", padding: 24,
    border: "1px solid #ccc", borderRadius: 8, fontFamily: "sans-serif",
  },
};
