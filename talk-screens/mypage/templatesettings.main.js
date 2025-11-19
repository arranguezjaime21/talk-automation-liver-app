import { CameraHelper } from "../../helpers/camera.js";
import { MyPageSelectors, TemplateSelectors } from "../../selectors/selectors.js";
import { BasePage } from "../base.js";

export class TemplateSettings extends BasePage{
    constructor(driver) {
        super (driver);
        this.selectors = {
            ...TemplateSelectors,
            ...MyPageSelectors,
        };
        this.cameraHelper = new CameraHelper(
            this.driver, 
            this.waitAndClick.bind(this),
            this.waitAndFind.bind(this),
            this.waitAndFind$$.bind(this),
        );
    }

    // --TEMPLATE TITLE--
    async templateTitle (expectedText) { 
        try {
            const title = await this.waitAndGetText(this.selectors.templateTitle);
            if (title !== expectedText) {
                console.log(`>>> Incorrect wording title is displayed, expected "${expectedText}", display is: "${title}"`);
                return false;
            } else {
            // edit テンプレート編集
            // new テンプレート作成
                console.log(`>>> Template Title:  "${title}"`);
                return true;
            }
        } catch (error) {
            console.log(`>>> Unable to verify template title. Expected "${expectedText}" - ${error.message || error}`);
        }
    }

    // --TEMPLATE NAVIGATION--
    async navMyPageTemplate () {
        try {
            await this.waitAndClick(this.selectors.myPageNav);
            await this.waitAndClick(this.selectors.myPageTemplateSettings);
            await this.waitAndClick(this.selectors.createTemplate);
        } catch {
            return;
        }
    }
    
    // --SAVE TEMPLATE--
    async saveAndVerifyTemplate (expectedText) {
        await this.waitAndClick(this.selectors.saveTemplate);
        try {   
            const modal = await this.elementExists(this.selectors.successModal, 5000);
            if (!modal) return console.log(">>> Success modal is not displayed after saving template");
            await this.waitAndClick(this.selectors.confirmBtn);
            await driver.pause(2000);
        
            const templateList = await this.waitAndFind$$(this.selectors.templateList, 5000);
            const totalTemplate = templateList.length;

            if (totalTemplate === 0) return  console.log(">>> No templates found after saving");
            const recentTemplateCreated = templateList[1];

            // --CHECKER IF POST MATCHES ON THE LIST SCREEN--
            const textElement = await recentTemplateCreated.$(this.selectors.postedText);
            const isExist = await textElement.isExisting();
            if (!isExist) {
               console.warn(">>> Element not found");
            } else {
                const textDisplay = await textElement.getText();
                if (textDisplay.trim() === expectedText.trim()) {
                    console.log(">>> Created template successfully displayed in template list");
                } else {
                    console.log(`>>> Template text is mismatch.
                    Found Text: "${textDisplay}"
                    Expected Text: "${expectedText}"`);
                }
            }

        } catch (error) {
            console.log(`>>> Unepected error: ${error.message || error}`);
            return false;
        }
    }
    
    // --TEMPLATE FILLER--
    async templateFill ({description, uploadAction}) {
        await this.setValue(this.selectors.templateDescription, description),
        await uploadAction(this.selectors);
        await this.elementExists(this.selectors.iconThumbImage, 5000);
    }

    // --TEMPLATE CREATION--
    async templateCreation ({ content, templateType = "text" }) {
        await this.navMyPageTemplate();

        const type = {
            text: async() => await this.setValue(this.selectors.templateDescription, content),
            camera: async() => await this.templateFill({
                description: content,
                uploadAction: this.cameraHelper.templateCamera.bind(this.cameraHelper),
            }),
            gallery: async() => await this.templateFill({
                description: content,
                uploadAction: this.cameraHelper.templateGallery.bind(this.cameraHelper),
            }),
        };

        const action = type[templateType];
        if (!action) throw new Error(`>>> Invalid templateType: "${templateType}", use "text" | "camera" | "galery"`);

        await action();
        const tempText = await this.waitAndGetText(this.selectors.templateDescription);
        console.log(`>>> Template created with description: ${tempText}`);
        await this.saveAndVerifyTemplate(tempText);
    }

    // -- DELETION MODAL--
    async deletionModal (expectedText) {
        const title = await this.waitAndGetText(this.selectors.deletionModalText);
        if (title !== expectedText) {
            throw new Error (`>>> unexpected error occurs!! "${expectedText}" show: "${title}"`); 
        } else {
            console.log(`>>> deletion modal is displayed, wording: "${title}"`);
        }
    }

    // -- DELETE FUNCTION --
    async deleteTemplate (index) {
        const template = await this.waitAndFind$$(this.selectors.deleteTemplate, 3000);
        if (template.length === 0) throw new Error ("No templates found to delete");
        console.log("deleting template...")
        await template[index].click();
        await this.deletionModal("テンプレートを削除");
        await this.waitAndClick(this.selectors.confirmDeletion);
        console.log("secessfully deleted template...")
    }

    
}