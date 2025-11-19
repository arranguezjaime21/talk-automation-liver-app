import { LoginScreen } from "../talk-screens/login/login.main.js";
import { Logout } from "../talk-screens/mypage/logout.main.js";
import { AcquisitionStars } from "../talk-screens/mypage/stars.main.js";
import { TemplateSettings } from "../talk-screens/mypage/templateSettings.main.js";
import { Permission } from "../talk-screens/permission/permission.main.js";
import { CallAppeal } from "../talk-screens/search/callappeal.main.js";
import { CallSettings } from "../talk-screens/search/callsettings.main.js";

declare global {
    var loginScreen: LoginScreen;
    var permission: Permission;
    var callSettings: CallSettings;
    var callAppeal: CallAppeal;
    var templateSettings: TemplateSettings;
    var logout: Logout;
    var acquisitionStars: AcquisitionStars;
}

export {};