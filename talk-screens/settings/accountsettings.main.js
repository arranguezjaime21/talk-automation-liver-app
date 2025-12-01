
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

    async handlePermission() {
        try {
            while (await this.elementExists(this.selectors.callPermission, 2000)) {
                await this.driver.pause(200);

                if(await this.waitAndFind(this.selectors.allowPermission, 1000)) {
                    await this.waitAndClick(this.selectors.allowPermission);
                    continue;
                }

                if(await this.waitAndFind(this.selectors.allowConnectivity, 1000)) {
                    await this.waitAndClick(this.selectors.allowConnectivity);
                    continue;
                }

                console.log(">>> found different permission dialog");
                break;
            }
        } catch (error) {
            throw new Error(`>>> Unexpected error: ${error.message}`);
        }
    }

    async verifyCallSettingsStatus({video, audio, successMsg, failMsg}) {
        await this.gesture.swipeDownToRefresh();
        await this.driver.pause(3000);

        const videoSettingsState = await this.toggleSate(this.selectors.videoCallSettings);
        const audioSettingsState = await this.toggleSate(this.selectors.audioCallSettings);
        
        const status = videoSettingsState === video && audioSettingsState === audio;
        console.log(
            status
            ? successMsg
            : failMsg
        );
    }

    async enableAudioSettings() {
        try {
            const audioSettings = await this.toggleOnIfOff(this.selectors.audioCallSettings);
            if (audioSettings) {
                await this.handlePermission();
                await this.toggleOffIfOn(this.selectors.videoCallSettings);
                await this.toggleOnIfOff(this.selectors.audioCallSettings);
                await this.verifyCallSettingsStatus({
                    video: false, 
                    audio: true,
                    successMsg: ">>> call settings successfully updated",
                    failMsg: ">>> call settings still not updated "
                });
            } else {
                console.log(">>> audio call settings already on");
            }
        } catch (error) {
            throw new Error(`>>> Unexpected error: ${error.message}`);
        }
    }

    async enableAudioVideoSettings() {
        try {
            const videoSettings = await this.toggleOnIfOff(this.selectors.videoCallSettings);
            if (videoSettings) {
                await this.handlePermission();
                await this.toggleOnIfOff(this.selectors.videoCallSettings);
                await this.toggleOnIfOff(this.selectors.audioCallSettings);
                await this.verifyCallSettingsStatus({
                    video: true,
                    audio: true,
                    successMsg: ">>> call settings successfully updated",
                    failMsg: ">>> call settings still not updated"
                });
            } else {
                console.log(">>> video call settings already on");
            }
        } catch (error) {
            throw new Error(`>>> Unexpected error: ${error.message}`);
        }
    }

    async disableVideoSettings() {
        try {
            const videoSettings = await this.toggleSate(this.selectors.videoCallSettings);
            if(!videoSettings) return console.log(">>> video call settings already off");
            await this.toggleOffIfOn(this.selectors.videoCallSettings);
            await this.toggleOnIfOff(this.selectors.audioCallSettings);
            await this.verifyCallSettingsStatus({
                video: false,
                audio: true,
                successMsg: ">>> call settings successfully off",
                failMsg: ">>> call settings still on"
            });
        } catch (error) {
            throw new Error(`>>> Unexpected error: ${error.message}`);
        }
    }

    async disableAudioVideoSettings() {
        try {
            const audioSettings = await this.toggleSate(this.selectors.audioCallSettings);
            if(!audioSettings) return console.log(">>> audio call settings already off");
            await this.toggleOffIfOn(this.selectors.videoCallSettings);
            await this.toggleOffIfOn(this.selectors.audioCallSettings);
            await this.verifyCallSettingsStatus({
                video: false,
                audio: false,
                successMsg: ">>> call settings successfully off",
                failMsg: ">>> call settings still on"
            })
        } catch (error) {
            throw new Error(`>>> Unexpected error: ${error.message}`);
        }
    }

    async registerSNSMail (email, password, confirmPass){
        await this.waitAndClick(this.selectors.snsMail);
        await this.setValue(this.selectors.emailField, email);
        await this.setValue(this.selectors.passwordField, password);
        await this.setValue(this.selectors.confirmPassField, confirmPass);
        
    }

    async registeredMailAndPass () {
        await this.waitAndClick(this.selectors.showPass);
        const pass = await this.waitAndGetText(this.selectors.passwordField);
        await this.waitAndClick(this.selectors.showConfirmPass);
        const conPass = await this.waitAndGetText(this.selectors.confirmPassField);
    }
  
}