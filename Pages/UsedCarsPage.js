import fs from "fs";
import { expect } from "@playwright/test";

export class UsedCars {
  constructor(page) {
    this.page = page;
    this.cityInput=this.page.getByPlaceholder("Enter Your City");
    this.suggestions=this.page.locator(".ui-menu-item");
  }
  async navigation(baseURL) {
     await this.page.goto(baseURL, {
      waituntil: "networkidle",
    });
  }
  async assertNavigationSuccess() {
    await expect(this.page).toHaveURL(/zigwheels\.com/);
    await expect(this.page).toHaveTitle(/ZigWheels/);
  }
  async moreOption() {
    await this.page.locator("//span[@class='c-p icon-down-arrow']").click();
    await this.page.waitForTimeout(1000);
  }
  async usedCarsOption(){  
    await this.page.locator("//ul[@class='txt-l']//li[1]").click();
  }

async preferredLocation(city) {
  await this.cityInput.click();
  await this.cityInput.fill("");
  await this.page.waitForTimeout(500); 
  await this.cityInput.type(city, { delay: 100 });

  // Wait for suggestion list to appear
  await  this.suggestions.first().waitFor({ state: "visible", timeout: 20000 });
  await  this.suggestions.screenshot({path:"Screenshots/CItyInput.jpg"});
  // Assert there are suggestions
  const count = await  this.suggestions.count();
  expect(count).toBeGreaterThan(0); 

  await  this.suggestions.first().click(); 
  await this.page.waitForTimeout(1000); 
}

  async assertCityInputVisible() {
    await expect(this.cityInput).toBeVisible();
    await expect(this.cityInput).toBeEnabled();
  }
  
  async assertSuggestionsAvailable() {
    await expect(this.suggestions).toBeVisible();
  }
  
  async popularBrands() {
        const carBrands = this.page.locator(".popularModels li");
        const count = await carBrands.count();
        let  result=[];
        for (let i = 0; i < count; i++) {
          let list_Brand_Name=[];
          await carBrands.nth(i).locator("label").click();
          await this.page.waitForTimeout(2000);
          const brandName=await carBrands.nth(i).innerText();
          const AvailableCars = await this.page.locator("#data-set-body >> .zw-sr-searchTarget");
          let count=await AvailableCars.count();
            for (let index = 0; index < count; index++) {
                const Car=await AvailableCars.nth(index)
                const Totaldivs=await Car.locator(".pl-30.zw-sr-paddingLeft >> *");
                const carName=await Totaldivs.nth(0).innerText();
                const carPrice=await Totaldivs.nth(0).getAttribute('data-price')
                list_Brand_Name.push({BrandName:carName, BrandPrice:carPrice});
            }
            result.push({[brandName]:list_Brand_Name});
            await carBrands.nth(i).locator("label").click();
        }
            fs.writeFileSync("Utils/UsedCars.json",JSON.stringify(result,null,2));
  }
}
