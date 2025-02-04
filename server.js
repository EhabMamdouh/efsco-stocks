
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = 3000;

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the web scraper! Go to /scrape to get the data.');
});

// Scrape route
app.get('/scrape', async (req, res) => {
    const url = 'https://www.arabfinance.com/Home/CompanyProfile?key=MFSC';

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const sharePrices = $('.profile-header-price').map((i, el) => $(el).text().trim()).get();
        const changePrices = $('.profile-header-change-percent.success').map((i, el) => $(el).text().trim()).get();
        const prices = $('.box-value').map((i, el) => $(el).text().trim()).get();
        const date = $('.profile-update-container').map((i, el) => $(el).text().trim()).get();

        const result = {
            share_prices: sharePrices,
            change_prices: changePrices,
            prices: prices,
            date: date
        };

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while scraping the data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});