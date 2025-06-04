const express = require('express');
const fs = require('fs').promises; // Using promises for async file operations
const request = require('request-promise-native'); // Use request-promise for async/await
const cheerio = require('cheerio');
const app = express();

app.get('/scrape', async (req, res) => {
  try {
    // URL for Anchorman 2
    const url = 'http://www.imdb.com/title/tt1229340/';

    const html = await request(url);
    const $ = cheerio.load(html);

    // Initialize data object
    let json = { title: "", release: "", rating: "" };

    $('.hero__primary-text').filter(function () {
      json.title = $(this).text().trim();
    });

    $('[data-testid="hero__sub-section"]').filter(function () {
      const releaseData = $(this).find('a[href*="/releaseinfo"]').text().trim();
      json.release = releaseData;
    });

    $('[data-testid="hero-rating-bar__aggregate-rating__score"]').filter(function () {
      json.rating = $(this).text().trim();
    });

    await fs.writeFile('output.json', JSON.stringify(json, null, 4));
    console.log('File successfully written! Check output.json in your project directory');

    res.send('Scraping complete! Check output.json file!');
  } catch (error) {
    console.error('Error during scraping:', error);
    res.status(500).send('Error during scraping. Check server logs for details.');
  }
});

app.listen(8081, () => {
  console.log('Server running on port 8081');
});

module.exports = app;