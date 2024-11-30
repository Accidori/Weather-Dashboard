import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();
//creating the variables
const app = express();
const PORT = process.env.PORT || 3001;
// Middleware to parse JSON
app.use(express.json());
// Serve static files from the 'client/dist' directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../client/dist')));
// Example route
app.get('/api/weather/history', (req, res) => {
    res.json({ message: 'Weather history' });
});
// Handle all other routes by serving the index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});
//Sends the port to the console :o
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
