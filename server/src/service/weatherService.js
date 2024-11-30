import dotenv from 'dotenv';
dotenv.config();
// Define a class for the Weather object
class Weather {
    constructor(temperature, humidity, description) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.description = description;
    }
}
// Complete the WeatherService class
class WeatherService {
    constructor(baseUrl, apiKey, cityName) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
        this.cityName = cityName;
    }
    // Create fetchLocationData method
    async fetchLocationData(query) {
        try {
            const response = await fetch(query);
            if (!response.ok) {
                throw new Error('Failed to fetch location data');
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.log('Fetch location data failed:', error);
            throw error;
        }
    }
    // Create destructureLocationData method
    destructureLocationData(locationData) {
        const { latitude, longitude } = locationData.results[0].locations[0].latLng;
        return { latitude, longitude };
    }
    // Create buildGeocodeQuery method
    buildGeocodeQuery() {
        return `${this.baseUrl}/geocode/v1/json?q=${this.cityName}&limit=1&key=${this.apiKey}`;
    }
    // Create buildWeatherQuery method
    buildWeatherQuery(coordinates) {
        return `${this.baseUrl}/weather/1.0/report.json?product=observation&latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&key=${this.apiKey}`;
    }
    // Create fetchAndDestructureLocationData method
    async fetchAndDestructureLocationData() {
        const query = this.buildGeocodeQuery();
        const locationData = await this.fetchLocationData(query);
        return this.destructureLocationData(locationData);
    }
    // Create fetchWeatherData method
    async fetchWeatherData(coordinates) {
        try {
            const query = this.buildWeatherQuery(coordinates);
            const response = await fetch(query);
            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.log('Fetch weather data failed:', error);
            throw error;
        }
    }
    // Build parseCurrentWeather method
    parseCurrentWeather(response) {
        const { temp, rh, wx_phrase } = response.observations.location[0].observation[0];
        return new Weather(temp, rh, wx_phrase);
    }
    // Complete buildForecastArray method
    buildForecastArray(currentWeather, weatherData) {
        const forecastArray = weatherData.map((forecast) => {
            const { temp, rh, wx_phrase } = forecast;
            return new Weather(temp, rh, wx_phrase);
        });
        forecastArray.unshift(currentWeather);
        return forecastArray;
    }
    // Complete getWeatherForCity method
    async getWeatherForCity(city) {
        this.cityName = city;
        const coordinates = await this.fetchAndDestructureLocationData();
        const currentWeatherData = await this.fetchWeatherData(coordinates);
        const currentWeather = this.parseCurrentWeather(currentWeatherData);
        const forecastWeatherData = currentWeatherData.forecasts;
        const forecastArray = this.buildForecastArray(currentWeather, forecastWeatherData);
        return forecastArray;
    }
}
const baseUrl = process.env.BASE_URL || 'https://api.weather.com';
const apiKey = process.env.API_KEY || 'your_api_key';
const cityName = 'default_city';
export default new WeatherService(baseUrl, apiKey, cityName);
