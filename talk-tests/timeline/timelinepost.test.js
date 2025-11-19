import { FakeData } from "../../helpers/faker.js";

describe ("Timeline Post", function () {
    this.timeout(90000);
    
    it("Posting Timeline base on postType set text | camera | gallery", async function () {
        await timelinePosting.postTimeline({
            content: FakeData.randomSentence(),
            postType: 'gallery',
        })
    });
})