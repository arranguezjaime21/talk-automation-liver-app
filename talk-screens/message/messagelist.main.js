import { Gestures } from "../../helpers/gestures.js";
import { MessageSelectors } from "../../selectors/selectors.js";
import { BasePage } from "../base.js";

export class MessageList extends BasePage {
    constructor(driver) {
        super(driver);
        this.selectors = MessageSelectors;
    }

    async navMessageAll() {
        try {
            await this.waitAndClick(this.selectors.messageNav);
            await this.waitAndClick(this.selectors.messageAllTab);
        } catch {
            return;
        }
    }

    async userList (index) { 
        const list = await this.safeFindAll(this.selectors.messageList, 3000);
        const targetUser = list[index]; 
        const userNn = await targetUser.$(this.selectors.userNickName).getText();
        console.log(`>>> Messaging for user: ${userNn}`);
        await targetUser.click();
    }

    async sendMessage ({msg}) {
        await this.navMessageAll();
        await this.userList(0);
        await this.setValue(this.selectors.msgTextBox, msg);
        await this.sendStamps(3);
        await this.waitAndClick(this.selectors.msgSendBtn)
    }
    async sendStamps (index) {
        await this.waitAndClick(this.selectors.msgStamp);

        try {
            const tabs = await this.safeFindAll(this.selectors.stampTabs, 3000);
            if(!tabs.length) throw new Error (">>> unexpected error or tabs not found");

            const recentTab = tabs[0];
            await recentTab.click();
            await this.driver.pause(300);

            const stamps = await this.safeFindAll(this.selectors.stampItems, 3000);
            if(!stamps.length) throw new Error (">>> No stamps found in the list");
            if(!stamps[index]) throw new Error (`>>> Stamp index ${index} does not exist`);
            await stamps[index].click();
        } catch (err) {
            throw new Error (`>>> Unexpected error: ${err.message}`);
        }
    }
}