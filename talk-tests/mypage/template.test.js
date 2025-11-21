import { FakeData } from "../../helpers/faker.js";


describe ("Mypage Template Settings Test", function () {
  this.timeout(90000);


  it("Create Template with image upload via device gallery", async function () {
    await templateSettings.navMyPageTemplate();
    await templateSettings.templateCreation({
      content: FakeData.randomSentence(),
      templateType: "gallery",
    });
  });

})