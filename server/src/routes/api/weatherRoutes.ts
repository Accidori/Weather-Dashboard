import { Router, Request, Response } from 'express';
import WeatherService from '../../service/weatherService.js';
import HistoryService from '../../service/historyService.js';
const router = Router();


// POST Request with city name

// to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  // // GET weather data from city name
  // // save city to search history

  //
  const currentData = await WeatherService.getWeatherForCity(req.body.cityName);
  const forcastData = '';

  const weatherData = [currentData, forcastData];

  res.json(weatherData);






  // try {
  //   const cityName = req.body.city;
  //   const weatherData = await WeatherService.getWeatherForCity(cityName);
  //   await HistoryService.addCity(cityName);
  //   res.status(200).json(weatherData);
  // } catch (error){
  //   res.status(500).json({ error: 'An error occurred while retrieving weather data.'});
  // }



});

// GET search history
router.get('/history', async (_, res) => {
  try {
    const history = await HistoryService.getCities();
    res.status(200).json(history);
  } catch (error){
    res.status(500).json({ error: 'An error occurred while retrieving search history.'});
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  try{
    const cityId = req.params.id;
    const remove = await HistoryService.removeCity(cityId);
    res.status(200).json(remove);
  }catch (error){
    res.status(500).json ({error: 'Failed to delete from search history.'})
  }
  
});

export default router;
