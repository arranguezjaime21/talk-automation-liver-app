import { LoginScreen } from "../talk-screens/login/login.main.js";
import { Permission } from "../talk-screens/permission/permission.main.js";
import { CallAppeal } from "../talk-screens/search/callappeal.main.js";
import { CallSettings } from "../talk-screens/search/callsettings.main.js";

declare global {
    var loginScreen: LoginScreen;
    var permission: Permission;
    var callSettings: CallSettings;
    var callAppeal: CallAppeal;
}

export {};