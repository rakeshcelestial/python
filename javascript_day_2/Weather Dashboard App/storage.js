// storage.js — Persistence layer: localStorage, cookies, JSON

const FAVORITES_KEY = "wdash_favorites";
const THEME_KEY     = "wdash_theme";
const LAST_CITY_COOKIE = "wdash_last_city";

// ── Favorites (localStorage) ─────────────────────────────────────────────────

/**
 * Load favorites array from localStorage
 * @returns {import('./api.js').WeatherData[]}
 */
export function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save favorites array to localStorage
 * @param {import('./api.js').WeatherData[]} favorites
 */
export function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

/**
 * Add a city to favorites (deduplicated by city+country)
 * @param {import('./api.js').WeatherData} weatherData
 * @returns {import('./api.js').WeatherData[]} updated list
 */
export function addFavorite(weatherData) {
  const favs = loadFavorites();
  const exists = favs.some(
    f => f.city === weatherData.city && f.country === weatherData.country
  );
  if (exists) return favs;
  const updated = [...favs, weatherData];
  saveFavorites(updated);
  return updated;
}

/**
 * Remove a favorite by city+country key
 * @param {string} city
 * @param {string} country
 * @returns {import('./api.js').WeatherData[]} updated list
 */
export function removeFavorite(city, country) {
  const favs = loadFavorites();
  const updated = favs.filter(
    f => !(f.city === city && f.country === country)
  );
  saveFavorites(updated);
  return updated;
}

/**
 * Check if a city is in favorites
 * @param {string} city
 * @param {string} country
 * @returns {boolean}
 */
export function isFavorite(city, country) {
  return loadFavorites().some(f => f.city === city && f.country === country);
}

// ── Theme (localStorage) ─────────────────────────────────────────────────────

/** @returns {'light'|'dark'} */
export function loadTheme() {
  return localStorage.getItem(THEME_KEY) || "dark";
}

/** @param {'light'|'dark'} theme */
export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

// ── Last City (Cookie, 7-day expiry) ─────────────────────────────────────────

/**
 * Store last searched city in a cookie
 * @param {string} city
 */
export function setLastCityCookie(city) {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  document.cookie = `${LAST_CITY_COOKIE}=${encodeURIComponent(city)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Read last searched city from cookie
 * @returns {string|null}
 */
export function getLastCityCookie() {
  const prefix = `${LAST_CITY_COOKIE}=`;
  const cookie = document.cookie
    .split(";")
    .map(c => c.trim())
    .find(c => c.startsWith(prefix));
  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
}
