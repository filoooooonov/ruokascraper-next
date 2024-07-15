/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const puppeteerCore = require("puppeteer-core");
const { executablePath } = require("puppeteer");
const chrome = require("chrome-aws-lambda");

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// CLOUD FUNCTIONS

exports.scraper = onRequest({ cors: true }, async (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "GET, POST");
  response.set("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }

  console.log("running Scraper");
  console.log("Received body data:", request.body);

  console.log("running Scraper");
  const data = await request.body;
  const itemsList = data.items;
  console.log("Scraper received data", itemsList);

  try {
    const itemTitles = itemsList.map((item) => item.title);

    let products_skaupat = await runSKaupatScraper(itemTitles);

    console.log("Scraped this data for products_skaupat", products_skaupat);

    let products_kesko = await runKeskoScraper(itemTitles, itemsList);
    console.log("Scraped this data for products_kesko", products_kesko);

    await findCheapest(products_skaupat, products_kesko, itemTitles);
    // return Response.json({ skaupat: products_skaupat, kesko: products_kesko });

    async function runSKaupatScraper(itemTitles) {
      try {
        const products = {};
        const browser = await puppeteer.launch({
          args: chrome.args,
          executablePath: await chrome.executablePath,
          headless: chrome.headless,
        });
        const page = await browser.newPage();

        for (let i = 0; i < itemTitles.length; i++) {
          const url = `https://www.s-kaupat.fi/hakutulokset?queryString=${itemTitles[i]}&sort=price%3Aasc`;
          await page.goto(url, { waitUntil: "networkidle0" });

          await page.waitForSelector(".sc-67cf5218-0");
          // Get the price of the product
          let price_kpl = await page.evaluate(() => {
            const element = document.querySelector(
              '[data-test-id="product-price__unitPrice"]'
            );
            return element ? element.innerText : "Error: element not found";
          });
          price_kpl = price_kpl.replace(" €", "/kpl").replace(",", ".");

          let price_kilo = await page.evaluate(() => {
            const element = document.querySelector(
              '[data-test-id="product-card__productPrice__comparisonPrice"]'
            );
            return element ? element.innerText : "Error: element not found";
          });
          price_kilo = price_kilo.replace(" €", "").replace(",", ".");

          // Get the name of the product
          let name = await page.evaluate(() => {
            const element = document.querySelector(
              ".sc-e834173a-0.Ywezr.sc-e834173a-0.Ywezr.sc-462d0cbc-1.hvnOuI"
            );
            return element ? element.innerText : "Error: element not found";
          });

          let imageUrl = await page.evaluate(() => {
            const element = document.querySelector(
              ".sc-96a3776a-1.jgqcqd.sc-96a3776a-0.eamPkd"
            );
            return element ? element.src : "Error: element not found";
          });

          products[name] = [price_kpl, price_kilo, imageUrl];
        }
        await browser.close();
        return products;
      } catch (error) {
        console.log("Error in runSKaupatScraper", error);
        throw error;
      }
    }

    async function runKeskoScraper(itemTitle, items) {
      const products = {};
      const browser = await puppeteer.launch({
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless,
      });
      const page = await browser.newPage();

      for (let i = 0; i < items.length; i++) {
        const url = `https://www.k-ruoka.fi/kauppa/tuotehaku?haku=${itemTitle[i]}&orderBy=price-asc`;
        await page.goto(url);

        await page.screenshot({
          path: "full_page_screenshot.png",
          fullPage: true,
        });

        let price_kilo = await page.evaluate(() => {
          const element = document.querySelector(
            '[data-testid="product-unit-price"]'
          );
          return element.innerText;
        });
        price_kilo = price_kilo.replace(",", ".");

        let price_kpl = await page.evaluate(() => {
          const element = document.querySelector(
            '[data-testid="product-main-price-grid"]'
          );
          return element.innerText;
        });
        // const parts = price_kpl.split('\n').filter(part => part !== '');
        price_kpl = price_kpl
          .replace(/\s/g, "")
          .replace("n.", "")
          .replace(/^(\d+)(\d{2})\/(.*)$/, "$1.$2/$3");

        let name = await page.evaluate(() => {
          const element = document.querySelector(
            '[data-testid="product-card"] a'
          );
          return element?.title;
        });

        let imageUrl = await page.evaluate(() => {
          const element = document.querySelector(
            '[data-testid="product-card"] img'
          );
          return element.src;
        });

        products[name] = [price_kpl, price_kilo, imageUrl];
      }
      await browser.close();
      return products;
    }

    function findCheapest(products_skaupat, products_kesko, itemTitles) {
      const keysToRemoveKesko = [];
      const keysToRemoveSKaupat = [];

      // looping through all items
      for (let i = 0; i < itemTitles.length; i++) {
        const list_S = products_skaupat[Object.keys(products_skaupat)[i]];
        const price_kpl_S = parseFloat(
          list_S[0].replace("/kpl", "").replace(/^.*?(\d+(\.\d+)?)/, "$1")
        );
        const price_kilo_S = parseFloat(list_S[1].replace(/\/.*$/, ""));

        const list_K = products_kesko[Object.keys(products_kesko)[i]];
        const price_kpl_K = parseFloat(
          list_K[0].replace("/kpl", "").replace(/^.*?(\d+(\.\d+)?)/, "$1")
        );
        const price_kilo_K = parseFloat(list_K[1].replace(/\/.*$/, ""));

        // First compare prices by kilo
        if (price_kilo_K < price_kilo_S) {
          keysToRemoveSKaupat.push(Object.keys(products_skaupat)[i]);
        } else if (price_kilo_S < price_kilo_K) {
          keysToRemoveKesko.push(Object.keys(products_kesko)[i]);
        } else if (price_kilo_K == price_kilo_S) {
          console.log("Prices are the same");
          // Compare prices per kpl
          if (price_kpl_K < price_kpl_S) {
            keysToRemoveSKaupat.push(Object.keys(products_skaupat)[i]);
          } else if (price_kpl_S < price_kpl_K) {
            keysToRemoveKesko.push(Object.keys(products_kesko)[i]);
          }
        }
      }

      // Remove the products
      keysToRemoveKesko.forEach((key) => {
        delete products_kesko[key];
      });
      keysToRemoveSKaupat.forEach((key) => {
        delete products_skaupat[key];
      });
    }

    response.json({ skaupat: "exampleSkaupat", kesko: "exampleKesko" });
  } catch (error) {
    console.log(`Error during scraping: ${error}`);
    throw error;
  }
});
