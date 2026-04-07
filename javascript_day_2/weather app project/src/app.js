import { debounce, validateCity } from "./utils.js";
import { getWeather } from "./api.js";
import {
  saveFavorites,
  getFavorites,
  setLastCity,
  getLastCity
} from "./storage.js";
import { renderWeather, renderFavorites } from "./ui.js";

const input = document.getElementById("search");
const weatherDiv = document.getElementById("weather");
const favDiv = document.getElementById("favorites");
const themeBtn = document.getElementById("themeToggle");

let favorites = getFavorites();

// -------- SEARCH --------
const handleSearch = debounce(async (value) => {
  if (!validateCity(value)) return alert("Invalid city");

  try {
    weatherDiv.textContent = "Loading...";

    const data = await getWeather(value);

    renderWeather(weatherDiv, data);
    setLastCity(value);

  } catch {
    alert("Error fetching weather");
  }
}, 300);

input.addEventListener("input", (e) => {
  handleSearch(e.target.value.trim());
});

// -------- FAVORITES --------
weatherDiv.addEventListener("click", () => {
  const city = input.value;
  if (!favorites.includes(city)) {
    favorites.push(city);
    saveFavorites(favorites);
    renderFavorites(favDiv, favorites);
  }
});

favDiv.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const city = e.target.dataset.city;

    if (confirm("Remove city?")) {
      favorites = favorites.filter(c => c !== city);
      saveFavorites(favorites);
      renderFavorites(favDiv, favorites);
    }
  }
});

// -------- THEME --------
themeBtn.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark"));
};

// Load theme
if (localStorage.getItem("theme") === "true") {
  document.body.classList.add("dark");
}

// -------- INIT --------
renderFavorites(favDiv, favorites);

const lastCity = getLastCity();
if (lastCity) {
  input.value = lastCity;
}