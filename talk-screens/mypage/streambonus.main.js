import { MyPageSelectors } from "../../selectors/selectors.js";
import { BasePage } from "../base.js";

export class StreamingBonus extends BasePage{
    constructor(driver) {
        super(driver);
        this.selectors = MyPageSelectors;

    }

    async navigation() {
        try {
            await this.waitAndClick(this.selectors.myPageNav);
            await this.waitAndClick(this.selectors.myPageStreamingBonus);
        } catch {
            console.log(">>> user already in streaming bonuses screen");
        }
    }

    async streamBonuses () { 
        await this.navigation();
        const isWebviewDisplay = await this.elementExists(this.selectors.streamingWebview, 5000);

        try {
            await driver.pause(3000);
            if (isWebviewDisplay) {
                console.log(">>> streaming bonuses successfully displayed");
            } else {
                console.log(">>> streaming bonuses webview is not displayed");
            }
                await this.waitAndClick(this.selectors.closeWebView);            
        } catch (err) {
            throw new Error(`>>> unexpected error or webview not found ${err.message}`);
        }
    }
}