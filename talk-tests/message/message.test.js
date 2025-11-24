import { FakeData } from "../../helpers/faker.js";

describe("Message Test", function() {
    this.timeout(90000);

    it.only("Message", async function() {
        await messageList.sendMessage({
            msg: FakeData.randomSentence(),
        });
    });
})