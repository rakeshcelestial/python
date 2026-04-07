export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function validateCity(name) {
  return /^[A-Za-z ]{2,}$/.test(name);
}