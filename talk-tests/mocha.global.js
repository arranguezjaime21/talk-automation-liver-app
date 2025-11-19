import { remote } from "webdriverio";
import { emulatorCaps } from "../helpers/capabilities.js";
import { LoginScreen } from "../talk-screens/login/login.main.js";
import { Permission } from "../talk-screens/permission/permission.main.js";
import { CallSettings } from "../talk-screens/search/callsettings.main.js";
import { CallAppeal } from "../talk-screens/search/callappeal.main.js";

export const mochaHooks = {
async beforeAll() {
    this.timeout(90000);

    global.driver = await remote({
      path: "/",
      port: 4723,
      hostname: "127.0.0.1",
      logLevel: "error",
      capabilities: emulatorCaps,
    });

        global.loginScreen = new LoginScreen(global.driver);
        global.permission = new Permission(global.driver);
        global.callSettings = new CallSettings(global.driver);
        global.callAppeal = new CallAppeal(global.driver);

    },

async afterAll() {
    if (global.driver) {
        await global.driver.deleteSession();
    }
  },
};