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
let searchHistory = [];

// Load search history from localStorage
loadStoredSearches()

function createSearchBtn(name) {
    if (name && !searchHistory.includes(name)) {
        const newBtn = document.createElement("button");
        newBtn.textContent = name;
        newBtn.classList.add("btn", "btn-block", "search-button", "prev-search");
        newBtn.addEventListener("click", event => {
            event.preventDefault();
            fetchForecast(name); // Get fresh forecast data
        });
        searchHistory.push(name);
        inputGroup.appendChild(newBtn)

    } else if (searchHistory.includes(name)) {
        console.log("NOPE");
    }
};

// Render initial city forecast
fetchForecast("London");

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
    // Render today's forecast
    let today = data.list[0]; // Get current day midday forecast

    todayH2.textContent = `${data.city.name} (${dayjs(today.dt_txt).format("DD/MM/YYYY")})`;
    todayIcon.innerHTML = `<img width="50px" height="auto" src="assets/images/icons/${today.weather[0].icon}.png"/>`;
    todayTemp.textContent = `Temp: ${(today.main.temp - 273.15).toFixed(2)} °C`;
    todayWind.textContent = `Wind: ${today.wind.speed} KPH`;
    todayHumidity.textContent = `Humidity: ${today.main.humidity} %`;

    // Populate the 5-day forecast container with cards containing OWM forecast data
    cardContainer.innerHTML = "";

    // Create a new array from next 5 days'forecast data (today excluded)
    let fiveDayArr = Array(data.list[18], data.list[18], data.list[15], data.list[20], data.list[25]);
    console.log(data)

    fiveDayArr.forEach(day => {
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
        console.log(day);
        cardContainer.appendChild(cardItem);
    });

    // Add new search button to past searches container
    createSearchBtn(data.city.name);
};

// If input exists and name isn't in searchHistory, create a new search button and add to container
function createSearchBtn(name) {
    if (name) {
        const newBtn = document.createElement("button");
        newBtn.textContent = name;
        newBtn.classList.add("btn", "btn-block", "search-button", "prev-search");
        newBtn.addEventListener("click", event => {
            event.preventDefault();
            fetchForecast(name); // Get fresh forecast data
        });
        let storedSearches = JSON.parse(localStorage.getItem("storedSearches"));
        storedSearches.push(name);
        localStorage.setItem("storedSearches", JSON.stringify(storedSearches));
        inputGroup.appendChild(newBtn)

    } else if (searchHistory.includes(name)) {
        console.log("NOPE");
    }
};

// Render search entries from localStorage 
function loadStoredSearches() {
    if (!localStorage.getItem("storedSearches") === null) {
        let searchHistory = JSON.parse(localStorage.getItem("storedSearches"));
        console.log("exists");

        [...searchHistory].forEach(item => {
            createSearchBtn(item);
            console.log("SEE THIS", searchHistory[item])
        });
    } else {
        let storedSearches = [];
        localStorage.setItem("storedSearches", JSON.stringify(storedSearches));
    }
};


// TO DO
// 1. Render buttons
// 2. Fix forecast data processing
// 4. Screen sizes