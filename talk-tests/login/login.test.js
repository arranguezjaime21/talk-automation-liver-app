import { FakeData } from "../../helpers/faker.js";
import { handleSavePass } from "../../helpers/handleSavePass.js";
import { user } from "../../test-data/user.js";


describe ("Login Screen Test", function () {
    this.timeout(90000);

    it ("Login fail using incorrect credentials", async function () {
        await loginScreen.gotoMailLogin();
        await loginScreen.loginFlow({
            email: FakeData.randomEmail(),
            password: FakeData.randomPassword(),
        });

        await loginScreen.errMsg("•メールアドレスまたは、パスワードに誤りがあります。");
    });

    user.forEach(user => {
    it.only ("Login successfully using correct credentials", async function () {
        await loginScreen.gotoMailLogin();
        await loginScreen.loginFlow({
            email: user.email,
            password: user.password,
        });
        await driver.pause(2000);
        await handleSavePass(driver);
        await permission.allowPermission();
        
    });
    });
    
   
})