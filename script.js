const input = document.querySelector("#input");
const btn = document.querySelector("button");

btn.addEventListener('click', () => {
    const city = input.value;
    getWeather(city)
});

const apiKey = "5d84c68f5000096d6b5c45a734fe3345";

async function getWeather(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
    const data = await response.json()
    console.log(data)
}