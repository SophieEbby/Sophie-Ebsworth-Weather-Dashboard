// ---------------Pseudo Code---------------
// when User searches for a city (clicks search button - click event):
//!  - store the user input in a variable
//!  - use a fetch api to get the current & future conditions for that city
//  - store that city into local storage

// use the data from fetch to populate in the current-weather container:
//!  - The city name
//!  - The date (DD/M/YYYY)
//!  - An icon representation of weather conditions
//!  - The temperature (Degs C)
//!  - The wind speed (KPH)
//!  - The humidity (%)

// use the data from fetch to populate in the 5 Day forecast container:
//!  - The date (DD/M/YYYY)
//!  - An icon representation of weather conditions
//!  - The temperature (Degs C)
//!  - The wind speed (KPH)
//!  - The humidity (%)

// use data in local.storage to create a city button under the <hr> in search area for city history
//  - when you click the city button it displays the current and future conditions for that city

// ---------------- Global Variables -----------------------

// This is my API key
const apiKey = "f96c7a671884714421e9e81f5f24d150";
var savedSearches = [];

// make list of previously searched cities
var searchHistoryList = function (cityName) {
    $('.past-search:contains("' + cityName + '")').remove();

    // create entry with city name
    var searchHistoryEntry = $("<p>");
    searchHistoryEntry.addClass("past-search");
    searchHistoryEntry.text(cityName);

    // create container for entry
    var searchEntryContainer = $("<div>");
    searchEntryContainer.addClass("past-search-container");

    // append entry to container
    searchEntryContainer.append(searchHistoryEntry);

    // append entry container to search history container
    var searchHistoryContainerEl = $("#history");
    searchHistoryContainerEl.append(searchEntryContainer);

    if (savedSearches.length > 0) {
        // update savedSearches array with previously saved searches
        var previousSavedSearches = localStorage.getItem("savedSearches");
        savedSearches = JSON.parse(previousSavedSearches);
    }

    // add city name to the array of saved searches
    savedSearches.push(cityName);
    localStorage.setItem("savedSearches", JSON.stringify(savedSearches));

    // reset search input
    $("#search-input").val("");
};

var loadSearchHistory = function () {
    // get saved search history
    var savedSearchHistory = localStorage.getItem("savedSearches");

    // initialize savedSearches if null or undefined
    savedSearches = savedSearchHistory ? JSON.parse(savedSearchHistory) : [];

    // go through savedSearches array and make an entry for each item in the list
    for (var i = 0; i < savedSearches.length; i++) {
        searchHistoryList(savedSearches[i]);
    }
};

var currentWeatherSection = function (cityName) {
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

    // get and use data from open weather current weather api end point
    fetch(queryURL)
        // get response and turn it into objects
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            // get city's longitude and latitude
            var cityLon = response.coord.lon;
            var cityLat = response.coord.lat;

            const queryURL2 = `https://api.openweathermap.org/data/2.5/weather?lat=${cityLat}&lon=${cityLon}&appid=${apiKey}`;

            fetch(queryURL2)
                // get response from one call api and turn it into objects
                .then(function (response) {
                    return response.json();
                })
                // get data from response and apply them to the current weather section

                .then(function (response) {
                    console.log(response);
                    // Create a new current weather container
                    var currentWeatherContainer = $("<div>").addClass("current-weather-container");

                    // add city name, date, and weather icon to current weather section title
                    var currentTitle = $("<h2>").addClass("current-title");
                    var currentDay = dayjs().format("D/M/YYYY");
                    currentTitle.text(`${cityName} (${currentDay})`);

                    var currentIcon = $("<img>").addClass("current-weather-icon");
                    var currentIconCode = response.weather[0].icon;
                    currentIcon.attr("src", `https://openweathermap.org/img/wn/${currentIconCode}@2x.png`);

                    currentTitle.append(currentIcon);
                    currentWeatherContainer.append(currentTitle);

                    // Convert the temp to Celsius
                    const tempC = response.main.temp - 273.15;

                    // add current temperature to page
                    var currentTemperature = $("<div>").addClass("current-temperature");
                    currentTemperature.text("Temp: " + Math.round(tempC) + " °C"); // Rounded to two decimal places
                    currentWeatherContainer.append(currentTemperature);

                    // add current wind speed to page
                    var currentWindSpeed = $("<div>").addClass("current-wind-speed");
                    currentWindSpeed.text("Wind: " + (response.wind.speed * 3.6).toFixed(2) + " KPH");
                    currentWeatherContainer.append(currentWindSpeed);

                    // add current humidity to page
                    var currentHumidity = $("<div>").addClass("current-humidity");
                    currentHumidity.text("Humidity: " + response.main.humidity + "%");
                    currentWeatherContainer.append(currentHumidity);

                    // Append the currentWeatherContainer to the element with ID 'today'
                    $("#today").append(currentWeatherContainer);
                })
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

                    // Clear existing content in the forecast section
                    $("#forecast").empty();

                    // Add 5 day forecast title
                    var futureForecastTitle = $("<h2>").addClass("future-forecast-title");
                    futureForecastTitle.text("5-Day Forecast:");
                    $("#forecast").append(futureForecastTitle);

                    // Create a container for forecast cards
                    var forecastCardsContainer = $("<div>").addClass("row mt-3");
                    $("#forecast").append(forecastCardsContainer);


                    // using data from response, set up each day of 5 day forecast
                    for (var i = 1; i <= 5; i++) {
                        // Create a new card container
                        var futureCard = $("<div>").addClass("col-md-2 future-card future-card-details");

                        // Append the card container to the forecast cards container
                        forecastCardsContainer.append(futureCard);

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
                        futureTemp.text("Temp: " + Math.round(tempC) + " °C"); // Rounded to the nearest whole number
                        futureCard.append(futureTemp);

                        // add wind to 5 day forecast
                        var futureWind = $("<div>").addClass("future-wind").attr("id", "future-wind-" + i);
                        futureWind.text("Wind: " + (response.list[i].wind.speed * 3.6).toFixed(2) + " KPH");
                        futureCard.append(futureWind);

                        // add humidity to 5 day forecast
                        var futureHumidity = $("<div>").addClass("future-humidity").attr("id", "future-humidity-" + i);
                        futureHumidity.text("Humidity: " + Math.round(response.list[i].main.humidity) + " %");
                        futureCard.append(futureHumidity);

                    }
                })
        })
};

// called when the search form is submitted
$("#search-form").on("submit", function(event) {
    event.preventDefault();
    
    // get name of city searched
    var cityName = $("#search-input").val();

    if (cityName === "" || cityName == null) {
        //send alert if search input is empty when submitted
        alert("Please enter name of city.");
        event.preventDefault();
    } else {
        // if cityName is valid, add it to search history list and display its weather conditions
        currentWeatherSection(cityName);
        fiveDayForecastSection(cityName);
    }
});

// called when a search history entry is clicked
$("#history").on("click", "p", function() {
    // get text (city name) of entry and pass it as a parameter to display weather conditions
    var previousCityName = $(this).text();
    currentWeatherSection(previousCityName);
    fiveDayForecastSection(previousCityName);

    //
    var previousCityClicked = $(this);
    previousCityClicked.remove();
});

loadSearchHistory();