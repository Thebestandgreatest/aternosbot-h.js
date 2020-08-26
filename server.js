const http = require("http");

const get_status = callback => {
  const puppeteer = require("puppeteer");
  (async () => {
    const browser = await puppeteer.launch({
     args: ['--no-sandbox', '--disable-setuid-sandbox']
  }) //if on glitch use args: ["--no-sandbox", "--disable-setuid-sandbox"]
    const page = await browser.newPage();
    await page.setRequestInterception(true);

    page.on("request", req => {
      if (req.resourceType() === "image" || req.resourceType() === "font") {
        req.abort();
      } else {
        req.continue();
      }
    });
    await page.goto(process.env.SERVERLINK.toString());
    await page.waitForSelector("div[class=status]");
    const result = await page.evaluate(
      () => document.querySelector(".status-label").innerText
    );
    await page.close();
    await browser.close();
    callback(result);
  })();
};

//start server-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const start_server = (callback) => {
  const puppeteer = require("puppeteer");

  (async () => {
    console.log("Starting");
    const browser = await puppeteer.launch({
     args: ['--no-sandbox', '--disable-setuid-sandbox']
  })  //if on glitch use args: ["--no-sandbox", "--disable-setuid-sandbox"]
    const page = await browser.newPage();
    await page.setRequestInterception(true);

    page.on("request", req => {
      if (req.resourceType() === "image" || req.resourceType() === "font") {
        req.abort();
      } else {
        req.continue();
      }
    });

    //signs in as you
      await page.goto("https://aternos.org/go");
      await page.type("input", process.env.USERNAME); //use process.env.USERNAME if using glitch
      await page.type("input[type=password]", process.env.PASSWORD); //use process.env.PASSWORD if using glitch
      await page.click('[id="login"]');

      //goes to your server and starts it
      await page.waitForSelector("div[class=server-body]");
      await page.click("div[class=server-body]");
      await page.waitForNavigation({ waitUntil: "load" });
      await page.click("div[id=start]");
      var state = await page.evaluate(
        () => document.querySelector("[id=nope]").innerText
      );
      try {
        await page.waitForSelector("div[id=confirm]", {timeout: 300000});
        await page.click("div[id=confirm]");
      } catch {

      }
      await page.close();
      await browser.close();
  })();
};

//get players--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const get_players = callback => {
  const puppeteer = require("puppeteer");
  (async () => {
    const browser = await puppeteer.launch({
     args: ['--no-sandbox', '--disable-setuid-sandbox']
  })   //if on glitch use args: ["--no-sandbox", "--disable-setuid-sandbox"]
    const page = await browser.newPage();
    await page.setRequestInterception(true);

    page.on("request", req => {
      if (req.resourceType() === "image" || req.resourceType() === "font") {
        req.abort();
      } else {
        req.continue();
      }
    });
    await page.goto(process.env.SERVERLINK.toString());
    await page.waitForSelector("div[class=status]");
    const result = await page.evaluate(
      () => document.querySelector(".info-label").innerText
    );
    await page.close();
    await browser.close();

  var playerlist = [];
  callback(playerlist);
  })();
};


//exports all the functions so in index.js you can use them as Server.get_status
exports.get_status = get_status;
exports.start_server = start_server;
exports.get_players = get_players;
