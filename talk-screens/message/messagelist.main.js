import { MessageSelectors } from "../../selectors/selectors.js";
import { BasePage } from "../base.js";

export class MessageList extends BasePage {
    constructor(driver) {
        super(driver);
        this.selectors = MessageSelectors;
    }

    async nav() {
        await this.waitAndClick(this.selectors.messageNav);
        await this.waitAndClick(this.selectors.messageAllTab);
    }
}