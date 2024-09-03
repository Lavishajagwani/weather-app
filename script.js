const input = document.querySelector("#city");
const btn = document.querySelector("#button");
const cityTemp = document.querySelector("#temperature");
const cityName = document.querySelector("#city-name");
const time = document.querySelector("#time");
const date = document.querySelector("#date");
const weatherIcon = document.querySelector("#icon");

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const apiKey1 = "5d84c68f5000096d6b5c45a734fe3345";
const apiKey2 = "TFSWYLO4IU32";

// Function to get current location
async function getCurrentLocation() {
  if (navigator.geolocation) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        resolve({ lat, lon });
      }, error => {
        reject(error);
      });
    });
  } else {
    return Promise.reject('Geolocation not supported');
  }
}

// Function to get current weather data
async function getCurrentWeather(lat, lon) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey1}`);
  const data = await response.json();
  return data;
}

// Function to get current time data
async function getCurrentTime(lat, lon) {
  const response = await fetch(`https://timeapi.io/api/time/current/coordinate?latitude=${lat}&longitude=${lon}`);
  const data = await response.json();
  return data;
}

// Function to update UI with current weather data
function updateUI(data, timeData) {
  const city = data.name;
  const temperature = Math.round(data.main.temp);
  const icon = data.weather[0].icon;
  const hours = timeData.time.slice(0,2);
  
  let amPm = '';
  if(hours < 12) {
    amPm = "AM";
  } else {
    amPm = "PM";
  }
  const currentTime = `${timeData.time} ${amPm}`;
  const dayOfWeek = timeData.dayOfWeek;
  const day = timeData.day;
  const month = months[timeData.month - 1];
  const year = timeData.year;
  const currentDate = `${dayOfWeek} ${day} ${month} ${year}`;

  cityName.textContent = city;
  cityTemp.textContent = `${temperature}°c`;
  time.textContent = currentTime;
  date.textContent = currentDate;

  const weatherImg = document.createElement("IMG");
  weatherImg.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  weatherIcon.innerHTML = ''; // Clear previous icon
  weatherImg.id = "img";
  weatherIcon.appendChild(weatherImg);
}

// Get current location and weather data
getCurrentLocation()
  .then(({ lat, lon }) => Promise.all([getCurrentWeather(lat, lon), getCurrentTime(lat, lon)]))
  .then(([data, timeData]) => updateUI(data, timeData))
  .catch(error => console.error(error));

btn.addEventListener('click', () => {
  const city = input.value;
  getWeather(city)
});

//get data for a location searched
async function getWeather(city) {
  const response1 = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey1}`)
  const data1 = await response1.json()

  weatherIcon.innerHTML = '';
  const icon = data1.weather[0].icon;
  const weatherImg = document.createElement("IMG");
  weatherImg.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  weatherImg.id = "img";
  weatherIcon.append(weatherImg);

  const kelvinTemp = data1.main.temp;
  const celsiusTemp = Math.round(kelvinTemp - 273.15);
  cityTemp.innerText = `${celsiusTemp}°c`

  const result = city.charAt(0).toUpperCase() + city.slice(1);
  cityName.innerText = result;

  const lon = data1.coord.lon;
  const lat = data1.coord.lat;
  
  const response2 = await fetch(`https://timeapi.io/api/time/current/coordinate?latitude=${lat}&longitude=${lon}`);
  const data2 = await response2.json();

  const hours = data2.time.slice(0,2);
  let amPm = '';
  if(hours < 12) {
    amPm = "AM";
  } else {
    amPm = "PM";
  }
  time.innerText = `${data2.time} ${amPm}`;

  for(let i=0;i<months.length;i++) {
    let month = data2.month;
    date.innerText = `${data2.dayOfWeek} ${data2.day} ${months[month-1]} ${data2.year}`
  }
}

