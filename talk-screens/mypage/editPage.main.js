
import { CameraHelper } from "../../helpers/camera.js";
import { Gestures } from "../../helpers/gestures.js";
import { EditPageSelectors, MyPageSelectors } from "../../selectors/selectors.js";
import { BasePage } from "../base.js";

export class EditPage extends BasePage{
    constructor (driver) {
        super(driver);
        this.selectors = {
            ...MyPageSelectors,
            ...EditPageSelectors,
        }
        this.gesture = new Gestures(driver);
        this.cameraHelper = new CameraHelper(
            this.driver, 
            this.waitAndClick.bind(this),
            this.waitAndFind.bind(this),
            this.waitAndFind$$.bind(this),
        )
    
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


    async profileUpload ({uploadVia = "camera"}) {
        try {
            if(uploadVia !== "camera" && uploadVia !== "gallery") throw new Error (`>>> Invalid upload type: "${uploadVia}", use only "camera" | "gallery"`);
            
            const profileInReview = await this.elementExists(this.selectors.inReview, 4000);
            if (profileInReview) return console.log(">>> User profile is still in-review, unable to upload new profile");
            
            await this.waitAndClick(this.selectors.uploadImg);
            
            const uploadSelection = await this.elementExists(this.selectors.uploadSelection, 3000);
            if (!uploadSelection) return console.warn(">>> Profile upload selection modal is not displayed");

            const upload = {
            camera: async() => this.cameraHelper.profileCamera(this.selectors),
            gallery: async() => this.cameraHelper.profileGallery(this.selectors),
            }
            const uploadProfile = upload[uploadVia];
            await uploadProfile();
        } catch (error) {
            throw new Error(`>>> Unexpected error occurs: ${error.message}`);
        }
        
        
    }
}