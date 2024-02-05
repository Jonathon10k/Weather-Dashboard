const searchBtn = document.getElementById("search-button");
const weatherInput = document.getElementById("search-input");
const cardContainer = document.querySelector(".card-container");
const todayBody = document.querySelector(".today-body");
const todayHeader = document.querySelector(".today-header");
const todayH2 = document.querySelector(".today-h2");
const todayIcon = document.querySelector(".today-icon");
const todayTemp = document.querySelector(".today-temp");
const todayWind = document.querySelector(".today-wind");
const todayHumidity = document.querySelector(".today-humidity");
const inputGroup = document.querySelector(".input-group-append");
const API_KEY = "b219bed2db60f86fada34f7841698d3e";
let restoredButtons = [];

// Load search history from localStorage
loadStoredSearches()

// Render initial city forecast


// Event listener for city search button
searchBtn.addEventListener("click", event => {
    event.preventDefault();

    if (weatherInput.value) {
        fetchForecast(weatherInput.value);
        weatherInput.value = "";
    } else {
        alert("Please enter a forecast location.");
    }
});

// Fetch forecast data from OpenWeatherMap API
function fetchForecast(city) {
    let queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + API_KEY;
    console.log(queryURL);
    fetch(queryURL)
        .then(response => response.json())
        .then(data => renderCards(data))
        .catch(error => console.error("Error:", error));
};

// Create and render forecast cards to browser
function renderCards(data) {

    // Get midday forecasts
    let forecasts = [];

    data.list.forEach(item => {
        let theHour = new Date(item.dt_txt).getHours();
        theHour === 12 && forecasts.push(item);
    });

    // Render today's forecast
    let today = forecasts[0]; // Get current day midday forecast

    todayH2.textContent = `${data.city.name} (${dayjs(today.dt_txt).format("DD/MM/YYYY")})`;
    todayIcon.innerHTML = `<img width="50px" height="auto" src="assets/images/icons/${today.weather[0].icon}.png"/>`;
    todayTemp.textContent = `Temp: ${(today.main.temp - 273.15).toFixed(2)} °C`;
    todayWind.textContent = `Wind: ${today.wind.speed} KPH`;
    todayHumidity.textContent = `Humidity: ${today.main.humidity} %`;
    cardContainer.innerHTML = "";

// Populate the 5-day forecast container with cards containing OWM forecast data
  forecasts.forEach(day => {
        let cardItem = document.createElement("div");
        cardItem.classList.add("forecast-card", "border", "border-secondary", "d-flex", "flex-column");
        cardItem.innerHTML =
            `<span class="forecast-date">${dayjs(day.dt_txt).format("DD/MM/YYYY")}</span>
            <span class="weather-icon"><img width="50px" src="assets/images/icons/${day.weather[0].icon}.png"/></span>
            <span class="forecast-temp">Temp: ${(day.main.temp - 273.15).toFixed(2)} °C</span>
            <span class="forecast-wind">Wind: ${day.wind.speed} KPH</span>
            <span class="forecast-humidity">Humidity: ${day.main.humidity} %</span>
            </div>
            `;

        cardContainer.appendChild(cardItem);
    });

    // Add new search button to past searches container
    createSearchBtn(data.city.name);
};

// If input exists and name isn't in searchHistory, create a new search button and add to container
function createSearchBtn(name) {

    if (name && !restoredButtons.includes(`${name}`)) {
        const newBtn = document.createElement("button");
        newBtn.textContent = name;
        newBtn.classList.add("btn", "btn-block", "search-button", "prev-search");
        newBtn.addEventListener("click", event => {
            event.preventDefault();
            fetchForecast(name); // Get fresh forecast data
        });
        restoredButtons.push(name);
        let storedSearches = JSON.parse(localStorage.getItem("storedSearches"));
        storedSearches.push(name);
        localStorage.setItem("storedSearches", JSON.stringify(storedSearches));
        inputGroup.appendChild(newBtn)

    } else if (restoredButtons.includes(`${name}`)) {
        console.log("Already exists");
    }
};

// Render search entries from localStorage 
function loadStoredSearches() {
    let storedSearches = JSON.parse(localStorage.getItem("storedSearches"));

    storedSearches.forEach(searchTerm => {
        createSearchBtn(searchTerm);
        restoredButtons.push(searchTerm);
    });
};


// TO DO
// 2. Fix forecast data processing
// 4. Screen sizes