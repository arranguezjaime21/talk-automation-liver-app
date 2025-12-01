describe ("Account Settings Test", function () {
    this.timeout(90000);

    it("Modify Call Settings in Account Settings", async function () {
        await accountSettings.navAccountSettings();
        await accountSettings.disableAudioVideoSettings();
    });
});