import path from "path";
import fs from 'fs';
// Define a City class with name and id properties
class City {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }
}
// Complete the HistoryService class
class HistoryService {
    // Define a read method that reads from the searchHistory.json file
    async read() {
        const filePath = path.join(__dirname, 'searchHistory.json');
        try {
            const data = await fs.promises.readFile(filePath, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            console.error('Could not read search history:', error);
            throw error;
        }
    }
    // Define a write method that writes the updated cities array to the searchHistory.json file
    async write(cities) {
        const filePath = path.join(__dirname, 'searchHistory.json');
        try {
            const data = JSON.stringify(cities, null, 2);
            await fs.promises.writeFile(filePath, data, 'utf-8');
        }
        catch (error) {
            console.error('Could not write history', error);
            throw error;
        }
    }
    // Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
    async getCities() {
        return await this.read();
    }
    // Define an addCity method that adds a city to the searchHistory.json file
    async addCity(city) {
        const cities = await this.getCities();
        cities.push(city);
        await this.write(cities);
    }
    // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
    async removeCity(id) {
        const cities = await this.getCities();
        const updatedCities = cities.filter(city => city.id !== id);
        await this.write(updatedCities);
    }
}
export default new HistoryService();
