import { callSettingsConfig } from "../../configs/callsettings.config.js";
import { SearchScreenSelectors } from "../../selectors/selectors.js";
import { BasePage } from "../base.js";

export class CallSettings extends BasePage {
    constructor(driver) {
        super(driver);
        this.selectors = SearchScreenSelectors;
    }

    async navSearchPage() { 
        await this.waitAndClick(this.selectors.searchPageNav);
    }

    async callSettingsIcon() {
        await this.waitAndClick(this.selectors.callSettingsBtn);
    } 

    async handleCallSettings({ buttonID, enableStatus, disableStatus, currentStatus }) {                        
        const button = await this.driver.$(`id=${buttonID}`);
        const status = await this.waitAndFind(this.selectors.callSettingsStatus, 5000);
        const getStatus = await status.getAttribute("text");
        

            if (enableStatus.includes(getStatus)) {
                await button.waitForDisplayed({timeout:5000});
                await button.click();
            } else if (disableStatus.includes(getStatus)) {
                console.log(currentStatus);
                const close = await this.waitAndClick(this.selectors.closedBtn);
            } else {
                console.log(`⚠️ unexpected error state: ${getStatus}`);
            }
    }

    async setCallSettings (settingName) {
        if (!callSettingsConfig[settingName]) {
            throw new Error (`⚠️ unknown call setting: ${settingName}`);
        } 
        await this.handleCallSettings(callSettingsConfig[settingName]);
    }
}