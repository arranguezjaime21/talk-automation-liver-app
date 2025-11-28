
import { Gestures } from "../../helpers/gestures.js";
import { MyPageSelectors, VariousSettingsSelectors } from "../../selectors/selectors.js";
import { BasePage } from "../base.js";

export class AccountSettings extends BasePage{
    constructor(driver) {
        super(driver);
        this.selectors = {
            ...MyPageSelectors,
            ...VariousSettingsSelectors,
        };
        this.gesture = new Gestures(driver);
    }

    async navAccountSettings () {
        try {
            await this.waitAndClick(this.selectors.myPageNav);
            await this.waitAndClick(this.selectors.myPageSettings);
            await this.waitAndClick(this.selectors.accountSettings);
        } catch {
            await this.waitAndClick(this.selectors.accountSettings);
            return[];
        }
    }

    async handlePermission () {
        try {
            while (await this.elementExists(this.selectors.callPermission, 2000)) {
                await this.driver.pause(300);

                if(await this.waitAndFind(this.selectors.allowPermission, 2000)) {
                    await this.waitAndClick(this.selectors.allowPermission);
                    continue;
                }

                if(await this.waitAndFind(this.selectors.allowConnectivity, 2000)) {
                    await this.waitAndClick(this.selectors.allowConnectivity);
                    continue;
                }

                console.warn(">>> permision not found");
                break;
                
            }
        } catch (error) {
            throw new Error(`>>> Unexpected error: ${error.message}`);
        }
    }

    async enableAudioSettings () {
        try {
            await this.toggleOffIfOn(this.selectors.videoCallSettings);
            
            const audioSettings = await this.toggleOnIfOff(this.selectors.audioCallSettings);
            if(audioSettings) {
                await this.handlePermission();

                // --check toggle buttons--
                await this.gesture.swipeDownToRefresh();
                await this.driver.pause(2000);
                const videoToggle = await this.toggleSate(this.selectors.videoCallSettings);
                const audioToggle = await this.toggleSate(this.selectors.audioCallSettings);
                console.log(
                    !videoToggle && audioToggle
                    ? ">>> audio call settings successfully turned on"
                    : ">>> call settings did not update"
                );
            } else {
                console.log(">>> audio call settings is already on")
            }
        } catch (error) {
            console.log(`>>> Unexpected error: ${error.message}`);
        }
    }

    async enableAudioVideoSettings () {
        try {
            const videoSettings = await this.toggleOnIfOff(this.selectors.videoCallSettings);
            if(videoSettings) {
                await this.handlePermission();

                // -check toggle buttons--
                await this.gesture.swipeDownToRefresh()
                await this.driver.pause(2000);
                const videoToggle = await this.toggleSate(this.selectors.videoCallSettings);
                const audioToggle = await this.toggleSate(this.selectors.audioCallSettings);
                console.log(
                    videoToggle && audioToggle
                    ? ">>> video and audio settings successfully turned on"
                    : ">>> call settings did not update"
                );
            } else {
                console.log(">>> video and audio call settings is already on");
            }
        } catch (error) {
            throw new Error(`>>> Unexpected error: ${error.message}`);
        }
    }
  
}