// Q3. Dynamic Survey Form Builder
// Topics: Controlled Components, Dynamic Rendering, Validation

import { useState } from "react";

const formConfig = [
  { name: "username", label: "Username", type: "text", required: true },
  { name: "email", label: "Email Address", type: "email", required: true },
  { name: "age", label: "Age", type: "number", required: false },
  {
    name: "country",
    label: "Country",
    type: "select",
    required: true,
    options: ["India", "USA", "UK", "Canada", "Australia"],
  },
  {
    name: "stack",
    label: "Preferred Stack",
    type: "select",
    required: false,
    options: ["React", "Vue", "Angular", "Svelte"],
  },
  { name: "newsletter", label: "Subscribe to newsletter", type: "checkbox", required: false },
  { name: "terms", label: "I agree to terms & conditions", type: "checkbox", required: true },
];

export default function SurveyForm() {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    // Clear error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    formConfig.forEach((field) => {
      if (field.required) {
        const val = values[field.name];
        if (field.type === "checkbox" && !val)
          newErrors[field.name] = `${field.label} is required`;
        else if (!val && val !== false)
          newErrors[field.name] = `${field.label} is required`;
      }
    });
    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);
    setResult(values);
  };

  if (result) {
    return (
      <div style={styles.container}>
        <h2>Responses Collected</h2>
        <pre style={styles.pre}>{JSON.stringify(result, null, 2)}</pre>
        <button onClick={() => { setResult(null); setValues({}); }} style={styles.btn}>
          Fill Again
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>Dynamic Survey</h2>
      <form onSubmit={handleSubmit} noValidate>
        {formConfig.map((field) => (
          <div key={field.name} style={styles.fieldGroup}>
            {field.type === "checkbox" ? (
              <label style={styles.checkLabel}>
                <input
                  type="checkbox"
                  name={field.name}
                  checked={!!values[field.name]}
                  onChange={handleChange}
                />
                {field.label} {field.required && <span style={styles.star}>*</span>}
              </label>
            ) : (
              <>
                <label>
                  {field.label} {field.required && <span style={styles.star}>*</span>}
                </label>
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={values[field.name] || ""}
                    onChange={handleChange}
                    style={styles.input}
                  >
                    <option value="">-- Select --</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={values[field.name] || ""}
                    onChange={handleChange}
                    placeholder={field.label}
                    style={styles.input}
                  />
                )}
              </>
            )}
            {errors[field.name] && (
              <span style={styles.error}>{errors[field.name]}</span>
            )}
          </div>
        ))}
        <button type="submit" style={styles.btn}>Submit Survey</button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: 480, margin: "2rem auto", fontFamily: "sans-serif" },
  fieldGroup: { display: "flex", flexDirection: "column", marginBottom: 14 },
  input: { padding: "8px 10px", fontSize: 14, borderRadius: 6, border: "1px solid #ccc" },
  checkLabel: { display: "flex", alignItems: "center", gap: 8, fontSize: 14 },
  error: { color: "red", fontSize: 12, marginTop: 4 },
  star: { color: "red" },
  btn: {
    padding: "10px 20px", background: "#4F46E5", color: "#fff",
    border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14,
  },
  pre: {
    background: "#f4f4f4", padding: 16, borderRadius: 8,
    fontSize: 13, overflowX: "auto",
  },
};
