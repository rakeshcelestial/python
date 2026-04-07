// api.js — Weather API module
// Uses Open-Meteo (free, no API key) + Geocoding API

const GEO_BASE = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_BASE = "https://api.open-meteo.com/v1/forecast";

/**
 * @typedef {Object} GeoResult
 * @property {number} id
 * @property {string} name
 * @property {number} latitude
 * @property {number} longitude
 * @property {string} country
 * @property {string} [country_code]
 * @property {string} [admin1]
 */

/**
 * @typedef {Object} WeatherData
 * @property {string} city
 * @property {string} country
 * @property {number} lat
 * @property {number} lon
 * @property {number} temperature
 * @property {number} feelsLike
 * @property {number} humidity
 * @property {number} windSpeed
 * @property {number} weatherCode
 * @property {string} condition
 * @property {string} icon
 * @property {boolean} isDay
 */

const WMO_CODES = {
  0:  { label: "Clear Sky",        icon: "☀️" },
  1:  { label: "Mainly Clear",     icon: "🌤️" },
  2:  { label: "Partly Cloudy",    icon: "⛅" },
  3:  { label: "Overcast",         icon: "☁️" },
  45: { label: "Foggy",            icon: "🌫️" },
  48: { label: "Icy Fog",          icon: "🌫️" },
  51: { label: "Light Drizzle",    icon: "🌦️" },
  53: { label: "Drizzle",          icon: "🌦️" },
  55: { label: "Heavy Drizzle",    icon: "🌧️" },
  61: { label: "Slight Rain",      icon: "🌧️" },
  63: { label: "Rain",             icon: "🌧️" },
  65: { label: "Heavy Rain",       icon: "🌧️" },
  71: { label: "Slight Snow",      icon: "🌨️" },
  73: { label: "Snow",             icon: "❄️" },
  75: { label: "Heavy Snow",       icon: "❄️" },
  77: { label: "Snow Grains",      icon: "🌨️" },
  80: { label: "Showers",          icon: "🌦️" },
  81: { label: "Rain Showers",     icon: "🌧️" },
  82: { label: "Violent Showers",  icon: "⛈️" },
  85: { label: "Snow Showers",     icon: "🌨️" },
  86: { label: "Heavy Snow Showers", icon: "❄️" },
  95: { label: "Thunderstorm",     icon: "⛈️" },
  96: { label: "Thunderstorm + Hail", icon: "⛈️" },
  99: { label: "Thunderstorm + Heavy Hail", icon: "⛈️" },
};

function getCondition(code) {
  // Find closest matching code
  if (WMO_CODES[code]) return WMO_CODES[code];
  const keys = Object.keys(WMO_CODES).map(Number).sort((a, b) => a - b);
  const closest = keys.reduce((prev, curr) =>
    Math.abs(curr - code) < Math.abs(prev - code) ? curr : prev
  );
  return WMO_CODES[closest] || { label: "Unknown", icon: "🌡️" };
}

/**
 * Search for cities by name
 * @param {string} query
 * @returns {Promise<GeoResult[]>}
 */
export async function searchCities(query) {
  const url = `${GEO_BASE}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding error: ${res.status}`);
  const data = await res.json();
  return data.results || [];
}

/**
 * Fetch weather for given coordinates
 * @param {number} lat
 * @param {number} lon
 * @param {string} city
 * @param {string} country
 * @returns {Promise<WeatherData>}
 */
export async function fetchWeather(lat, lon, city, country) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "weather_code",
      "wind_speed_10m",
      "is_day",
    ].join(","),
    wind_speed_unit: "kmh",
    timezone: "auto",
  });

  const url = `${WEATHER_BASE}?${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
  const data = await res.json();

  const c = data.current;
  const code = c.weather_code;
  const { label, icon } = getCondition(code);

  return {
    city,
    country,
    lat,
    lon,
    temperature: Math.round(c.temperature_2m),
    feelsLike: Math.round(c.apparent_temperature),
    humidity: c.relative_humidity_2m,
    windSpeed: Math.round(c.wind_speed_10m),
    weatherCode: code,
    condition: label,
    icon,
    isDay: c.is_day === 1,
  };
}

/**
 * Fetch weather by city name (geocodes first)
 * @param {string} cityName
 * @returns {Promise<WeatherData>}
 */
export async function fetchWeatherByCity(cityName) {
  const results = await searchCities(cityName);
  if (!results.length) throw new Error(`City not found: "${cityName}"`);
  const { name, country, latitude, longitude } = results[0];
  return fetchWeather(latitude, longitude, name, country);
}
