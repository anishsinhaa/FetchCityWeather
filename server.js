// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require('cors');

// Create an Express application
const app = express();
const port = 3000;

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse incoming JSON requests
app.use(bodyParser.json());

// API key for weather API
const apiKey = "abbb654e73cf4716819154154231412";
// URL for the weather API
const weatherApiUrl = "http://api.weatherapi.com/v1/current.json";

// Define a POST endpoint for fetching weather data
app.post("/getWeather", async (req, res) => {
    try {
      // Extract city names from the request body
      const cities = req.body.cities;
      
      // Use Promise.all to concurrently fetch weather data for each city
      const weatherPromises = cities.map(city =>
        axios.get(`${weatherApiUrl}?key=${apiKey}&q=${city}`)
      );
      
      // Wait for all promises to resolve
      const responses = await Promise.all(weatherPromises);

      // Process the responses and create a weatherData object
      const weatherData = {};
      responses.forEach((response, index) => {
        const city = cities[index];
        const temperature = response.data.current.temp_c;
        weatherData[city] = `${temperature}°C`;
      });

      // Log the weatherData and send it as JSON response
      console.log(weatherData);
      res.json(weatherData);
    } catch (error) {
      // Handle errors and send an error response
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
