// Q6. Multi-Step Form with useReducer
// Topics: useReducer, Multi-Step Flow, Validation

import { useReducer } from "react";

// ─── Initial State ────────────────────────────────────────────
const initialState = {
  step: 0,
  data: {
    firstName: "", lastName: "", email: "", phone: "",
    street: "", city: "", state: "", zip: "",
  },
};

// ─── Reducer ──────────────────────────────────────────────────
function formReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, data: { ...state.data, [action.key]: action.value } };
    case "NEXT":
      return { ...state, step: Math.min(state.step + 1, 2) };
    case "BACK":
      return { ...state, step: Math.max(state.step - 1, 0) };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

// ─── Validation per step ─────────────────────────────────────
function validateStep(step, data) {
  if (step === 0) {
    return data.firstName.trim() && data.lastName.trim() &&
      /^[^@]+@[^@]+\.[^@]+$/.test(data.email) && data.phone.trim().length >= 7;
  }
  if (step === 1) {
    return data.street.trim() && data.city.trim() &&
      data.state.trim() && data.zip.trim().length >= 5;
  }
  return true;
}

// ─── Step Components ──────────────────────────────────────────
function PersonalInfo({ data, dispatch }) {
  const field = (key, label, type = "text") => (
    <div style={styles.fieldGroup} key={key}>
      <label>{label}</label>
      <input
        type={type}
        value={data[key]}
        onChange={(e) => dispatch({ type: "SET_FIELD", key, value: e.target.value })}
        placeholder={label}
        style={styles.input}
      />
    </div>
  );
  return (
    <div>
      <h3>Step 1 — Personal Information</h3>
      <div style={styles.twoCol}>
        {field("firstName", "First Name")}
        {field("lastName", "Last Name")}
      </div>
      {field("email", "Email", "email")}
      {field("phone", "Phone Number", "tel")}
    </div>
  );
}

function AddressInfo({ data, dispatch }) {
  const field = (key, label) => (
    <div style={styles.fieldGroup} key={key}>
      <label>{label}</label>
      <input
        value={data[key]}
        onChange={(e) => dispatch({ type: "SET_FIELD", key, value: e.target.value })}
        placeholder={label}
        style={styles.input}
      />
    </div>
  );
  return (
    <div>
      <h3>Step 2 — Address</h3>
      {field("street", "Street Address")}
      <div style={styles.twoCol}>
        {field("city", "City")}
        {field("state", "State")}
      </div>
      {field("zip", "ZIP Code")}
    </div>
  );
}

function Review({ data }) {
  const sections = [
    {
      title: "Personal Info",
      fields: [
        ["Name", `${data.firstName} ${data.lastName}`],
        ["Email", data.email],
        ["Phone", data.phone],
      ],
    },
    {
      title: "Address",
      fields: [
        ["Street", data.street],
        ["City", data.city],
        ["State", data.state],
        ["ZIP", data.zip],
      ],
    },
  ];
  return (
    <div>
      <h3>Step 3 — Review & Submit</h3>
      {sections.map((s) => (
        <div key={s.title} style={styles.reviewSection}>
          <strong>{s.title}</strong>
          {s.fields.map(([label, value]) => (
            <div key={label} style={styles.reviewRow}>
              <span style={{ color: "#888", minWidth: 80 }}>{label}:</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────
function ProgressBar({ step }) {
  const steps = ["Personal Info", "Address", "Review"];
  return (
    <div style={styles.progressWrapper}>
      {steps.map((label, i) => (
        <div key={label} style={styles.progressStep}>
          <div style={getStepCircle(i, step)}>{i + 1}</div>
          <span style={{ fontSize: 12, color: i <= step ? "#4F46E5" : "#aaa" }}>
            {label}
          </span>
          {i < steps.length - 1 && <div style={getConnector(i, step)} />}
        </div>
      ))}
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────
export default function MultiStepForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { step, data } = state;
  const canProceed = validateStep(step, data);

  const stepComponents = [
    <PersonalInfo data={data} dispatch={dispatch} />,
    <AddressInfo data={data} dispatch={dispatch} />,
    <Review data={data} />,
  ];

  const handleSubmit = () => {
    alert("Form submitted successfully!\n" + JSON.stringify(data, null, 2));
    dispatch({ type: "RESET" });
  };

  return (
    <div style={styles.container}>
      <h2>Multi-Step Registration</h2>
      <ProgressBar step={step} />
      <div style={styles.card}>
        {stepComponents[step]}
        <div style={styles.navRow}>
          {step > 0 && (
            <button onClick={() => dispatch({ type: "BACK" })} style={styles.backBtn}>
              ← Back
            </button>
          )}
          <div style={{ flex: 1 }} />
          {step < 2 ? (
            <button
              onClick={() => dispatch({ type: "NEXT" })}
              disabled={!canProceed}
              style={canProceed ? styles.nextBtn : styles.disabledBtn}
            >
              Next →
            </button>
          ) : (
            <button onClick={handleSubmit} style={styles.submitBtn}>
              Submit ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────
function getStepCircle(i, current) {
  const active = i <= current;
  return {
    width: 32, height: 32, borderRadius: "50%", display: "flex",
    alignItems: "center", justifyContent: "center", fontWeight: 600,
    fontSize: 14, marginBottom: 4,
    background: active ? "#4F46E5" : "#e0e0e0",
    color: active ? "#fff" : "#999",
  };
}

function getConnector(i, current) {
  return {
    position: "absolute", top: 16, left: "calc(50% + 16px)",
    width: "calc(100% - 32px)", height: 2,
    background: i < current ? "#4F46E5" : "#e0e0e0",
  };
}

const styles = {
  container: { maxWidth: 520, margin: "2rem auto", fontFamily: "sans-serif" },
  progressWrapper: {
    display: "flex", justifyContent: "space-between", position: "relative",
    marginBottom: 24, padding: "0 10px",
  },
  progressStep: {
    display: "flex", flexDirection: "column", alignItems: "center",
    flex: 1, position: "relative",
  },
  card: {
    border: "1px solid #e0e0e0", borderRadius: 12,
    padding: 24, background: "#fff",
  },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  fieldGroup: { display: "flex", flexDirection: "column", marginBottom: 14 },
  input: { padding: "8px 10px", fontSize: 14, borderRadius: 6, border: "1px solid #ccc" },
  navRow: { display: "flex", marginTop: 24, alignItems: "center" },
  backBtn: {
    padding: "10px 20px", background: "#f0f0f0", color: "#333",
    border: "none", borderRadius: 6, cursor: "pointer",
  },
  nextBtn: {
    padding: "10px 20px", background: "#4F46E5", color: "#fff",
    border: "none", borderRadius: 6, cursor: "pointer",
  },
  disabledBtn: {
    padding: "10px 20px", background: "#ccc", color: "#fff",
    border: "none", borderRadius: 6, cursor: "not-allowed",
  },
  submitBtn: {
    padding: "10px 20px", background: "#10B981", color: "#fff",
    border: "none", borderRadius: 6, cursor: "pointer",
  },
  reviewSection: {
    background: "#f8f9fa", borderRadius: 8, padding: 14, marginBottom: 12,
  },
  reviewRow: { display: "flex", gap: 12, marginTop: 6, fontSize: 14 },
};
