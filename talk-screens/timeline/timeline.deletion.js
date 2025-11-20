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
            const deletedPostItem = await textElement.getText().catch(() => null);

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

            // -- verifying the deleted timeline post --
            await this.gesture.swipeDownToRefresh();

            const updatedList = await this.waitAndFind$$(this.selectors.timelineList, 5000);
            let stillExist = false;
            for (const item of updatedList) {
                const txt = await item.$(this.selectors.postedText).getText().catch(() => "");
                if (deletedPostItem && txt.includes(deletedPostItem)) {
                    stillExist = true;
                    break;
                }
            }

            if(stillExist) {
                console.log(`>>> ERROR: Deleted post is still in the list - "${deletedPostItem}" `);
            } else {
                console.log(`>>> SUCCESS: Deleted post is successfully remove in the timeline list - "${deletedPostItem}"`);
            }
        } catch (err) {
            throw new Error(`Unexpected error: "${err.message}"`);
        }
    }

    // -- COMMENT DELETION --
    async commentDeletion (index) {
        await this.navigation();
    
        const commentList = await this.safeFindAll(this.selectors.commentList);
        if(!commentList || commentList.length === 0) return console.log(">>> No comment list in target post nothing to delete");
        if (index >= commentList.length) return console.log(`Invalid inputted index: ${index}. Only ${commentList.length - 1} is the highest valid index`);

        try {
            const targetComment = commentList[index];
            const commentTxtEl = await targetComment.$(this.selectors.commentedText);
            const deletedComment = await commentTxtEl.getText().catch(() => null);

            const isInReview = await targetComment.$(this.selectors.inreviewCom).isExisting().catch(() => false);
            if(isInReview) return console.log(">>> Target comment still in review and cannot be deleted");

            await targetComment.$(this.selectors.commentOption).click();
            
            const deletionModal = await this.elementExists(this.selectors.commentDeleteWording, 3000);
            if(!deletionModal) throw new Error(">>> Unexpected error or modal is not displayed"); 
            
            await this.waitAndClick(this.selectors.commentConfirmDelete);

            const toastMsg = await this.elementExists(this.selectors.commentDeletionToast, 3000);

            console.log (
                toastMsg
                ? ">>> Comment post successfully deleted and toast is displayed"
                : ">>> Comment post successfully deleted but toast is might delay or not displayed"
            );

            // -- verifying deleted comment-- 
            const updatedCommentList = await this.safeFindAll(this.selectors.commentList, 5000);
            let isDeleted = false;

            for (const comment of updatedCommentList) {
                const txt = await comment.$(this.selectors.commentedText).getText().catch(() => "");
                if(deletedComment && txt.includes(deletedComment)) {
                    isDeleted = true;
                    break;
                }
            }

            if(isDeleted) {
                console.log(`>>> ERROR: Deleted comment is still displayed in the comment list - ${deletedComment}`);
            } else {
                console.log(`>>> SUCCESS: Deleted comment is successfully removed in the comment list - ${deletedComment}`);
            }

        } catch (err) {
            throw new Error(`Unexpected error: ${err.message}`);
        }
        
    }

}