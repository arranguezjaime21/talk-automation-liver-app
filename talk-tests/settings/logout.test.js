describe ("User Logout Test", function () {
    this.timeout(90000);
    
    it("Logout user via various settings", async function () {
        await logout.userLogout();
    });
})