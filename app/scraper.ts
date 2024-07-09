import { Item } from "./page";

export async function Scraper(items: Item[]) {
  console.log("running Scraper");

  if (typeof window === "undefined") {
    const { chromium } = await import("playwright");
    console.log("running chromium");

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    const url = "https://www.k-ruoka.fi/kauppa/tuotehaku?haku=omena";
    try {
      await page.goto(url);
      console.log("making the screenshot");
      await page.screenshot({ path: "screenshot.png" });
      console.log("screenshot done");

      // Replace the following selectors with the actual HTML elements you want to scrape
      // const titleElement = await page.$("h1");
      // const descriptionElement = await page.$("p.description");
      // const title = await titleElement.textContent();
      // const description = await descriptionElement.textContent();
      // const inputElement = await page.$('input[type="text"]');
      // const value = await inputElement.inputValue();

      // console.log(value);
      // console.log("Title:", title);
      // console.log("Description:", description);
    } catch (error) {
      console.error("Error while scraping with playwright:", error);
    } finally {
      await browser.close();
    }
  }
}

export default Scraper;
