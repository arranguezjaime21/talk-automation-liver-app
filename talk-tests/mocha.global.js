import { remote } from "webdriverio";
import { emulatorCaps } from "../helpers/capabilities.js";
import { LoginScreen } from "../talk-screens/login/login.main.js";

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

    },

async afterAll() {
    if (global.driver) {
        await global.driver.deleteSession();
    }
  },
};