// utils.js — Utility functions: debounce, validation, animation

/**
 * Debounce a function
 * @param {Function} fn
 * @param {number} delay ms
 * @returns {Function}
 */
export function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Validate city name: non-empty, letters/spaces/hyphens only
 * @param {string} value
 * @returns {{ valid: boolean, message: string }}
 */
export function validateCityName(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return { valid: false, message: "City name cannot be empty." };
  }
  if (!/^[\p{L}\s'\-,.]+$/u.test(trimmed)) {
    return { valid: false, message: "City name can only contain letters, spaces, and hyphens." };
  }
  if (trimmed.length < 2) {
    return { valid: false, message: "City name must be at least 2 characters." };
  }
  if (trimmed.length > 100) {
    return { valid: false, message: "City name is too long." };
  }
  return { valid: true, message: "" };
}

/**
 * Get background gradient based on weather + day/night
 * @param {number} weatherCode
 * @param {boolean} isDay
 * @returns {string} CSS gradient
 */
export function getWeatherGradient(weatherCode, isDay) {
  if (!isDay) return "linear-gradient(135deg, #0f0c29, #302b63, #24243e)";
  if (weatherCode === 0 || weatherCode === 1) {
    return "linear-gradient(135deg, #56ccf2, #2f80ed)";
  }
  if (weatherCode <= 3) {
    return "linear-gradient(135deg, #8e9eab, #eef2f3)";
  }
  if (weatherCode <= 55) {
    return "linear-gradient(135deg, #757f9a, #d7dde8)";
  }
  if (weatherCode <= 67) {
    return "linear-gradient(135deg, #4b6cb7, #182848)";
  }
  if (weatherCode <= 77) {
    return "linear-gradient(135deg, #e0eafc, #cfdef3)";
  }
  return "linear-gradient(135deg, #373b44, #4286f4)";
}

/**
 * Format temperature with unit
 * @param {number} temp
 * @param {'C'|'F'} unit
 * @returns {string}
 */
export function formatTemp(temp, unit = "C") {
  if (unit === "F") return `${Math.round(temp * 9 / 5 + 32)}°F`;
  return `${temp}°C`;
}

/**
 * RequestAnimationFrame-based fade-in for an element
 * @param {HTMLElement} el
 */
export function fadeIn(el) {
  el.style.opacity = "0";
  el.style.transform = "translateY(16px)";
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.transition = "opacity 0.4s ease, transform 0.4s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  });
}

/**
 * Create an element with attributes and optional text
 * @param {string} tag
 * @param {Record<string,string>} attrs
 * @param {string} [text]
 * @returns {HTMLElement}
 */
export function el(tag, attrs = {}, text) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "className") node.className = v;
    else if (k === "textContent") node.textContent = v;
    else node.setAttribute(k, v);
  }
  if (text !== undefined) node.textContent = text;
  return node;
}
