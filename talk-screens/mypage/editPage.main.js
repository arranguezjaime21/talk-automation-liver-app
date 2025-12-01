import { CameraHelper } from "../../helpers/camera.js";
import { Gestures } from "../../helpers/gestures.js";
import { EditPageSelectors, MyPageSelectors } from "../../selectors/selectors.js";
import { BasePage } from "../base.js";


export class EditPage extends BasePage{
    constructor(driver) {
        super(driver);
        this.selectors = {
            ...MyPageSelectors,
            ...EditPageSelectors,
        };
        this.gesture = new Gestures(driver);
        this.cameraHelper = new CameraHelper (
            this.driver,
            this.waitAndClick.bind(this),
            this.waitAndFind.bind(this),
            this.waitAndFind$$.bind(this),
        );
    }

    async navEditPage () {
        try {
            await this.waitAndClick(this.selectors.myPageNav);
            await this.waitAndClick(this.selectors.myPageEditPage);
        } catch {
            await this.waitAndClick(this.selectors.myPageEditPage);
            return;
        }
    }

    async profileUpdate ({ uploadVia = "camera" }) {
        try {
            if(uploadVia !== "camera" && uploadVia !== "gallery") throw new Error (`>>> Invalid upload type: "${uploadVia}" , use "camera" | "gallery"`);

            const profileInReview = await this.elementExists(this.selectors.inReview, 5000);
            if (profileInReview) return console.log(">>> User already submitted profile and waiting for review");

            await this.waitAndClick(this.selectors.uploadImg);

            const uploadSelectionModal = await this.elementExists(this.selectors.uploadSelection, 3000);
            if (!uploadSelectionModal) return console.log(">>> Upload selection or modal is not displayed");

            const type = {
                camera: async() => this.cameraHelper.profileCamera(this.selectors),
                gallery: async() => this.cameraHelper.profileGallery(this.selectors),
            };

            const profile = type[uploadVia];
            await profile();

            const inReview = await this.elementExists(this.selectors.inReview, 3000);
            if(inReview) {
                console.log(">>> User successfully submitted profile and waiting for review");
            } else {
                console.log(">>> Profile rejected or upload was unsuccessful");
            }
        } catch (err) {
            throw new Error(`>>> Unexpected Error: ${err.message}`);
        }
    }


    async scrollPickRandomAge(selector, min, max) {
        // Pick a random target value
        const targetValue = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log(`>>> Random picker target: ${targetValue}`);

        // Ensure picker is an element object
        let picker = selector;
        if (typeof selector === 'string') {
            picker = await this.driver.$(selector);
        }

        // Loop until picker shows the target value
        while (true) {
            const input = await this.driver.$(this.selectors.selectedAge);
            let currentValue = await input.getText();
            currentValue = parseInt(currentValue.replace(/\D/g, ''), 10);

            if (currentValue === targetValue) break;

            // Scroll inside the picker
            await this.gesture._swipeInsidePicker(picker);
            await this.driver.pause(300);
        }

        return targetValue;
    }

    async updateAge() {
        // Open age picker
        await this.waitAndClick(this.selectors.itemAge);

        // Scroll to random age and get the selected value
        const selectedAge = await this.scrollPickRandomAge(this.selectors.picker, 18, 35);
        console.log("Random age selected:", selectedAge);

        // Confirm selection
        await this.waitAndClick(this.selectors.saveAge);

        return selectedAge;
    }

    async updateA(targetText) {
        await this.waitAndClick(this.selectors.itemAge);
        
        const items = await this.waitAndFind$$(this.selectors.unselectedPicker, 3000);
        for (const item of items) {
            const text = await item.getText();
            if(text === targetText) {
                await item.click();
                await this.waitAndClick(this.selectors.saveBtn);
                break;
            }
        }
    }

    
}