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
        this.gestures = new Gestures(driver);
    }

    async navAccountCallSettings() {
        try {
            await this.waitAndClick(this.selectors.myPageNav);
            await this.waitAndClick(this.selectors.myPageSettings);
        } catch (error) {
            console.log(`>>> unable to find mypage navigations, proceeding on account settings`, error);
        } finally {
            await this.waitAndClick(this.selectors.accountSettings);
        }
    }

    async allowCallSettingsPermission () {
        try {
            while (await this.elementExists(this.selectors.callPermission, 5000)) {
                await this.driver.pause(200);

                if(await this.elementExists(this.selectors.allowPermission, 3000)) {
                    await this.waitAndClick(this.selectors.allowPermission);
                    continue;
                }

                if(await this.elementExists(this.selectors.allowConnectivity, 3000)) {
                    await this.waitAndClick(this.selectors.allowConnectivity);
                    continue;
                }

                break;
                
            }
        } catch (error) {
            throw new Error(`>>> unknown permmission is displyed ${error.message}`);
        }
    }

    async verifyCallSettings({ video, audio, successMsg, failMsg }) {
        await this.gestures.swipeDownToRefresh();
        await this.driver.pause(1000);

        const videoSettings = await this.toggleState(this.selectors.videoCallSettings);
        const audioSettings = await this.toggleState(this.selectors.audioCallSettings);
        const callSettings = video === videoSettings && audio === audioSettings;
        if(!callSettings) {
            throw new Error(failMsg);
        } 
        console.log(successMsg);
    }

    async enableVideoAudioSettings() { 
        try {
            const videoSettings = await this.toggleOnIfOff(this.selectors.videoCallSettings);
            
            if(videoSettings) {
                console.log(">>> turning on video and audio call settings");
                await this.allowCallSettingsPermission();
                await this.verifyCallSettings({
                    video: true,
                    audio: true,
                    successMsg: ">>> SUCCESS: successfully enabled video and audio call settings",
                    failMsg: ">>> FAIL: failed to update call settings"
                });
            } else {
                console.log(">>> video and audio call settings are already on")
            }

        } catch (error) {
            throw new Error(`>>> unexpected error: ${error.message}`);
        }
    }

    async enableAudioSettings() {
        try {
            const audioSettings = await this.toggleOnIfOff(this.selectors.audioCallSettings);
            
            if(audioSettings) {
                console.log(">>> turning on audio call settings");
                await this.allowCallSettingsPermission();
                await this.verifyCallSettings({
                    video: false, 
                    audio: true,
                    successMsg: ">>> SUCCESS: successfully enabled audio call settings",
                    failMsg: ">>> FAIL: failed to update call settings"
                });
            } else {
                console.log(">>> audio call settings already on");
            }

        } catch (error) {
            throw new Error(`>>> unexpected error: ${error.message}`);
        }
    }

    async disableVideoSettings() {
        try {
            const videoSettings = await this.toggleOffIfOn(this.selectors.videoCallSettings);
        
            if(videoSettings) {
                console.log(">>> turning off video call settings");
                await this.verifyCallSettings({
                    video: false,
                    audio: true,
                    successMsg: ">>> SUCCESS: successfully disabled video call settings",
                    failMsg: ">>> FAIL: failed to update call settings"
                });
            } else {
                console.log(">>> video call settings already off");
            }
            
        } catch (error) {
            throw new Error(`>>> unexpected error: ${error.message}`);
        }
        
    }

    async disableAudioVideoSettings() {
        try {
            const videoSettings = await this.toggleOffIfOn(this.selectors.videoCallSettings);
            const audioSettings = await this.toggleOffIfOn(this.selectors.audioCallSettings);

            if(videoSettings || audioSettings) {
                console.log(">>> turning off video and audio call settings");
                await this.verifyCallSettings({
                    video: false, 
                    audio: false,
                    successMsg: ">>> SUCCESS: successfully disabled video and audio call settings",
                    failMsg: ">>> FAIL: failed to update call settings"
                })
            } else {
                console.log(">>> video and audio call settings are already off");
            }
        } catch (error) {
            throw new Error(`>>> unexpected error: ${error.message}`);
        }
        
    }

    
}