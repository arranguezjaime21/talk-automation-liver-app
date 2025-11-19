describe ("Attack Tab Test", function () {
    this.timeout(90000);
   
    it ("sending template", async function () {
        await attackTab.sendTemplate(2);
    });
})