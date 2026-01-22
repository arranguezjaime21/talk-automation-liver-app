import { FakeData } from "../../helpers/faker.js";

describe("Mypage Template Settings", function () {
    this.timeout(90000);

    it("Template Creation", async function () {
        await templateSettings.navTemplateCreationScreen();
        await templateSettings.createTemplate({
            content: FakeData.randomSentence(),
            templateType: "text",
        })
    })
})