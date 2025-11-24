
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

    async navigation() {
        try {
            await this.waitAndClick(this.selectors.searchPageNav);
            await this.waitAndClick(this.selectors.attackTab);
        } catch {
            await this.waitAndClick(this.selectors.attackTab);
            return;
        }
    }

    async user (index) {
        const userList = await this.safeFindAll(this.selectors.userList, 3000);
        if(!userList.length) throw new Error(">>> No users found in attack tab list");
        if(!userList[index]) throw new Error (`>>> Unable to find index: ${index} in the list`);

        const userNickName = await userList[index].$(this.selectors.userNickName).getText();
        console.log(`>>> Sending template to user: ${userNickName}`);

        const sendBtn = await this.waitAndFind$$(this.selectors.sendTemplateBtn, 3000);
        if(!sendBtn[index]) {
            throw new Error (`>>> Unable to find send button for index: ${index} in the list`);
        }
        await sendBtn[index].click();

    }

     async enableTemplate (index) {
        await this.waitAndClick(this.selectors.closedImg);
        const templateList = await this.waitAndFind$$(this.selectors.tempList, 3000);
        if (!templateList.length) {
            console.log(">>> User has no template");
            return;
        } 

        const enable = await this.waitAndFind$$(this.selectors.setTemplate, 3000);
        if (!enable[index]) {
            throw new Error(`>>> unable to find ${templateList}`);
        } 

        console.log(">>> enabling user template...")
        await enable[index].click();
        await this.driver.pause(3000);
        await this.waitAndClick(this.selectors.closedTemplate);        
    }

     async sendTemplate () {
        await this.navigation();
        await this.user(2);
        const templateIsOff = await this.elementExists(this.selectors.templateOFF, 3000);
        if (templateIsOff) {
            console.log(">>> User has no active template. Template Preview displayed.");
            await this.enableTemplate(1);
            await this.user(2);
            console.log(">>> Template sent successfully after enabling.");
            return;
        } 
        console.log(">>> User successfully sent template.");  
        
        
    }
}