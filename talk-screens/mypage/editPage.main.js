import { CameraHelper } from "../../helpers/camera.js";
import { EditPageSelectors, MyPageSelectors } from "../../selectors/selectors.js";
import { BasePage } from "../base.js";


export class EditPage extends BasePage{
    constructor(driver) {
        super(driver);
        this.selectors = {
            ...MyPageSelectors,
            ...EditPageSelectors,
        };
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
   
}