import { test, expect, chromium } from "@playwright/test";
import { HondaPage } from "../Pages/HomePage";
import { UsedCars } from "../Pages/UsedCarsPage";
import fs from "fs";
import path from "path";
import { GooglePage } from "../Pages/Google-Signin";
const testData = require("../Utils/InputData.json");

// Reset JSON once per test suite
const FILE_PATH = path.join(__dirname, "../Utils/output.json");
const FILE_PATH1 = path.join(__dirname, "../Utils/UsedCars.json");

test.describe("ZigWheels total pages", async () => {
  let browser;
  let context;
  let page;
  let home;
  let google;
  let cars;

  test.beforeAll(async () => {
    // Reset the JSON file before tests run
    browser = await chromium.launch({ args: ["--start-maximized"] });
    context = await browser.newContext({
      viewport: null,
      deviceScaleFactor: undefined,
    });
    page = await context.newPage();
    fs.writeFileSync(FILE_PATH, JSON.stringify([], null, 2));
    fs.writeFileSync(FILE_PATH1, JSON.stringify([], null, 2));
    console.log(" cleares the json at the beginning of test suite");
    home = new HondaPage(page);
    cars = new UsedCars(page);
    google = new GooglePage(page);

    await home.navigateToUrl(testData.BaseURL);
    await cars.navigation(testData.BaseURL);
    await google.NavigateUrl(testData.BaseURL);
  });

  test("ZigWheels", async () => {
    //Home page Test Scenario
    await home.upcomingBikesFilter();
    await home.upcomingHondaBike();
    await home.bikeData();
  });

  test("Used Cars", async () => {
    // Usedcars page Test Scenario
    await cars.moreOption();
    await cars.usedCarsOption();
    await cars.preferredLocation(testData.CityName);
    await cars.popularBrands();
  });

  test("Google", async () => {
    // Google sign in  page Test Scenario
    await google.loginWithGoogle();
  });
});
