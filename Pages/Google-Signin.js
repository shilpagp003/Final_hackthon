import { expect } from "@playwright/test";
import { url } from "inspector";

export class GooglePage{
    constructor(page){
        this.page=page;
    }
    async NavigateUrl(url) {
        await this.page.goto(url);
    }
    async assertNavigationSuccess() {
      await expect(this.page).toHaveURL(/zigwheels\.com/);
      await expect(this.page).toHaveTitle(/ZigWheels/);
    }

    async loginWithGoogle(){  
        await this.page.waitForSelector(".h-sid.h-sid-s",{timeout:10000});
        await this.page.locator(".h-sid.h-sid-s").click();
    
        const googleBtn=this.page.locator("[data-track-label='Popup_Login/Register_with_Google']");
        await expect(googleBtn).toBeVisible({timeout:10000});
    
        const [newPage] = await Promise.all([
        this.page.waitForEvent("popup",{timeout:15000}),
        this.page.locator(".newgf-login").nth(1).click()
        ]);
        this.newPage = newPage;
    
        const emailBox=await this.newPage.waitForSelector("#identifierId",{timeout:10000,});
        expect(emailBox).not.toBeNull();
        expect(await emailBox.isVisible()).toBe(true);
        await emailBox.fill("dsfgjjif")
        const NextButton= await this.newPage.getByText("Next",{timeout:10000});
        expect(await NextButton.isVisible()).toBe(true);
        await NextButton.click();
        await this.newPage.waitForTimeout(5000);
        await this.newPage.screenshot({path:"Screenshots/google.jpg"});
    }

}