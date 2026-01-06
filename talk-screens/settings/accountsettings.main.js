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
        this.gestures = new Gestures(driver);
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

    async handlePermission() {
        try {
            while (await this.elementExists(this.selectors.callPermission, 5000)) {
                await this.driver.pause(300);
                
                if(await this.elementExists(this.selectors.allowPermission, 5000)) {
                    await this.waitAndClick(this.selectors.allowPermission);
                    continue;
                }

                if(await this.elementExists(this.selectors.allowConnectivity, 5000)) {
                    await this.waitAndClick(this.selectors.allowConnectivity);
                    continue;
                }

                console.log(">>> unknown permission is displayed");
                break;
            }
        } catch (error) {
            throw new Error(`>>> unexpected error: ${error.message}`);
        }
    }

    async verifyCallSettings ({video, audio, successMsg, failMsg}) {
        await this.gestures.swipeDownToRefresh();
        await this.driver.pause(2000);

        const videoSettings = await this.toggleState(this.selectors.videoCallSettings);
        const audioSettings = await this.toggleState(this.selectors.audioCallSettings);
        const callSettingsState = videoSettings === video && audioSettings === audio;
        if(!callSettingsState) {
            throw new Error(failMsg);
        } 
        console.log(successMsg);
    }

    async enableVideoAudioCallSettings() {
        try {
            const videoSettings = await this.toggleOnIfOff(this.selectors.videoCallSettings);

            if(videoSettings) {
                console.log(">>> turning on video and audio call settings");

                await this.handlePermission();
                await this.verifyCallSettings({
                    video: true,
                    audio: true,
                    successMsg: ">>> PASSED: video and audio call settings successfully ON",
                    failMsg: ">>> FAILED: video and audio call settings still OFF",
                });
            } else {
                console.log(">>> video and audio call settings are already on");
            }
        } catch (error) {
            throw new Error(`>>> unexpected error: ${error.message}`);
        }
    }

    async enableAudioCallSettings() {
        try {
            const audioSettings = await this.toggleOnIfOff(this.selectors.audioCallSettings);

            if(audioSettings) {
                console.log(">>> turning on audio call settings");

                await this.handlePermission();
                await this.verifyCallSettings({
                    video: false,
                    audio: true,
                    successMsg: ">>> PASSED: audio call settings successfully ON",
                    failMsg: ">>> FAILED: audio call settings still OFF",
                })
            } else {
                console.log(">>> audio call settings is already on");
            }
        } catch (error) {
            throw new Error(`>>> unexpected error: ${error.message}`);
        }
    }

    async disableVideoAudioCallSettings() {
        try {
            const videoCallSettings = await this.toggleOffIfOn(this.selectors.videoCallSettings);
            const audioCallSettings = await this.toggleOffIfOn(this.selectors.audioCallSettings);

            if(videoCallSettings || audioCallSettings) {
                console.log(">>> turning off video and audio call settings");
            } else {
                console.log(">>> video and audio call settings are already off")
            }

            await this.verifyCallSettings({
                video: false,
                audio: false,
                successMsg: ">>> PASSED: video and audio call settings successfully OFF",
                failMsg: ">>> FAILED: video and audio call settings are still ON",
            });

        } catch (error) {
            throw new Error(`>>> unexpected error: ${error.message}`);
        }
    }

    async disableVideoCallSettings () {
        try {
            const videoSettings = await this.toggleOffIfOn(this.selectors.videoCallSettings);

            if(videoSettings) {
                console.log(">>> turning off video call settings");

                await this.verifyCallSettings({
                    video: false,
                    audio: true,
                    successMsg: ">>> PASSED: video call settings successfully OFF",
                    failMsg: "video call settings still ON",
                });
            } else {
                console.log(">>> video call settings is already off");
            }
        } catch (error) {
            throw new Error(`>>> unexpected error: ${error.message}`);
        }
    }
}