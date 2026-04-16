// Q4. Theme + Language Switcher with Context
// Topics: Context API, Multiple Contexts, localStorage

import { createContext, useContext, useState, useEffect } from "react";

// ─── Contexts ────────────────────────────────────────────────
export const ThemeContext = createContext();
export const LangContext = createContext();

// ─── Translations ─────────────────────────────────────────────
const translations = {
  en: {
    welcome: "Welcome to our application!",
    settings: "Settings",
    theme: "Theme",
    language: "Language",
    light: "Light",
    dark: "Dark",
  },
  hi: {
    welcome: "हमारे एप्लिकेशन में आपका स्वागत है!",
    settings: "सेटिंग्स",
    theme: "थीम",
    language: "भाषा",
    light: "हल्का",
    dark: "गहरा",
  },
};

// ─── Providers ────────────────────────────────────────────────
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("app-theme") || "light"
  );
  useEffect(() => localStorage.setItem("app-theme", theme), [theme]);
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem("app-lang") || "en"
  );
  useEffect(() => localStorage.setItem("app-lang", lang), [lang]);
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

// ─── Settings Panel (Level 1) ─────────────────────────────────
function SettingsPanel() {
  const { theme, setTheme } = useContext(ThemeContext);
  const { lang, setLang } = useContext(LangContext);
  const t = translations[lang];

  return (
    <div style={getCardStyle(theme)}>
      <h3>{t.settings}</h3>

      <div style={styles.row}>
        <span>{t.theme}:</span>
        <button onClick={() => setTheme("light")}
          style={getToggleBtn(theme === "light")}>{t.light}</button>
        <button onClick={() => setTheme("dark")}
          style={getToggleBtn(theme === "dark")}>{t.dark}</button>
      </div>

      <div style={styles.row}>
        <span>{t.language}:</span>
        <button onClick={() => setLang("en")}
          style={getToggleBtn(lang === "en")}>English</button>
        <button onClick={() => setLang("hi")}
          style={getToggleBtn(lang === "hi")}>हिंदी</button>
      </div>
    </div>
  );
}

// ─── Deeply Nested Component (3 levels deep) ──────────────────
function DeepMessage() {
  const { theme } = useContext(ThemeContext);
  const { lang } = useContext(LangContext);
  const t = translations[lang];
  return (
    <div style={getMessageStyle(theme)}>
      <p>{t.welcome}</p>
      <small style={{ opacity: 0.6 }}>
        This is 3 levels deep · theme: {theme} · lang: {lang}
      </small>
    </div>
  );
}

function Level2() { return <div><DeepMessage /></div>; }
function Level1() { return <div><Level2 /></div>; }

// ─── Root App ──────────────────────────────────────────────────
export default function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <AppContent />
      </LangProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme } = useContext(ThemeContext);
  return (
    <div style={getRootStyle(theme)}>
      <SettingsPanel />
      <Level1 />
    </div>
  );
}

// ─── Dynamic Styles ───────────────────────────────────────────
function getRootStyle(theme) {
  return {
    minHeight: "100vh", padding: 24, fontFamily: "sans-serif",
    background: theme === "dark" ? "#1a1a2e" : "#f0f4f8",
    color: theme === "dark" ? "#e0e0e0" : "#1a1a2e",
    transition: "all 0.3s",
  };
}

function getCardStyle(theme) {
  return {
    background: theme === "dark" ? "#16213e" : "#fff",
    border: `1px solid ${theme === "dark" ? "#333" : "#ddd"}`,
    borderRadius: 10, padding: 20, marginBottom: 16,
  };
}

function getMessageStyle(theme) {
  return {
    background: theme === "dark" ? "#0f3460" : "#e8f4fd",
    borderRadius: 10, padding: 20, fontSize: 18,
    borderLeft: "4px solid #4F46E5",
  };
}

function getToggleBtn(active) {
  return {
    padding: "6px 14px", marginLeft: 8, borderRadius: 6,
    border: "1px solid #4F46E5", cursor: "pointer",
    background: active ? "#4F46E5" : "transparent",
    color: active ? "#fff" : "#4F46E5", fontWeight: active ? 600 : 400,
  };
}

const styles = {
  row: { display: "flex", alignItems: "center", marginTop: 12, flexWrap: "wrap", gap: 4 },
};
