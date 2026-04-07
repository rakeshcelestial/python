export function renderWeather(container, data) {
  container.textContent = "";

  const card = document.createElement("div");
  card.className = "card";

  card.textContent =
    `${data.city} - ${data.temp}°C - ${data.condition}`;

  container.appendChild(card);
}

export function renderFavorites(container, list) {
  container.textContent = "";

  const frag = document.createDocumentFragment();

  list.forEach(city => {
    const div = document.createElement("div");
    div.className = "card";
    div.textContent = city;

    const btn = document.createElement("button");
    btn.textContent = "Remove";
    btn.dataset.city = city;

    div.appendChild(btn);
    frag.appendChild(div);
  });

  container.appendChild(frag);
}