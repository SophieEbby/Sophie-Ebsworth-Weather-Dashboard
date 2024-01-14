// ---------------Pseudo Code---------------
// when User searches for a city (clicks search button - click event):
//  - store the user input in a variable
//  - use a fetch api to get the current & future conditions for that city
//  - store that city into local storage

// use the data from fetch to populate in the current-weather container:
//!  - The city name
//  - The date (DD/M/YYYY)
//  - An icon representation of weather conditions
//!  - The temperature (Degs C)
//!  - The wind speed (KPH)
//!  - The humidity (%)

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
            const windDiv = $("<div>").addClass("weather-info").text("Wind: " + data.wind.speed + " KPH");
            $("#today").append(windDiv);

            // Create and append div for Temp
            const tempCDiv = $("<div>").addClass("weather-info").text("Temperature (°C): " + Math.round(tempC) + "°C");
            $("#today").append(tempCDiv);

            // Create and append div for humidity
            const humidityDiv = $("<div>").addClass("weather-info").text("Humidity: " + data.main.humidity + "%");
            $("#today").append(humidityDiv);
        })
};

var fiveDayForecastSection = function (cityName) {
    // get and use data from open weather current weather api end point
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
        // get response and turn it into objects
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            // get city's longitude and latitude
            var cityLon = response.coord.lon;
            var cityLat = response.coord.lat;

            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&appid=${apiKey}`)
                // get response from one call api and turn it into objects
                .then(function (response) {
                    return response.json();
                })
                .then(function (response) {
                    console.log(response);

                    // add 5 day forecast title
                    var futureForecastTitle = $("#forecast");
                    futureForecastTitle.text("5-Day Forecast:")
                    // using data from response, set up each day of 5 day forecast
                    for (var i = 1; i <= 5; i++) {
                        // Create a new card container
                        var futureCard = $("<div>").addClass("future-card future-card-details");

                        // Append the card container to the forecast section
                        $("#forecast").append(futureCard);

                        // add date to 5 day forecast
                        var futureDate = $("<div>").addClass("future-date").attr("id", "future-date-" + i);
                        date = dayjs().add(i, "d").format("D/M/YYYY");
                        futureDate.text(date);
                        futureCard.append(futureDate);

                        // add icon to 5 day forecast
                        var futureIcon = $("<img>").addClass("future-icon");
                        var futureIconCode = response.list[i].weather[0].icon;
                        futureIcon.attr("src", `https://openweathermap.org/img/wn/${futureIconCode}@2x.png`);
                        futureCard.append(futureIcon);

                        // add temp to 5 day forecast
                        const tempC = response.list[i].main.temp - 273.15;
                        var futureTemp = $("<div>").addClass("future-temp").attr("id", "future-temp-" + i);
                        futureTemp.text("Temp: " + Math.round(tempC) + "°C"); // Rounded to the nearest whole number
                        futureCard.append(futureTemp);

                        // add humidity to 5 day forecast
                        var futureHumidity = $("<div>").addClass("future-humidity").attr("id", "future-humidity-" + i);
                        futureHumidity.text("Humidity: " + Math.round(response.list[i].main.humidity) + "%");
                        futureCard.append(futureHumidity);

                    }
                })
        })
};


// Click Event Function for search button
$("#search-button").on("click", function (event) {
    event.preventDefault();
    var cityName = $("#search-input").val();
    currentWeatherSection(cityName);
    fiveDayForecastSection(cityName);
});