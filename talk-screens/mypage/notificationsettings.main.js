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

            const isEnable = (
                await this.toggleOnIfOff(this.selectors.vibrateToggle) &&
                await this.toggleOnIfOff(this.selectors.soundToggle) &&
                await this.toggleOnIfOff(this.selectors.notificationsToggle)
            )

            if(isEnable) {
                // --check toggle buttons--
                const vibrate = await this.toggleSate(this.selectors.vibrateToggle);
                const sound = await this.toggleSate(this.selectors.soundToggle);
                const notif = await this.toggleSate(this.selectors.notificationsToggle);
                console.log (
                    vibrate && sound && notif
                    ? ">>> settings successfully enabled"
                    : ">>> settings did not update"
                )
            } else {
                console.log(">>> settings are already on")
            }
        } catch (error) {
            console.log(`>>> unexpected error or button not found: "${error.message}"`);
        }
        await driver.pause(3000);
        await this.waitAndClick(this.selectors.backBtn);
    }


}