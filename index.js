const fs = require("fs");
const puppeteer = require("puppeteer");
const crawlers = require("./src/crawlers");

(async () => {
  /* create folder if not exists */
  const dirName = "dist";
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }

  /* headless config */
  let headless = true;
  if (process.env.NODE_ENV.trim() === "development") {
    headless = false;
  }

  const browser = await puppeteer.launch({
    headless,
    args: ["--start-maximized"],
    // devtools: true,
  });

  /* crawlers data */
  await crawlers(browser);

  if (process.env.NODE_ENV.trim() !== "development") {
    await browser.close();
  }
})();
