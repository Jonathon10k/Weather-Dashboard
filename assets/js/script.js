let searchBtn = document.getElementById("search-button");
let weatherInput = document.getElementById("search-input");
let API_KEY = "b219bed2db60f86fada34f7841698d3e";
let queryCity = "London"
let queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + queryCity  + "&appid=" + API_KEY;


searchBtn.addEventListener("click", (event) => {
    event.preventDefault();

    if (weatherInput.value !== "") {
        fetchForecast();
    } else {
        alert("Please enter a location to search for.");
  }
    
});


function fetchForecast() {
    fetch(queryURL)
        .then(response => response.json())
        .then(data => renderCards(data))
        .catch(error => console.error("Error:", error));

}

function renderCards(data) {
    console.log("2", data);
}
