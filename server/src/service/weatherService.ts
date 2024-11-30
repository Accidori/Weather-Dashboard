import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;

}

// Define a class for the Weather object
class Weather{
  temperature: number;
  wind: number;
  humidity: number;
  description: string;

  constructor(temperature: number, wind: number, humidity: number, description: string){
    this.temperature = temperature;
    this.wind = wind;
    this.humidity = humidity;
    this.description = description;
  }
}


// TODO: Complete the WeatherService class
class WeatherService {
  // Define the baseURL, API key, and city name properties
  private baseUrl: string;
  private apiKey: string;
  private cityName: string;

  constructor(){
    this.apiKey = process.env.API_KEY || '';
    this.cityName = process.env.CITY_NAME || 'San Diego';
    this.baseUrl = `https://api.openweathermap.org/data/2.5/`;
  }



  // Create fetchLocationData method
  private async fetchLocationData(query: string) {
    try {
      console.log(`Fetching data with query: ${query}`);
      const response = await fetch(query);
      console.log(`Response status: ${response.status}`);
      if (!response.ok) {
        throw new Error('Error fetching location data');
      }

      const data = await response.json();
      console.log(`Data received: ${JSON.stringify(data)}`);
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No data found');
      }
      return data;
    } catch (error) {
      console.error(`Error fetching location data: ${error}`);
      throw error;
    }
  }


  // Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
  }

  // Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseUrl}/weather?q=${this.cityName}&appid=${this.apiKey}`;

  }


  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseUrl}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
  }


  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string) {
    this.cityName = city;
    const query = this.buildGeocodeQuery();
    console.log(`Fetching location data with query: ${query}`);
    
    const locationData = await this.fetchLocationData(query);
    console.log(`Location data received: ${JSON.stringify(locationData)}`);
  
    if (!locationData || locationData.length === 0) {
      throw new Error('No data found');
    }
  
    const { lat, lon } = this.destructureLocationData(locationData[0]);
    return { lat, lon };
  }


  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    const response = await fetch(query);
    const data = await response.json();
    return data
  }


  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const { temp, humidity } = response.main;
    const { speed }= response.wind;
    const description = response.weather[0].description;
    return new Weather(temp, speed, humidity, description);
  }


  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    console.log(`Current Weather: ${JSON.stringify(currentWeather)}`);
    return weatherData.map((data) => {
      const { temp, humidity } = data.main;
      const { speed } = data.wind;
      const { description } = data.weather[0].description;
      return new Weather(temp, speed, humidity, description);
    });
  }


  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    const locationData = await this.fetchAndDestructureLocationData(city);
    const { lat, lon } = locationData;
    const weatherData: any = await this.fetchWeatherData({ lat, lon });

    const currentWeather = this.parseCurrentWeather(weatherData.list[0]); // Parse the first item for current weather
    const forecast = this.buildForecastArray(currentWeather, weatherData.list);
    return { currentWeather, forecast };
  }



}

export default new WeatherService();

