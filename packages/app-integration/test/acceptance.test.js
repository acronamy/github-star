const puppeteer = require('puppeteer');
const config = require('../package.json');

describe("Automated acceptance tests", () => {
    test("should check that app is served", async () => {
        
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('http://localhost:3030');
        await page.screenshot({path: './screenshots/app.png'});
        
        await browser.close();
    });
});