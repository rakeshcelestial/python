// state.js — Observer pattern for app state management

/**
 * @typedef {Object} AppState
 * @property {import('./api.js').WeatherData|null} currentWeather
 * @property {import('./api.js').WeatherData[]} favorites
 * @property {boolean} loading
 * @property {string|null} error
 * @property {'light'|'dark'} theme
 * @property {'C'|'F'} tempUnit
 */

/** @type {AppState} */
const state = {
  currentWeather: null,
  favorites: [],
  loading: false,
  error: null,
  theme: "dark",
  tempUnit: "C",
};

/** @type {Map<string, Set<Function>>} */
const listeners = new Map();

/**
 * Subscribe to state key changes
 * @param {keyof AppState} key
 * @param {Function} callback
 * @returns {Function} unsubscribe
 */
export function subscribe(key, callback) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key).add(callback);
  return () => listeners.get(key).delete(callback);
}

/**
 * Get current state snapshot
 * @returns {AppState}
 */
export function getState() {
  return { ...state };
}

/**
 * Update state and notify subscribers
 * @param {Partial<AppState>} patch
 */
export function setState(patch) {
  const changed = [];
  for (const [key, value] of Object.entries(patch)) {
    if (state[key] !== value) {
      state[key] = value;
      changed.push(key);
    }
  }
  for (const key of changed) {
    if (listeners.has(key)) {
      for (const cb of listeners.get(key)) {
        try { cb(state[key], state); } catch (e) { console.error(e); }
      }
    }
  }
}
