// ---------------Pseudo Code---------------
// when User searches for a city (clicks search button - click event):
//  - store the user input in a variable
//  - use a fetch api to get the current & future conditions for that city
//  - store that city into local storage

// use the data from fetch to populate in the current-weather container:
//  - The city name
//  - The date (DD/M/YYYY)
//  - An icon representation of weather conditions
//  - The temperature (Degs C)
//  - The wind speed (KPH)
//  - The humidity (%)

// use the data from fetch to populate in the 5 Day forecast container:
//  - The date (DD/M/YYYY)
//  - An icon representation of weather conditions
//  - The temperature (Degs C)
//  - The wind speed (KPH)
//  - The humidity (%)

// use data in local.storage to create a city button under the <hr> in search area for city history
//  - when you click the city button it displays the current and future conditions for that city

// ---------------- Global Variables -----------------------

// This is my API key
const apiKey = "f96c7a671884714421e9e81f5f24d150";

const currentWeatherSection = function (cityName) {
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

    fetch(queryURL)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log(queryURL);

            console.log(data);
            
            // Convert the temp to Celsius
            const tempC = data.main.temp - 273.15;

            console.log("Wind Speed: " + data.wind.speed);
            console.log("Humidity: " + data.main.humidity);
            console.log("Temperature (°C) " + tempC.toFixed(2));

            // Clear existing content
            $("#today").empty();

            // Create and append div for city
            const cityDiv = $("<div>").addClass("weather-info").text("City: " + data.name);
            $("#today").append(cityDiv);

            // Create and append div for wind
            const windDiv = $("<div>").addClass("weather-info").text("Wind: " + data.wind.speed + " m/s");
            $("#today").append(windDiv);

            // Create and append div for Temp
            const tempCDiv = $("<div>").addClass("weather-info").text("Temperature (°C): " + tempC.toFixed(2) + "°C");
            $("#today").append(tempCDiv);

            // Create and append div for humidity
            const humidityDiv = $("<div>").addClass("weather-info").text("Humidity: " + data.main.humidity + "%");
            $("#today").append(humidityDiv);
        })
};

// Click Event Function for search button
$("#search-button").on("click", function (event) {
    event.preventDefault();
    var cityName = $("#search-input").val();
    currentWeatherSection(cityName);
});