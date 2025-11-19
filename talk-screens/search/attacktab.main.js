import { AttackTabSelectors, SearchScreenSelectors, TemplateSelectors } from "../../selectors/selectors.js";
import { BasePage } from "../base.js";


export class AttackTab extends BasePage{
    constructor(driver) {
        super(driver);
        this.selectors = {
            ...AttackTabSelectors,
            ...TemplateSelectors,
            ...SearchScreenSelectors,
        };
    
    }

    async navigation () {
        try {
            await this.waitAndClick(this.selectors.searchPageNav);
        } catch {
            return;
        }
    }

    async sendTemplate () {
        await this.navigation();
        await this.userList(8);
        const templateSetisVisible = await this.elementExists(this.selectors.templateOFF, 3000);
        if (templateSetisVisible) {
            console.log("User has no active template. Template Preview displayed.");
            await this.enableTemplate(1);
        } else {
            console.log("user successfully sent template.");
        }
        
    }

    async enableTemplate (index) {
        await this.waitAndClick(this.selectors.closedImg);
        const templateList = await this.waitAndFind$$(this.selectors.tempList, 3000);
        if (!templateList) {
            throw new Error(`unable to find ${templateList} or user dont have template`);
        } else {
            const enable = await this.waitAndFind$$(this.selectors.setTemplate);
            if (!enable[index]) {
                throw new Error(`unable to find ${templateList} or user dont have template`);
            } 
            console.log("enabling user template...")
            await enable[index].click();
            await this.driver.pause(3000);
            await this.waitAndClick(this.selectors.closedTemplate);
            await this.userList(8);
        }
    }

    async userList(index) {
        //get target user nickname
        const userList = await this.waitAndFind$$(this.selectors.userList, 3000);
        if (!userList[index]) {
            throw new Error(`User at index ${index} not found`);
        }

        const userEl = await userList[index].$(this.selectors.userNickName, 3000);
        const userNn = await userEl.getText();

        console.log(`Sending template for user: "${userNn}"`);

        // send template for target user
        const sndBtn = await this.waitAndFind$$(this.selectors.sendTemplateBtn, 3000);
        if (!sndBtn[index]) {
            throw new Error(`Send button for index ${index} not found`);
        }
        await sndBtn[index].click();

    }


}