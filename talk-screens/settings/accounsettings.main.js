import { Gestures } from "../../helpers/gestures.js";
import { MyPageSelectors, VariousSettingsSelectors } from "../../selectors/selectors.js";
import { BasePage } from "../base.js";

export class AccountSettings extends BasePage {
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
        } catch (error) {
            await this.waitAndClick(this.selectors.accountSettings);
            return[];
        }
    }

    async handlePermission() {
        try {
            while (await this.elementExists(this.selectors.callPermission, 3000)) {
                await this.driver.pause(300);

                if(await this.waitAndFind(this.selectors.allowPermission, 3000)) {
                    await this.waitAndClick(this.selectors.allowPermission);
                    continue;
                }
                if(await this.waitAndFind(this.selectors.allowConnectivity, 3000)) {
                    await this.waitAndClick(this.selectors.allowConnectivity);
                    continue;
                }

                console.log(">>> unknown permission is displayed");
                break;
                
            }
        } catch (error) {
            throw new Error(`>>> Unexpected error: ${error.message}`);
        }
    }

    async verifyToggleSettings ({ video, audio, successMsg, errorMsg}) {
        await this.gesture.swipeDownToRefresh();
        await this.driver.pause(2000);

        const videoSettings = await this.toggleState(this.selectors.videoCallSettings);
        const audioSettings = await this.toggleState(this.selectors.audioCallSettings);
        const state = videoSettings === video && audioSettings === audio;
        console.log(
            state
            ? successMsg
            : errorMsg
        );
    }

    async enableVideoAudioSettings () {
        try {
            const videoSettings = await this.toggleOnIfOff(this.selectors.videoCallSettings);
            if(videoSettings) {
                await this.handlePermission();
                await this.toggleOnIfOff(this.selectors.audioCallSettings);

                //verify the updated call settings
                await this.verifyToggleSettings({
                    video: true,
                    audio: true,
                    successMsg: ">>> successfully enabled video and audio call settings",
                    errorMsg: ">>> settings did not update or incorrect flag"
                });
            } else {
                console.log(">>> video and audio settings are already on")
            }
        } catch (error) {
            throw new Error(`>>> Unexpected error: ${error.message}`);
        }
    }

    async enableAudioSettings () {
        try {
            const audioSettings = await this.toggleOnIfOff(this.selectors.audioCallSettings);
            if(audioSettings) {
                await this.handlePermission();
                await this.toggleOffIfOn(this.selectors.videoCallSettings);

                //verify the updated call settings
                await this.verifyToggleSettings({
                    video: false,
                    audio: true,
                    successMsg: ">>> successfully enabled audio call settings",
                    errorMsg: ">>> settings did not update or incorrect flag"
                });
            } else {
                console.log(">>> audio settings already on");
            }
        } catch (error) {
            throw new Error(`>>> Unexpected error: ${error.message}`);
        }
    }
}