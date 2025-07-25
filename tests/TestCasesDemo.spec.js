import {test,expect,chromium} from "@playwright/test";
import {HondaPage} from "../Pages/HomePage"; 
import { UsedCars } from "../Pages/UsedCarsPage";
import { GooglePage } from "../Pages/Google-Signin";
import fs from "fs" ;
import path from "path";

const testData = require("../Utils/InputData.json");
const FILE_PATH = path.join(__dirname, "../Utils/output.json");
const FILE_PATH1 = path.join(__dirname, "../Utils/UsedCars.json");

let browser;
let context;
let page;
let home;
let cars;
let google;

test.beforeAll(async() => {
     browser = await chromium.launch({ args: ['--start-maximized'] });
     context = await browser.newContext({viewport:null,deviceScaleFactor: undefined});
     page = await context.newPage();

    home = new HondaPage(page);
    cars = new UsedCars(page);
    google = new GooglePage(page);
    
    await home.navigateToUrl(testData.BaseURL);
    await cars.navigation(testData.BaseURL);
    await google.NavigateUrl(testData.BaseURL);

  });

test.afterAll("Closing the Browser",async()=>{
    await browser.close();
});

test.describe('Honda Bikes Tests', () => {

    test.beforeAll(() => {
    fs.writeFileSync(FILE_PATH, JSON.stringify([], null, 2));
    });

    test('Navigation', async () => {
       await google.assertNavigationSuccess();
    });

    test('Navigate to Honda Page', async () => {
      await home.upcomingBikesFilter();
      await home.upcomingHondaBike();
      await expect(page).toHaveTitle(/Honda/i);
    });

    test('Apply Upcoming Bikes Filter', async () => {
      const urlBefore = page.url();
      await home.upcomingBikesFilter();
      await home.upcomingHondaBike();
      const urlAfter = page.url();
      expect(urlAfter).not.toEqual(urlBefore); 
    });

    test('Fetch Bike Data', async () => {
        await home.upcomingBikesFilter();
        await home.upcomingHondaBike();
        await home.bikeData();
    });

});

test.describe('Used Cars Tests', () => {

    test.beforeAll(() => {
      fs.writeFileSync(FILE_PATH1, JSON.stringify([], null, 2));
    });

    test('Navigate to Used Cars Page', async () => {
        await cars.navigation(testData.BaseURL);
        await google.assertNavigationSuccess();    
    });

    test('Filter by Popular Brands', async () => {
        await cars.moreOption();
        await cars.usedCarsOption();
        await cars.preferredLocation(testData.CityName);
        await cars.popularBrands();
    });

    test('Select Options', async () => {
        await cars.moreOption();
    });
        
    test('Choose Preferred Location', async () => {
        await cars.moreOption();
        await expect(page).toHaveTitle(/Used Cars/);
    });
});

test.describe('Google-sign in page Tests', () => {

    test("Google URL Navigation", async () => {
       await google.assertNavigationSuccess();
    });

    test("Google Sign in test ",async()=>{
      await google.loginWithGoogle();
    })
});
