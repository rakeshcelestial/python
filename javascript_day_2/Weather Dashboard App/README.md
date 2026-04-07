# ⛅ Nimbus — Weather Dashboard

A production-grade, browser-based Weather Dashboard demonstrating mastery of all Day-2 JS concepts. Built with vanilla ES6 modules, zero dependencies, no bundler required.

---

## 🚀 Quick Start

```bash
# Serve with any static server (required for ES modules):
npx serve .
# or
python3 -m http.server 8080
# then open http://localhost:8080
```

> **Note**: Uses [Open-Meteo](https://open-meteo.com/) — **completely free, no API key needed!**

---

## 📁 Architecture

```
weather-dashboard/
├── index.html          # Semantic HTML shell with ARIA
├── style.css           # Full CSS with light/dark theme tokens
├── types.ts            # TypeScript interfaces (bonus)
└── js/
    ├── api.js          # Fetch layer — Geocoding + Weather API
    ├── storage.js      # Persistence — localStorage + cookies
    ├── state.js        # Observer pattern — reactive state store
    ├── ui.js           # DOM manipulation — cards, toasts, spinner
    ├── utils.js        # Debounce, validation, animation, helpers
    └── app.js          # Orchestrator — events, delegation, init
```

---

## ✅ Day-2 Concepts Checklist

| Concept | Implementation |
|---|---|
| **DOM Selection & Manipulation** | `ui.js` builds all elements with `document.createElement` — no `innerHTML` for user data |
| **Event Handling & Delegation** | Single listener on `#favorites-list` handles all load/remove actions; `Enter` key to search |
| **Event Bubbling** | Favorite star button inside weather card bubbles up to `#current-weather` listener |
| **Form Validation** | `validateCityName()` in `utils.js`; `aria-invalid` + error message shown/cleared |
| **alert / prompt / confirm** | `confirm()` dialog before removing a saved city |
| **Fetch API** | `api.js` uses `async/await`; graceful error handling with typed error messages |
| **Loading & Error States** | Spinner overlay on fetch; inline error card with ↺ Retry button |
| **localStorage** | Favorites array + theme preference persisted via `storage.js` |
| **Cookies** | Last searched city stored in a 7-day cookie; pre-fills search on reload |
| **JSON parse/stringify** | `storage.js` serializes/deserializes the favorites array |
| **Debounce** | 300ms debounce on search input for autocomplete suggestions |
| **ES6 Modules** | Split into `api.js`, `storage.js`, `ui.js`, `utils.js`, `state.js`, `app.js` |
| **Observer Pattern** | `state.js` implements pub/sub; components subscribe to state keys |
| **Accessibility** | ARIA labels, roles, `aria-live`, `aria-pressed`, `aria-invalid`, keyboard nav |
| **Performance** | `DocumentFragment` for rendering favorites list; `requestAnimationFrame` for fade-in |
| **TypeScript (Bonus)** | `types.ts` with `WeatherData`, `AppState`, `GeoResult`, `StorageService`, `UIService` interfaces |

---

## 🏗️ Design Patterns

### Observer Pattern (`state.js`)
```js
// Subscribe to state changes
subscribe('favorites', (favs) => {
  renderFavorites(favs);          // re-renders sidebar
  renderCurrentWeather(weather);  // updates star button
});

// Trigger update from anywhere
setState({ favorites: updatedList });
```

### Event Delegation (`app.js`)
```js
// One listener handles ALL favorite item interactions
favList.addEventListener('click', (e) => {
  const actionEl = e.target.closest('[data-action]');
  if (actionEl?.dataset.action === 'remove-favorite') { ... }
  if (actionEl?.dataset.action === 'load-favorite')  { ... }
});
```

### Debounce (`utils.js`)
```js
const debouncedSuggest = debounce(async (query) => {
  const results = await searchCities(query);
  showSuggestions(results, onSelect);
}, 300); // 300ms — only fires after user pauses typing
```

---

## 🎨 Design System

- **Font**: Syne (display/headings) + DM Sans (body)
- **Theme**: Refined glassmorphism dark mode, clean light mode
- **Colors**: Deep slate base with violet accent (`#7c6af7`)
- **Animations**: CSS keyframe float, drift orbs, rAF fade-ins
- **Responsive**: Mobile-first, sidebar collapses to top bar

---

## 🔌 API Details

| API | Endpoint | Key Required |
|---|---|---|
| Open-Meteo Geocoding | `geocoding-api.open-meteo.com/v1/search` | ❌ None |
| Open-Meteo Weather | `api.open-meteo.com/v1/forecast` | ❌ None |

---

## 🔒 Security Notes

- No `innerHTML` used for any user-supplied data (XSS prevention)
- All user input is validated before API calls
- Cookie uses `SameSite=Lax` flag
