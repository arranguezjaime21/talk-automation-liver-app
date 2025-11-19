import { LoginScreen } from "../talk-screens/login/login.main.js";
import { Permission } from "../talk-screens/permission/permission.main.js";

declare global {
    var loginScreen: LoginScreen;
    var permission: Permission;
}

export {};