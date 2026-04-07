// app.js — Main application orchestrator

import { fetchWeather, fetchWeatherByCity, searchCities } from "./api.js";
import {
  loadFavorites, saveFavorites,
  addFavorite, removeFavorite, isFavorite,
  loadTheme, saveTheme,
  setLastCityCookie, getLastCityCookie,
} from "./storage.js";
import { setState, getState, subscribe } from "./state.js";
import {
  showToast, showSpinner, hideSpinner,
  renderCurrentWeather, renderFavorites,
  showError, clearCurrentWeather,
  showSuggestions, clearSuggestions,
  applyTheme,
  showSearchError, clearSearchError,
} from "./ui.js";
import { debounce, validateCityName } from "./utils.js";

// ── Boot ─────────────────────────────────────────────────────────────────────

function init() {
  // Load persisted state
  const savedTheme = loadTheme();
  const savedFavs  = loadFavorites();
  setState({ theme: savedTheme, favorites: savedFavs });
  applyTheme(savedTheme);
  renderFavorites(savedFavs);

  // Pre-fill search from cookie
  const lastCity = getLastCityCookie();
  if (lastCity) {
    const input = document.getElementById("search-input");
    input.value = lastCity;
  }

  // Wire up all UI
  bindSearch();
  bindThemeToggle();
  bindTempToggle();
  bindFavoritesDelegation();
  bindKeyboardNav();

  // Subscribe to state changes (Observer pattern)
  subscribe("favorites", (favs) => {
    renderFavorites(favs);
    // Re-render current card to update star state
    const { currentWeather } = getState();
    if (currentWeather) renderCurrentWeather(currentWeather);
  });

  subscribe("theme", (theme) => {
    applyTheme(theme);
    saveTheme(theme);
  });

  subscribe("currentWeather", (data) => {
    if (data) renderCurrentWeather(data);
    else clearCurrentWeather();
  });

  subscribe("loading", (loading) => {
    if (loading) showSpinner(); else hideSpinner();
  });
}

// ── Search ───────────────────────────────────────────────────────────────────

function bindSearch() {
  const input   = document.getElementById("search-input");
  const btn     = document.getElementById("search-btn");
  const wrapper = document.getElementById("search-wrapper");

  // Debounced autocomplete
  const debouncedSuggest = debounce(async (query) => {
    const { valid } = validateCityName(query);
    if (!valid || query.trim().length < 2) { clearSuggestions(); return; }
    try {
      const results = await searchCities(query);
      showSuggestions(results, (geo) => {
        input.value = geo.name;
        clearSuggestions();
        doFetch(geo.latitude, geo.longitude, geo.name, geo.country);
      });
    } catch { /* silently ignore autocomplete errors */ }
  }, 300);

  input.addEventListener("input", () => {
    clearSearchError();
    debouncedSuggest(input.value);
  });

  // Search on Enter key
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); handleSearch(); }
    if (e.key === "Escape") { clearSuggestions(); }
    // Autocomplete keyboard nav
    if (e.key === "ArrowDown") {
      const first = document.querySelector(".suggestion-item");
      if (first) { e.preventDefault(); first.focus(); }
    }
  });

  btn.addEventListener("click", handleSearch);

  // Close suggestions on outside click
  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) clearSuggestions();
  });
}

async function handleSearch() {
  const input = document.getElementById("search-input");
  const query = input.value.trim();

  // Form validation using our util (mirroring Constraint Validation API pattern)
  const { valid, message } = validateCityName(query);
  if (!valid) {
    showSearchError(message);
    input.focus();
    return;
  }
  clearSearchError();
  clearSuggestions();
  
  await doFetchByName(query);
}

async function doFetchByName(cityName) {
  setState({ loading: true, error: null });
  try {
    const data = await fetchWeatherByCity(cityName);
    setState({ currentWeather: data, loading: false });
    setLastCityCookie(cityName);
  } catch (err) {
    setState({ loading: false, error: err.message });
    const retry = () => doFetchByName(cityName);
    if (err.message.includes("not found")) {
      showError(`City "${cityName}" not found. Please check the spelling.`, retry);
      showToast(`City not found: "${cityName}"`, "error");
    } else if (err.message.includes("429")) {
      showError("API rate limit reached. Please try again later.", retry);
      showToast("Rate limit reached — please wait a moment.", "warning");
    } else {
      showError("Network error. Check your connection and retry.", retry);
      showToast("Network error. Please check your connection.", "error");
    }
  }
}

async function doFetch(lat, lon, city, country) {
  setState({ loading: true, error: null });
  try {
    const data = await fetchWeather(lat, lon, city, country);
    setState({ currentWeather: data, loading: false });
    setLastCityCookie(city);
  } catch (err) {
    setState({ loading: false, error: err.message });
    showError("Failed to fetch weather data.", () => doFetch(lat, lon, city, country));
    showToast("Failed to load weather data.", "error");
  }
}

// ── Favorites (Event Delegation) ─────────────────────────────────────────────

function bindFavoritesDelegation() {
  const list = document.getElementById("favorites-list");

  // Single listener on the parent list — event delegation
  list.addEventListener("click", async (e) => {
    // Walk up from target to find actionable element
    const actionEl = e.target.closest("[data-action]");
    if (!actionEl) return;

    const { action, city, country, lat, lon } = actionEl.dataset;

    if (action === "remove-favorite") {
      // confirm() before deletion
      const confirmed = confirm(`Remove "${city}" from your favorites?`);
      if (!confirmed) return;
      const updated = removeFavorite(city, country);
      setState({ favorites: updated });
      showToast(`${city} removed from favorites.`, "info");
    }

    if (action === "load-favorite") {
      await doFetch(parseFloat(lat), parseFloat(lon), city, country);
    }
  });

  // Also handle card favorite buttons via bubbling from current-weather section
  document.getElementById("current-weather").addEventListener("click", (e) => {
    // Event bubbling: click on nested fav button inside card
    const btn = e.target.closest("[data-action='toggle-favorite']");
    if (!btn) return;
    const { city, country } = btn.dataset;
    toggleFavorite(city, country);
  });
}

function toggleFavorite(city, country) {
  const { currentWeather, favorites } = getState();
  const alreadyFav = isFavorite(city, country);

  if (alreadyFav) {
    const updated = removeFavorite(city, country);
    setState({ favorites: updated });
    showToast(`${city} removed from favorites.`, "info");
  } else {
    if (currentWeather && currentWeather.city === city) {
      const updated = addFavorite(currentWeather);
      setState({ favorites: updated });
      showToast(`${city} added to favorites! ★`, "success");
    }
  }
}

// ── Theme Toggle ─────────────────────────────────────────────────────────────

function bindThemeToggle() {
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const { theme } = getState();
    const next = theme === "dark" ? "light" : "dark";
    setState({ theme: next });
  });
}

// ── Temp Unit Toggle ─────────────────────────────────────────────────────────

function bindTempToggle() {
  document.getElementById("unit-toggle").addEventListener("click", () => {
    const { tempUnit, currentWeather, favorites } = getState();
    const next = tempUnit === "C" ? "F" : "C";
    setState({ tempUnit: next });
    document.getElementById("unit-toggle").textContent = `°${next}`;
    // Re-render to reflect new unit
    if (currentWeather) renderCurrentWeather(currentWeather);
    renderFavorites(favorites);
  });
}

// ── Keyboard Navigation ───────────────────────────────────────────────────────

function bindKeyboardNav() {
  // Suggestion list arrow key navigation
  document.addEventListener("keydown", (e) => {
    const items = [...document.querySelectorAll(".suggestion-item")];
    if (!items.length) return;
    const idx = items.indexOf(document.activeElement);
    if (e.key === "ArrowDown" && idx < items.length - 1) {
      e.preventDefault();
      items[idx + 1].focus();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (idx <= 0) document.getElementById("search-input").focus();
      else items[idx - 1].focus();
    }
  });

  // Card keyboard activation
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.classList.contains("weather-card")) {
      e.target.querySelector("[data-action='toggle-favorite']")?.click();
    }
  });
}

// ── Start ────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", init);
