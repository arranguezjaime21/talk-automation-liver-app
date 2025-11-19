import { CameraHelper } from "../../helpers/camera.js";
import { Gestures } from "../../helpers/gestures.js";
import { TimelinePageSelectors } from "../../selectors/selectors.js";
import { BasePage } from "../base.js";

export class TimelinePosting extends BasePage {
    constructor(driver) {
        super(driver);
        this.selectors = TimelinePageSelectors;
        this.gesture = new Gestures (driver);
        this.cameraHelper = new CameraHelper (
            this.driver = driver,
            this.waitAndClick.bind(this),
            this.waitAndFind.bind(this),
            this.waitAndFind$$.bind(this),
        )
    }

    // --- TIMELINE POST SCREEN NAVIGATOR ---
    async navTimelinePostScreen () { 
        try {
            await this.waitAndClick(this.selectors.timelineNav);
            await this.waitAndClick(this.selectors.tab3); 
            await this.waitAndClick(this.selectors.newPost);
        } catch {
            return;
        }
    }

    // --- TIMELINE POST FILLER ---
    async fillTimelineImgText ({ description, uploadAction }) {
        await this.setValue(this.selectors.postText, description);
        await uploadAction(this.selectors);
        await this.elementExists(this.selectors.uploadImagePreview, 10000);
    }

    // --- TIMELINE POST ---
    async postTimeline ({ content, postType = "text"}) {
        await this.navTimelinePostScreen();

        const postCategory = {
            text: async () => await this.setValue(this.selectors.postText, content),
            camera: async () => await this.fillTimelineImgText({
                description: content,
                uploadAction: this.cameraHelper.timelineCamera.bind(this.cameraHelper),
            }),
            gallery: async () => await this.fillTimelineImgText({
                description: content,
                uploadAction: this.cameraHelper.timelineGallery.bind(this.cameraHelper),
            }),
        };

        const action = postCategory[postType];
        if (!action) throw new Error(`>>> Invalid postType: "${postType}" - user "text" | "camera" | "gallery"`);
        
        await action();
        const timelinePostText = await this.waitAndGetText(this.selectors.postText);
        console.log(`>>> Timeline created post: "${timelinePostText}"`);
        await this.submitAndVerifyUploadedPost(timelinePostText);
        await this.postStatuses();
    }

    // --- CHECKER IF TIMELINE LIST IS EMPTY ---
    async emptyList () {
        const empty = await this.elementExists(this.selectors.emptyTimeline, 5000);
         if (empty) {
            const textDisplay = await this.waitAndGetText(this.selectors.emptyText);
            console.log(`>>> Timeline list is empty and wording is displayed: "${textDisplay}`);
            return true;
        } 
        return false;
    }

    // --- CHECKER FOR TIMELINE STATUSES --- 
    async postStatuses () {
        if (await this.emptyList()) return;

        const postList = await this.waitAndFind$$(this.selectors.timelineList, 5000);
        const totalPost = postList.length;
        
        let approvalCount = 0;

       
        for (const post of postList){
            const forApproval = await post.$(this.selectors.approval);
            if (await forApproval.isDisplayed().catch(() => false)) {
            approvalCount++;
            }
        }

        const latestUpload = postList[0];

        const inReview = await latestUpload.$(this.selectors.approval);
        const isDisplayed = await inReview.isDisplayed().catch(() => false);
        console.log (
            isDisplayed
            ? `>>> Found ${approvalCount} post waiting for approval out of ${totalPost} in timeline pagination`
            : ">>> All post are already approve"
        );
    }

    // --- VERIFY UPLOADED POST IN TIMELINE SCREEN ---
    async submitAndVerifyUploadedPost (expectedText) {
        await this.waitAndClick(this.selectors.submitPost);
        await driver.pause(2000);
        await this.gesture.swipeDownToRefresh();
        if (await this.emptyList()) return console.log(">>> Timeline list is empty");
        try {
            const postList = await this.waitAndFind$$(this.selectors.timelineList, 5000);
            const latestPost = postList[0];

            const inReview = await latestPost.$(this.selectors.approval);
            if (!inReview) return console.log(">>> No for approval post in the latest post");

            const isDisplayed = await inReview.isDisplayed().catch(() => false);
            console.log(
                isDisplayed
                ? ">>> Timeline post is successfully displayed and waiting for review"
                : ">>> Timeline post is not displayed"
            );

            // --CHECKER IF POST MATCHES ON THE LIST SCREEN--
            const textElement =  await latestPost.$(this.selectors.postedText);
            const textExist = await textElement.isExisting();
            if (!textExist) {
                console.log(">>> Latest post has no text");
            } else {
                const textDisplay = await textElement.getText();

                if (textDisplay.trim() === expectedText.trim()) {
                    console.log(`>>> The uploaded post text matches the user input in timeline post screen`);
                } else {
                    console.log(`>>> Posted text is mismatch. 
                        Expected: "${expectedText}" 
                        Found: "${textDisplay}"`);
                }
            }

        } catch (err) {
            throw new Error(`>>> Unexpected error or post failed ${err.message}`);
        } 
    }

}