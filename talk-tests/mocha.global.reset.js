import { remote } from "webdriverio";
import { emulatorCapsReset } from "../helpers/capabilities.js";
import { LoginScreen } from "../talk-screens/login/login.main.js";
import { Permission } from "../talk-screens/permission/permission.main.js";

export const mochaHooks = {
async beforeAll() {
    this.timeout(90000);

    global.driver = await remote({
      path: "/",
      port: 4723,
      hostname: "127.0.0.1",
      logLevel: "error",
      capabilities: emulatorCapsReset,
    });

        global.loginScreen = new LoginScreen(global.driver);
        global.permission = new Permission(global.driver);

    },

async afterAll() {
    if (global.driver) {
        await global.driver.deleteSession();
    }
  },
};