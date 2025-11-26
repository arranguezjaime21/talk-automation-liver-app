import { FakeData } from "../../helpers/faker.js";

describe ("Edit Page Test", function () {
    this.timeout(90000);

    it.only("Edit Page Testing", async function () {
        await editPage.navEditPage();
        await editPage.profileUpdate({
            uploadVia: "gallery",
        })
    })
})