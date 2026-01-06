import { CameraHelper } from "../../helpers/camera.js";
import { Gestures } from "../../helpers/gestures.js";
import { MyPageSelectors, TemplateSelectors } from "../../selectors/selectors.js";
import { BasePage } from "../base.js";

export class TemplateSee extends BasePage{
    constructor(driver) {
        super(driver);
        this.selectors = {
            ...MyPageSelectors, 
            ...TemplateSelectors,
        };
        this.cameraHelper = new CameraHelper(
            driver,
            this.waitAndClick.bind(this),
            this.waitAndFind.bind(this),
            this.waitAndFind$$.bind(this),
        );
        this.gestures = new Gestures(driver);
    }

    async navTemplateSettings () {
        try {
            await this.waitAndClick(this.selectors.myPageNav);
            await this.waitAndClick(this.selectors.navTemplateSettings);
            await this.waitAndClick(this.selectors.createTemplate);
        } catch {
            await this.waitAndClick(this.selectors.createTemplate);
            return[];
        }
    }

    async fillTemplate ({ description, upload }) {
        await this.setValue(this.selectors.templateDescription, description);
        await upload(this.selectors);
        await this.elementExists(this.selectors.iconThumbImage, 5000);
    }

    async createTemplate ({ content, templateType = "text" }) {
        await this.navTemplateSettings();
        
        const type = {
            text: async() => await this.setValue(templateDescription, content),
            camera: async() => await this.fillTemplate({
                description: content,
                upload: this.cameraHelper.templateCamera.bind(this.cameraHelper),
            }),
            gallery: async() => await this.fillTemplate({
                description: content,
                upload: this.cameraHelper.templateGallery.bind(this.cameraHelper),
            }),
        }

        const template = type[templateType];
        if(!template) throw new Error(`>>> invalid inputted text: ${templateType}, "text", "camera", "gallery"`);
        await template();

        const templateText = await this.waitAndGetText(this.selectors.templateDescription, 3000);
        
    }
}