// ui.js — DOM manipulation, weather cards, toasts, spinner

import { el, fadeIn, formatTemp, getWeatherGradient } from "./utils.js";
import { isFavorite } from "./storage.js";
import { getState } from "./state.js";

// ── Toast Notifications ──────────────────────────────────────────────────────

let toastTimer;

/**
 * Show a toast notification
 * @param {string} message
 * @param {'success'|'error'|'info'|'warning'} type
 * @param {number} duration ms
 */
export function showToast(message, type = "info", duration = 4000) {
  const container = document.getElementById("toast-container");
  
  const toast = el("div", { className: `toast toast--${type}`, role: "alert", "aria-live": "polite" });
  
  const icons = { success: "✓", error: "✕", info: "ℹ", warning: "⚠" };
  const icon = el("span", { className: "toast__icon", "aria-hidden": "true" }, icons[type]);
  const msg = el("span", { className: "toast__msg" }, message);
  const closeBtn = el("button", { className: "toast__close", "aria-label": "Dismiss notification" }, "×");
  
  toast.append(icon, msg, closeBtn);
  container.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => { toast.classList.add("toast--show"); });
  });

  const dismiss = () => {
    toast.classList.remove("toast--show");
    toast.addEventListener("transitionend", () => toast.remove(), { once: true });
  };

  closeBtn.addEventListener("click", dismiss);
  const t = setTimeout(dismiss, duration);
  closeBtn.addEventListener("click", () => clearTimeout(t), { once: true });
}

// ── Spinner ──────────────────────────────────────────────────────────────────

export function showSpinner() {
  document.getElementById("spinner-overlay").removeAttribute("hidden");
  document.getElementById("spinner-overlay").setAttribute("aria-busy", "true");
}

export function hideSpinner() {
  document.getElementById("spinner-overlay").setAttribute("hidden", "");
  document.getElementById("spinner-overlay").setAttribute("aria-busy", "false");
}

// ── Weather Card ─────────────────────────────────────────────────────────────

/**
 * Build a weather card element (no innerHTML for user data)
 * @param {import('./api.js').WeatherData} data
 * @param {boolean} [isFav]
 * @returns {HTMLElement}
 */
export function buildWeatherCard(data, isFav = false) {
  const { tempUnit } = getState();
  const fav = isFav !== undefined ? isFav : isFavorite(data.city, data.country);
  const gradient = getWeatherGradient(data.weatherCode, data.isDay);

  const card = el("article", {
    className: "weather-card",
    role: "region",
    "aria-label": `Weather for ${data.city}`,
    "data-city": data.city,
    "data-country": data.country,
    tabindex: "0",
  });
  card.style.background = gradient;

  // Header
  const header = el("div", { className: "card__header" });

  const locationWrap = el("div", { className: "card__location" });
  const cityEl = el("h2", { className: "card__city" }, data.city);
  const countryEl = el("span", { className: "card__country" }, data.country);
  locationWrap.append(cityEl, countryEl);

  const favBtn = el("button", {
    className: `card__fav-btn ${fav ? "card__fav-btn--active" : ""}`,
    "aria-label": fav ? `Remove ${data.city} from favorites` : `Add ${data.city} to favorites`,
    "aria-pressed": String(fav),
    "data-action": "toggle-favorite",
    "data-city": data.city,
    "data-country": data.country,
    tabindex: "0",
  });
  favBtn.textContent = fav ? "★" : "☆";

  header.append(locationWrap, favBtn);

  // Main display
  const main = el("div", { className: "card__main" });
  const iconEl = el("div", { className: "card__icon", role: "img", "aria-label": data.condition }, data.icon);
  const tempEl = el("div", { className: "card__temp" }, formatTemp(data.temperature, tempUnit));
  const condEl = el("div", { className: "card__condition" }, data.condition);
  main.append(iconEl, tempEl, condEl);

  // Stats row
  const stats = el("div", { className: "card__stats" });

  const statsData = [
    { label: "Feels Like", value: formatTemp(data.feelsLike, tempUnit), icon: "🌡️" },
    { label: "Humidity",   value: `${data.humidity}%`,                 icon: "💧" },
    { label: "Wind",       value: `${data.windSpeed} km/h`,            icon: "💨" },
  ];

  for (const s of statsData) {
    const stat = el("div", { className: "card__stat" });
    const statIcon = el("span", { className: "stat__icon", "aria-hidden": "true" }, s.icon);
    const statVal = el("span", { className: "stat__value" }, s.value);
    const statLabel = el("span", { className: "stat__label" }, s.label);
    stat.append(statIcon, statVal, statLabel);
    stats.appendChild(stat);
  }

  // Day/night badge
  const badge = el("div", {
    className: "card__badge",
    "aria-label": data.isDay ? "Daytime" : "Nighttime",
  }, data.isDay ? "🌅 Day" : "🌙 Night");

  card.append(header, main, stats, badge);
  return card;
}

// ── Current Weather Display ──────────────────────────────────────────────────

/**
 * Render current weather in the main display area
 * @param {import('./api.js').WeatherData} data
 */
export function renderCurrentWeather(data) {
  const container = document.getElementById("current-weather");
  container.innerHTML = "";

  const card = buildWeatherCard(data, isFavorite(data.city, data.country));
  card.classList.add("weather-card--current");
  container.appendChild(card);
  fadeIn(card);

  document.getElementById("weather-section").removeAttribute("hidden");
}

export function clearCurrentWeather() {
  document.getElementById("current-weather").innerHTML = "";
  document.getElementById("weather-section").setAttribute("hidden", "");
}

// ── Favorites List ───────────────────────────────────────────────────────────

/**
 * Render all favorites using DocumentFragment for performance
 * @param {import('./api.js').WeatherData[]} favorites
 */
export function renderFavorites(favorites) {
  const list = document.getElementById("favorites-list");
  const emptyMsg = document.getElementById("favorites-empty");

  // Clear existing
  list.innerHTML = "";

  if (!favorites.length) {
    emptyMsg.removeAttribute("hidden");
    document.getElementById("favorites-section").setAttribute("data-empty", "true");
    return;
  }

  emptyMsg.setAttribute("hidden", "");
  document.getElementById("favorites-section").removeAttribute("data-empty");

  // Use DocumentFragment for batch DOM insertion
  const fragment = document.createDocumentFragment();

  for (const fav of favorites) {
    const item = el("li", { className: "fav-item", "data-city": fav.city, "data-country": fav.country });
    
    const iconEl = el("span", { className: "fav-item__icon", "aria-hidden": "true" }, fav.icon);
    
    const info = el("div", { className: "fav-item__info" });
    const name = el("span", { className: "fav-item__name" }, fav.city);
    const meta = el("span", { className: "fav-item__meta" });
    
    const { tempUnit } = getState();
    const tempSpan = el("span", {}, formatTemp(fav.temperature, tempUnit));
    const sep = el("span", { "aria-hidden": "true" }, " · ");
    const condSpan = el("span", {}, fav.condition);
    meta.append(tempSpan, sep, condSpan);
    info.append(name, meta);

    const actions = el("div", { className: "fav-item__actions" });
    
    const loadBtn = el("button", {
      className: "fav-item__load",
      "aria-label": `View weather for ${fav.city}`,
      "data-action": "load-favorite",
      "data-city": fav.city,
      "data-country": fav.country,
      "data-lat": String(fav.lat),
      "data-lon": String(fav.lon),
    }, "View");
    
    const removeBtn = el("button", {
      className: "fav-item__remove",
      "aria-label": `Remove ${fav.city} from favorites`,
      "data-action": "remove-favorite",
      "data-city": fav.city,
      "data-country": fav.country,
    }, "✕");
    
    actions.append(loadBtn, removeBtn);
    item.append(iconEl, info, actions);
    fragment.appendChild(item);
  }

  list.appendChild(fragment);
}

// ── Error State ──────────────────────────────────────────────────────────────

/**
 * Show an inline error with optional retry
 * @param {string} message
 * @param {Function} [onRetry]
 */
export function showError(message, onRetry) {
  const container = document.getElementById("current-weather");
  container.innerHTML = "";

  const wrap = el("div", { className: "error-state", role: "alert" });
  const icon = el("div", { className: "error-state__icon", "aria-hidden": "true" }, "⚠️");
  const msg = el("p", { className: "error-state__msg" }, message);
  wrap.append(icon, msg);

  if (onRetry) {
    const btn = el("button", { className: "retry-btn", "aria-label": "Retry search" }, "↺ Retry");
    btn.addEventListener("click", onRetry);
    wrap.appendChild(btn);
  }

  container.appendChild(wrap);
  document.getElementById("weather-section").removeAttribute("hidden");
  fadeIn(wrap);
}

// ── Autocomplete Dropdown ────────────────────────────────────────────────────

/**
 * Show city suggestions dropdown
 * @param {import('./api.js').GeoResult[]} results
 * @param {Function} onSelect
 */
export function showSuggestions(results, onSelect) {
  clearSuggestions();
  if (!results.length) return;

  const dropdown = el("ul", {
    id: "suggestions-dropdown",
    className: "suggestions",
    role: "listbox",
    "aria-label": "City suggestions",
  });

  for (const r of results) {
    const item = el("li", {
      className: "suggestion-item",
      role: "option",
      tabindex: "0",
      "aria-selected": "false",
    });
    const name = el("span", { className: "suggestion-name" }, r.name);
    const region = el("span", { className: "suggestion-region" },
      [r.admin1, r.country].filter(Boolean).join(", ")
    );
    item.append(name, region);
    item.addEventListener("click", () => { onSelect(r); clearSuggestions(); });
    item.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { onSelect(r); clearSuggestions(); }
    });
    dropdown.appendChild(item);
  }

  document.getElementById("search-wrapper").appendChild(dropdown);
}

export function clearSuggestions() {
  document.getElementById("suggestions-dropdown")?.remove();
}

// ── Theme ────────────────────────────────────────────────────────────────────

/** @param {'light'|'dark'} theme */
export function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
    btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    btn.textContent = theme === "dark" ? "☀️" : "🌙";
  }
}

// ── Search validation UI ─────────────────────────────────────────────────────

/** @param {string} message */
export function showSearchError(message) {
  const input = document.getElementById("search-input");
  const errEl = document.getElementById("search-error");
  input.classList.add("input--error");
  input.setAttribute("aria-invalid", "true");
  errEl.textContent = message;
  errEl.removeAttribute("hidden");
}

export function clearSearchError() {
  const input = document.getElementById("search-input");
  const errEl = document.getElementById("search-error");
  input.classList.remove("input--error");
  input.removeAttribute("aria-invalid");
  errEl.setAttribute("hidden", "");
  errEl.textContent = "";
}
