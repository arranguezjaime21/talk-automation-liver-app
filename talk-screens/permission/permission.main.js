import { PERMISSION_CONFIG } from "../../configs/permission.config.js";
import { BasePage } from "../base.js"

export class Permission extends BasePage {
    constructor(driver) {
        super(driver);
        
        this.selectors = {
            permissionDisplay: 'id=com.fdc_machetalk_broadcaster:id/ll_permission_dialog',
            allowNotif: 'id=com.android.permissioncontroller:id/permission_allow_button'
        };
    }

    async allowPermission () {
        const dialog = await this.elementExists(this.selectors.permissionDisplay);
         if (!dialog) {
            console.log(">>> App permission already allowed!");
            return;
        }

        for (const{btnID, btnAllow, name} of PERMISSION_CONFIG ) {
            const btn = await this.driver.$(`id=${btnID}`);
            if (!(await btn.isEnabled())) continue;

             await btn.click();
             const allowBtn = await this.driver.$(`id=${btnAllow}`);
             if (await allowBtn.isDisplayed().catch(() => false)) {
                console.log(`🛠️ allowing ${name} permission... `);
                await allowBtn.click();
            }
        }

        // --- Allow Notification Permission ---
        const allowNotification = await this.waitAndFind(this.selectors.allowNotif, 5000);
        if (await allowNotification.isDisplayed().catch(() => false)) {
            console.log("🛠️ allowing notification permission...");
            await allowNotification.click();
        } else {
            console.log(">>> Notification already allowed!");
        }
    
    }


}