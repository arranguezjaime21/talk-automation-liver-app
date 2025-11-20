import { FakeData } from "../../helpers/faker.js";

describe ("Timeline Post", function () {
    this.timeout(90000);
    
    it("Posting Timeline base on postType set text | camera | gallery", async function () {
        await timelinePosting.postTimeline({
            content: FakeData.randomSentence(),
            postType: 'gallery',
        })
    });

    it("Timeline Deletion", async function () {
        await timelineDeletion.postDeletion(0);
    });

    it("Timeline List Sorting", async function () {
        await timelineList.timelineSort({
            sort: "recommended",
        });
    });
    it("Timeline Comment", async function () {
        await timelineComment.timelineComment({
            comment: FakeData.randomSentence(),
        });
    });
    it.only("Timeline Comment Deletion", async function () {
        await timelineComment.timelinePostItem(0);
        await timelineDeletion.commentDeletion(0);
    });
})