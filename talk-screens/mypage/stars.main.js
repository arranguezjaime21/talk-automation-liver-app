import { MyPageSelectors } from "../../selectors/selectors.js";
import { BasePage } from "../base.js";

export class AcquisitionStars extends BasePage{
    constructor(driver) {
        super(driver);
        this.selectors = MyPageSelectors;
    }

    async navigation () {
        try {
            await this.waitAndClick(this.selectors.myPageNav);
        } catch {
            return;
        }
    }

    async userStars () {
        await this.navigation();
        const stars = await this.waitAndGetText(this.selectors.ownStars);
        console.log(`>>> Users acquired stars: ${stars}`);
        await this.waitAndClick(this.selectors.mypageStar);
     
        try {
            const webviewDisplay = await this.elementExists(this.selectors.successDisplay, 10000);

            if (webviewDisplay) {
                console.log(">>> Webview successfully displayed.")
                await driver.pause(3000);
                const webstars = await this.waitAndGetText(this.selectors.starwebV);

                //trim the value by removing comma, or any string in the number
                const starDisplay = value => String(value).replace(/,/g, '').trim();
                const mypageStars = starDisplay(stars);
                const webviewStars = starDisplay(webstars);
               
                if (mypageStars === webviewStars) {
                    console.log(">>> webview stars displayed is the same on mypage")
                } else {
                    console.log(">>> incorrect stars displayed in webview screen")
                }
                
            } else {
                console.warn(">>> webview still not displayed, continuing without error...")
            }
            await this.waitAndClick(this.selectors.closeWebView);
        } catch (err) {
            throw new Error(`>>> Unexpected error, ${err.message}`);
        }
   }
}