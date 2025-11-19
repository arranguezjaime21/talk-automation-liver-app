import { MyPageSelectors, NotificationSettingsSelectors } from "../../selectors/selectors.js";
import { BasePage } from "../base.js";

export class NotificationSettings extends BasePage{
    constructor (driver) {
        super (driver);
        this.selectors = {
           ... MyPageSelectors,
           ...NotificationSettingsSelectors
        }
    }

    async MypageNotifSettings () {
        try {
            await this.waitAndClick(this.selectors.myPageNotificationSettings);

            const vibrateSettings = await this.isButtonEnable(this.selectors.vibrateToggle);
            const soundSettings = await this.isButtonEnable(this.selectors.soundToggle);
            const notifySettings = await this.isButtonEnable(this.selectors.notificationsToggle);
        
            if (!vibrateSettings || !soundSettings || !notifySettings) {
                console.log(">>> settings are off, enabling settings...");

                if (!vibrateSettings) {
                    await this.waitAndClick(this.selectors.vibrateToggle);
                }
                if (!soundSettings) {
                    await this.waitAndClick (this.selectors.soundToggle);
                }
                if (!notifySettings) {
                    this.waitAndClick(this.selectors.notificationsToggle);
                }
                
            } else {
                console.log(">>> settings already enabled");
            }
        } catch (error) {
            console.log(`>>> unexpected error or button not found: "${error.message}"`);
        }
        await driver.pause(3000);
        await this.waitAndClick(this.selectors.backBtn);
    }


}