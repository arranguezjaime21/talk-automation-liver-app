import { MyPageSelectors } from "../../selectors/selectors.js";
import { BasePage } from "../base.js";

export class Logout extends BasePage{
    constructor(driver) {
        super(driver);
        this.selectors = MyPageSelectors
    }

    async userLogout () {
        try {
            await this.waitAndClick(this.selectors.myPageNav);
            await this.waitAndClick(this.selectors.myPageSettings);
            const logout = await this.waitAndFind(this.selectors.logoutBtn, 3000);
            for (let i =0; i < 10; i++) {
                await logout.click();
                await this.driver.pause(50);
            } 

            const logoutModal = await this.elementExists(this.selectors.logoutModal);
            if (!logoutModal) throw new Error(">>> Logout modal did not appear after 10 taps");
            await this.waitAndClick(this.selectors.logoutConfirm);
        } catch (err) {
            console.log(`>>> Unexpected error: ${err.message}`);
        }
    } 
}