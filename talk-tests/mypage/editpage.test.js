
describe ("Edit Page Test", function () {
    this.timeout(90000);

    it.only("Edit Page Testing", async function () {
        //await editPage.navEditPage();
        await editPage.changeProfile({
            profile: "camera",
        })
       
    })
})