import { SearchScreenSelectors } from "../../selectors/selectors.js";
import { BasePage } from "../base.js";
import { CallSettings } from "./callsettings.main.js";

export class CallAppeal extends BasePage{
    constructor(driver) {
        super(driver);
        this.selectors = SearchScreenSelectors;
        this.callSettings = new CallSettings(driver);
    }

    async callAppealIcon () {
        await this.waitAndClick(this.selectors.appealIcon);
    }

    async selectAppeal ({ btnID, name }) {
        const btnAppeal = await this.waitAndFind(btnID, 2000);
        if (!btnAppeal) throw new Error (`⚠️ Appeal button not found: ${btnID}`);
        await btnAppeal.click();
       
        const isVisible = await this.elementExists(this.selectors.callSettingsVisible, 2000);
        if (isVisible) {
            console.log("🛠️ call settings is off, turning on....");
            await callSettings.setCallSettings("enableAudioVideo");
        } 

        
        try {
            const toast = await this.waitAndFind(this.selectors.toastMessage, 2000);
            if (toast) {
                const toastText = await toast.getText();
                console.log(`Appeal "${name}" set successfully — Toast: ${toastText}`)
            } else {
                console.warn("⚠️ Toast message not visible or disappeared too quickly.");
            }
            
        } catch (err) {
            console.log(`unexpected error occured: ${err.message}`);
        }

    }

    async setAppeal (settingIndex) {
        const appeal = AppealOption[settingIndex];
        if (!appeal) {
            throw new Error (`⚠️ Unknown call setsting: ${settingIndex}`);
        } 
        await this.selectAppeal(appeal);
    }
}