const weatherCodes = {
  0: "Clear Sky",
  1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
  45: "Foggy", 48: "Depositing Rime Fog",
  51: "Light Drizzle", 53: "Moderate Drizzle", 55: "Dense Drizzle",
  61: "Slight Rain", 63: "Moderate Rain", 65: "Heavy Rain",
  80: "Slight Rain Showers", 81: "Moderate Rain Showers", 82: "Violent Rain Showers",
  95: "Thunderstorm"
};

async function getWeather() {
  const city = document.getElementById('cityInput').value.trim();
  const errorMsg = document.getElementById('errorMsg');
  
  if (!city) return;

  try {
    errorMsg.style.display = 'none';

    // 1. Geocoding API to convert City Name -> Latitude & Longitude
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error('City not found');
    }

    const { latitude, longitude, name, country_code } = geoData.results[0];

    // 2. Open-Meteo API to get live weather using coordinates
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`);
    const weatherData = await weatherRes.json();

    const current = weatherData.current;

    // Update UI Elements
    document.getElementById('cityName').innerText = `${name}, ${country_code || ''}`;
    document.getElementById('tempDisplay').innerText = `${Math.round(current.temperature_2m)}°C`;
    document.getElementById('humidity').innerText = `${current.relative_humidity_2m}%`;
    document.getElementById('windSpeed').innerText = `${Math.round(current.wind_speed_10m)} km/h`;
    document.getElementById('weatherDesc').innerText = weatherCodes[current.weather_code] || "Moderate Weather";

  } catch (err) {
    errorMsg.style.display = 'block';
  }
}

// Allow search on Enter key press
document.getElementById('cityInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') getWeather();
});

// Load default city weather on page startup
getWeather();