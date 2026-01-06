import { Gestures } from "../../helpers/gestures.js";
import { MyPageSelectors, VariousSettingsSelectors } from "../../selectors/selectors";
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
        await this.driver.pau(2000);

        const videoSettings = await this.toggleState(this.selectors.videoCallSettings);
        const audioSettings = await this.toggleState(this.selectors.audioCallSettings);
        const callSettingsState = videoSettings === video && audioSettings === audio;

        console.log(
            callSettingsState
            ? successMsg
            : failMsg
        );
    }

    async enableVideoAudioCallSettings() {
        try {
            const videoSettings = await this.toggleOnIfOff(this.selectors.videoCallSettings);
            if(videoSettings) {
                await this.handlePermission();
                await this.verifyCallSettings({
                    video: true,
                    audio: true,
                    successMsg: ">>> successfully enabled video and audio call settings",
                    failMsg: ">>> failed to enable video and audio call settings",
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
                await this.handlePermission();
                await this.toggleOffIfOn(this.selectors.videoCallSettings);
                await this.verifyCallSettings({
                    video: false,
                    audio: true,
                    successMsg: ">>> successfully enabled audio call settings",
                    failMsg: ">>> failed to enable audio call settings",
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
            const videoAudioSettings = await this.toggleOffIfOn(this.selectors.audioCallSettings);
            if(videoAudioSettings) {
                await this.handlePermission();
                await this.verifyCallSettings({
                    video: false,
                    audio: false,
                    successMsg: ">>> successfully disabled video and audio call settings",
                    failMsg: ">>> failed to disable video and audio call settings",
                });
            } else {
                console.log(">>> video and audio call settings are already off")
            }
        } catch (error) {
            throw new Error(`>>> unexpected error: ${error.message}`);
        }
    }

    async disableVideoCallSettings () {
        try {
            const videoSettings = await this.toggleOffIfOn(this.selectors.videoCallSettings);
            if(videoSettings) {
                await this.handlePermission();
                await this.toggleOnIfOff(this.selectors.audioCallSettings);
                await this.verifyCallSettings({
                    video: false,
                    audio: true,
                    successMsg: ">>> successfully enabled audio call settings",
                    failMsg: ">>> failed to enabled audio call settings",
                });
            } else {
                console.log(">>> audio call settings is already on");
            }
        } catch (error) {
            throw new Error(`>>> unexpected error: ${error.message}`);
        }
    }
}