/**
 * @file Leverages pupeteer to check that the app is served and the api is returning the data in principle based on the query we will be using
 */

const puppeteer = require('puppeteer');
const { config } = require('../package.json');

const { hostname, protocol, port } = config.server;

// True constants
const APP_URL = `${protocol}://${hostname}:${port}`;

describe('Automated acceptance tests', () => {
  test('should check that app is served.', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(APP_URL);
    await page.screenshot({ path: 'screenshots/app.png' });
    await browser.close();
  });
  test('Check the Github Search Api is available', async () => {
    // Arrange
    const URL = 'https://api.github.com/';
    const BAD_DATA_IF_MESSAGE = 'message';
    // Act
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(URL);
    // wait for content then parse json
    await page.content();
    const JSON_RES = await page.evaluate(() => {
        return JSON.parse(document.querySelector('body').innerText); 
    });
    // Assert
    if (BAD_DATA_IF_MESSAGE in JSON_RES) {
      fail(JSON_RES[BAD_DATA_IF_MESSAGE]);
    }

    await page.screenshot({ path: 'screenshots/github-search-endpoint-check.png' });
    await browser.close();
  });
});