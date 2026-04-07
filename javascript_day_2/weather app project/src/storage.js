const KEY = "favorites";

export function saveFavorites(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function getFavorites() {
  return JSON.parse(localStorage.getItem(KEY)) || [];
}

export function setLastCity(city) {
  document.cookie = `lastCity=${city}; max-age=${7 * 86400}`;
}

export function getLastCity() {
  const match = document.cookie.match(/lastCity=([^;]+)/);
  return match ? match[1] : "";
}