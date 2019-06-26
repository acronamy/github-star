/**
 * @file Leverages pupeteer to check that the app is served and intact
 */

// Allow acceptance test to work standalone
if ( process.cwd().includes('packages') ) {
  process.chdir('../../');
}

const puppeteer = require('puppeteer');
const { config } = require('../../app-server/package.json');

const { hostname, protocol, port } = config.server;

// True constants
const APP_URL = `${protocol}://${hostname}:${port}/JavaScript`;
const SELECTOR = '.str-Date';

describe('Automated acceptance tests', () => {
  // en-GB iso is hard coded
  test('Should display a date: numeric (D) / long (M) / numeric (Y).', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(APP_URL);
    await page.waitForSelector(SELECTOR);
    const el = await page.$(SELECTOR);
    await el.screenshot({ path: 'screenshots/chrome__component-date.png' });
    await browser.close();
  });
});