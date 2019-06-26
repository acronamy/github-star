/**
 * @file Leverages pupeteer to check that the app is served and intact
 */

// Allow acceptance test to work standalone
if ( process.cwd().includes('packages') ) {
  process.chdir('../../');
}

const puppeteer = require('puppeteer');
const { config } = require('../package.json');

const { hostname, protocol, port } = config.server;

// True constants
const APP_URL = `${protocol}://${hostname}:${port}`;

describe('Automated acceptance tests', () => {
  test('should check that app is served.', async () => {
    jest.setTimeout(10000);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(APP_URL);
    await page.screenshot({ path: 'screenshots/chrome__app.png' });
    await browser.close();
  });
});