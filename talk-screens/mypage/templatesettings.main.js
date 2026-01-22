import { CameraHelper } from "../../helpers/camera.js";
import { MyPageSelectors, TemplateSelectors } from "../../selectors/selectors.js";
import { BasePage } from "../base.js";

export class TemplateSettings extends BasePage {
    constructor(driver) {
        super(driver);
        this.selectors = {
            ...MyPageSelectors,
            ...TemplateSelectors,
        };

        this.cameraHelpers = new CameraHelper(
            this.driver,
            this.waitAndClick.bind(this),
            this.waitAndFind.bind(this),
            this.waitAndFind$$.bind(this),
        );
    }

    async navTemplateCreationScreen() {
        try {
            await this.waitAndClick(this.selectors.myPageNav);
            await this.waitAndClick(this.selectors.myPageTemplateSettings);
        } catch (error) {
            console.log(`>>> unable to locate elements, proceeding on template screen`, error);
        } finally {
            await this.waitAndClick(this.selectors.createTemplate);
        }
    }

    async fillTemplateCreationScreen({ description, upload }) {
        await this.setValue(this.selectors.templateDescription, description);
        await upload(this.selectors);
        await this.elementExists(this.selectors.iconThumbImage, 5000);
    }

    async createTemplate ({ content, templateType = "text" }) {
        const template = {
            text: async() => await this.setValue(this.selectors.templateDescription, content),
            camera: async() => await this.fillTemplateCreationScreen({
                description: content,
                upload: this.cameraHelpers.templateCamera.bind(this.cameraHelpers),
            }),
            gallery: async() => await this.fillTemplateCreationScreen({
                description: content,
                upload: this.cameraHelpers.templateGallery.bind(this.cameraHelpers),
            }),
        };

        const action = template[templateType];
        if(!action) throw new Error (`>>> inccorect inputted templateTye: ${templateType}, use "text" | "camera" | "gallery" `);
        await action();

        const templateContent = await this.waitAndGetText(this.selectors.templateDescription);
        console.log(`>>> Template Content: "${templateContent}"`);
        await this.saveAndVerifyTemplate(templateContent);
    }

    async saveAndVerifyTemplate (expectedText) {
        await this.waitAndClick(this.selectors.saveTemplate);

        try {

            if(await this.elementExists(this.selectors.successModal, 5000)) {
                await this.waitAndClick(this.selectors.confirmBtn);
            }
            await this.driver.pause(2000);
            
            const templateList = await this.safeFindAll(this.selectors.templateList, 5000);
            const templates = templateList.lenght;
            if(templates === 0) return console.log(`>>> template not found`);

            const recentTemplate = templateList[1];
            const contentEl = await recentTemplate.$(this.selectors.postedText);
            const isExist = await contentEl.isExisting();
            if(!isExist) {
                console.log(">>> template not found or recent template has no content");
            } else {
                const createdTemplateContent = await contentEl.getText();
                if(createdTemplateContent.trim() === expectedText.trim()) {
                    console.log(`>>> Posted Template Content: "${createdTemplateContent}"`);
                } else {
                    console.log(`>>> recent template content is mismatch: 
                        content display: ${createdTemplateContent},
                        expected content: ${expectedText}`)
                }
            }
        } catch (error) {
            throw new Error (`>>> unexpected error: ${error.message}`);
        }
    }
}