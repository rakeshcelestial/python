const API_KEY = "YOUR_API_KEY"; // replace

export async function getWeather(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );

  if (!res.ok) throw new Error("City not found");

  const data = await res.json();

  return {
    city: data.name,
    temp: data.main.temp,
    condition: data.weather[0].main,
    humidity: data.main.humidity,
    wind: data.wind.speed,
  };
}