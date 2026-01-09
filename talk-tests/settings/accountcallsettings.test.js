describe("Account Settings", function() {
    this.timeout(90000);

    it("Call Settings", async function () {
        //await accountSettings.navAccountCallSettings();
        await accountSettings.enableVideoAudioSettings();
    })

})