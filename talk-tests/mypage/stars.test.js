describe ("Star Acqusition Test", function() {
    this.timeout(90000);

    it("Stars acquisition", async function () {
        await acquisitionStars.userStars();
    })
})