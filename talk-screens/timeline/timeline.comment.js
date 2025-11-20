import { Gestures } from "../../helpers/gestures.js";
import { TimelinePageSelectors } from "../../selectors/selectors.js";
import { BasePage } from "../base.js";
import { TimelinePosting } from "./timeline.posting.js";

export class TimelineComment extends BasePage {
    constructor(driver) {
        super (driver);
        this.gesture = new Gestures(driver);
        this.selectors = TimelinePageSelectors;
        this.timelinePosting = new TimelinePosting(driver);
        
    }

    async navTabs () {
        try {
            await this.waitAndClick(this.selectors.timelineNav);
            await this.waitAndClick(this.selectors.tab3);
        } catch {
            return;
        }
    }

    async timelinePostItem (index) {
        await this.navTabs();
        await this.gesture.swipeDownToRefresh();

        if (await this.timelinePosting.emptyList()) return;

        const postList = await this.waitAndFind$$(this.selectors.timelineList);
        if(!postList || postList.length === 0) return console.log(">>> Timeline list is empty nothing to comment");
        if(index >= postList.length) return console.log(">>> Target post is not in the list")

        try {
            const targetPost = postList[index];
            const isInReview = await targetPost.$(this.selectors.approval);
            if(await isInReview.isExisting().catch(() => false)) return console.log(">>> Target post is still in review");
            await this.waitAndClick(this.selectors.commentIcon);
        } catch (error) {
            console.log(`Unexpected error: ${error.message}`);
        }
    }

    async timelineComment ({ comment }) {
        await this.timelinePostItem(0);
        await this.setValue(this.selectors.commentText, comment);
        const commentText = await this.waitAndGetText(this.selectors.commentText);
        console.log(`>>> Commented post: ${commentText}`);
        await this.waitAndClick(this.selectors.commentPost);
        await this.verifyPost(commentText);
    }

    async verifyPost (expectedText) {
        await this.driver.pause(2000);
        const commentList = await this.waitAndFind$$(this.selectors.commentList, 5000);
        if(!commentList || commentList.length === 0) return console.log(">>> no comment found on target timeline post");

        try {
            const targetItem = commentList[commentList.length -1];
            const post = await targetItem.$(this.selectors.commentedText).getText();
            const commentedPost = post.split("\n")[1]?.trim();
            
            if (expectedText.trim() === commentedPost.trim()) {
                console.log(">>> Commented post sucessfully matches on the comment list");
            } else {
                console.log(`>>> Incorrect wording post is displayed or comment posted did not match 
                Actual: "${commentedPost}"
                Expected: "${expectedText}"`);
            }
            const inReviewComment = await targetItem.$(this.selectors.inreviewCom);
            if(await inReviewComment.isExisting().catch(() => false)) return console.log(">>> Comment post successfully displayed and waiting approval");
            
        } catch (error) {
            throw new Error(`>>> Unexpected error: ${error.message}`);
        }
        
    }
}