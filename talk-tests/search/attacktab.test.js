import { FakeData } from "../../helpers/faker.js";

describe ("Attack Tab Test", function () {
    this.timeout(90000);
   
    it.only ("sending template", async function () {
        await attackTab.sendTemplate();
    });

    it ("template settings ", async function () {
        await attackTab.searchTemplateSettings();
        await templateSettings.templateCreation({
            content: FakeData.randomSentence(),
            templateType: 'gallery',
        });
    })
})