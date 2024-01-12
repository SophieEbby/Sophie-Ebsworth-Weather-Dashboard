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