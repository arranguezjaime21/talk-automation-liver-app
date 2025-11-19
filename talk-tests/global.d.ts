import { LoginScreen } from "../talk-screens/login/login.main.js";
import { Logout } from "../talk-screens/mypage/logout.main.js";
import { NotificationSettings } from "../talk-screens/mypage/notificationsettings.main.js";
import { AcquisitionStars } from "../talk-screens/mypage/stars.main.js";
import { StreamingBonus } from "../talk-screens/mypage/streambonus.main.js";
import { TemplateSettings } from "../talk-screens/mypage/templateSettings.main.js";
import { Permission } from "../talk-screens/permission/permission.main.js";
import { AttackTab } from "../talk-screens/search/attacktab.main.js";
import { CallAppeal } from "../talk-screens/search/callappeal.main.js";
import { CallSettings } from "../talk-screens/search/callsettings.main.js";
import { TimelinePosting } from "../talk-screens/timeline/timeline.posting.js";

declare global {
    var loginScreen: LoginScreen;
    var permission: Permission;
    var callSettings: CallSettings;
    var callAppeal: CallAppeal;
    var templateSettings: TemplateSettings;
    var logout: Logout;
    var acquisitionStars: AcquisitionStars;
    var notificationSettings: NotificationSettings;
    var streamingBonus: StreamingBonus;
    var attackTab: AttackTab;
    var timelinePosting: TimelinePosting;
}

export {};