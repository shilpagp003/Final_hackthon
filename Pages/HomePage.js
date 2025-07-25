import { expect } from "@playwright/test";
import fs from "fs";

export class HondaPage {
  constructor(page) {
    this.page = page;
    this.upcomingBikes = this.page.locator(".upcoming-bike-tab");
    this.allUpcomingBikes = this.page.getByTitle("All Upcoming Bikes");
    this.hondaFilter = this.page.locator("//a[normalize-space()='Honda']");
    this.bikeNames = this.page.locator(
      "//div[@class='p-15 pt-10 mke-ryt rel']//a"
    );
    this.bikeRates = this.page.locator(".b fnt-15");
    this.bikeExpectedDate = this.page.locator("//div[@class='clr-try fnt-14']");
  }
  async navigateToUrl(baseURL) {
    await this.page.goto(baseURL, { waituntil: "networkidle" });
  }
  async assertNavigationSuccess() {
    await expect(this.page).toHaveURL(/zigwheels\.com/);
    await expect(this.page).toHaveTitle(/ZigWheels/);
  }
  async upcomingBikesFilter() {
    await this.page.waitForTimeout(5000);
    await this.upcomingBikes.waitFor();
    await this.upcomingBikes.scrollIntoViewIfNeeded();
    await expect(this.upcomingBikes).toBeVisible();
    await this.upcomingBikes.click();
  }

  async upcomingHondaBike() {
    await this.page.waitForTimeout(2000);
    await this.allUpcomingBikes.click();
    await this.hondaFilter.click();
  }

  async bikeData() {
    const allbikecards = await this.page.locator("#modelList li.modelItem");
    const allBikes = [];
    const selectedBikes = [];
    const count = await allbikecards.count();
    for (let i = 0; i < count; i++) {
      const price = await allbikecards.nth(i).getAttribute("data-price");
      const bikeName = await allbikecards
        .nth(i)
        .locator(".lnk-hvr.block")
        .innerText();
      const dateExpected = await allbikecards
        .nth(i)
        .locator(".clr-try.fnt-14")
        .innerText();
      const bikeDetails = {
        BikeName: bikeName,
        BikePrice: price,
        BikeExpectedDate: dateExpected,
      };
      allBikes.push(bikeDetails); 

      if (price !== null && price < 400000) {
        selectedBikes.push(bikeDetails); 
      }
    }
    const combinedJson = {
      allBikes,
      selectedBikes,
    };
    fs.writeFileSync(
      "Utils/output.json",
      JSON.stringify(combinedJson, null, 2)
    );
  }
}
