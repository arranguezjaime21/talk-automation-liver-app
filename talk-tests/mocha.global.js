import { remote } from "webdriverio";
import { emulatorCaps } from "../helpers/capabilities.js";
import { LoginScreen } from "../talk-screens/login/login.main.js";
import { Permission } from "../talk-screens/permission/permission.main.js";
import { CallSettings } from "../talk-screens/search/callsettings.main.js";
import { CallAppeal } from "../talk-screens/search/callappeal.main.js";
import { TemplateSettings } from "../talk-screens/mypage/templatesettings.main.js";
import { Logout } from "../talk-screens/settings/logout.main.js";
import { AcquisitionStars } from "../talk-screens/mypage/stars.main.js";
import { NotificationSettings } from "../talk-screens/mypage/notificationsettings.main.js";
import { StreamingBonus } from "../talk-screens/mypage/streambonus.main.js";
import { AttackTab } from "../talk-screens/search/attacktab.main.js";
import { TimelinePosting } from "../talk-screens/timeline/timeline.posting.js";
import { TimelineDeletion } from "../talk-screens/timeline/timeline.deletion.js";
import { TimelineList } from "../talk-screens/timeline/timeline.list.js";
import { TimelineComment } from "../talk-screens/timeline/timeline.comment.js";
import { MessageList } from "../talk-screens/message/messagelist.main.js";
import { EditPage } from "../talk-screens/mypage/editpage.main.js";
import { AccountSettings } from "../talk-screens/settings/accounsettings.main.js";

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
        global.templateSettings = new TemplateSettings(global.driver);
        global.logout = new Logout(global.driver);
        global.acquisitionStars = new AcquisitionStars(global.driver);
        global.notificationSettings = new NotificationSettings(global.driver);
        global.streamingBonus = new StreamingBonus(global.driver);
        global.attackTab = new AttackTab(global.driver);
        global.timelinePosting = new TimelinePosting(global.driver);
        global.timelineDeletion = new TimelineDeletion(global.driver);
        global.timelineList = new TimelineList(global.driver);
        global.timelineComment = new TimelineComment(global.driver);
        global.messageList = new MessageList(global.driver);
        global.editPage = new EditPage(global.driver);
        global.accountSettings = new AccountSettings(global.driver);
    
    },

async afterAll() {
    if (global.driver) {
        await global.driver.deleteSession();
    }
  },
};