import { Gestures } from "../../helpers/gestures.js";
import { TimelinePageSelectors } from "../../selectors/selectors.js";
import { BasePage } from "../base.js";
import { TimelinePosting } from "./timeline.posting.js";

export class TimelineDeletion extends BasePage {
    constructor(driver) {
        super (driver);
        this.selectors = TimelinePageSelectors;
        this.gesture = new Gestures(driver);
        this.timelinePosting = new TimelinePosting(driver);
    }

    async navigation() {
        try {
                await this.waitAndClick(this.selectors.timelineNav);
                await this.waitAndClick(this.selectors.tab3); 
            } catch {
                return;
            }
    }


     // --- TIMELINE DELETION ---
    async postDeletion (index) {
        await this.navigation();
        await this.gesture.swipeDownToRefresh();
        if (await this.timelinePosting.emptyList()) return console.log(">>> No post found in timeline list nothing to delete");

        // >> timeline is empty <<
        const postList = await this.waitAndFind$$(this.selectors.timelineList, 5000);
        if(!postList || postList.length === 0) {
            console.log(">>> No post found in timeline list nothing to delete");
            return;
        }
        // >> if index is greater than timeline list <<
        if(index >= postList.length) {
            console.warn(`>>> Invalid index (${index}). Only ${postList.length} is available`);
            return;
        }

        try {

            const targetPost = postList[index];
            const textElement = await targetPost.$(this.selectors.postedText);
            const deletedPostItem = await textElement.getText().catch(() => "Unknown text");

            const postItem = await targetPost.$(this.selectors.approval);
            const isInReview = await postItem.isExisting().catch(() => false);
            if (isInReview) return console.info(">>> Post is in review and nothing to delete");

            await this.waitAndClick(this.selectors.postOption);

            const isModalDisplayed = await this.elementExists(this.selectors.postDelModalText, 3000);
            if (!isModalDisplayed) throw new Error(">>> Unexpected error or modal is not displayed");  
        
            const modalText = await this.waitAndGetText(this.selectors.postDelModalText);
            console.log(`>>> Deletion modal is displayed with wording: "${modalText}"`)

            await this.waitAndClick(this.selectors.postDelConfirm);

            const toastMsg = await this.elementExists(this.selectors.postDelToast);
            console.log (
                toastMsg
                ? ">>> Post successfully deleted and toast is displayed"
                : ">>> Post successfully deleted but toast is might delay or not displayed"
            );
        } catch (err) {
            throw new Error(`Unexpected error: "${err.message}"`);
        }
    }

}