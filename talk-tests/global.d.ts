import { LoginScreen } from "../talk-screens/login/login.main.js";
import { MessageList } from "../talk-screens/message/messagelist.main.js";
import { EditPage } from "../talk-screens/mypage/editpage.main.js";
import { Logout } from "../talk-screens/settings/logout.main.js";
import { NotificationSettings } from "../talk-screens/mypage/notificationsettings.main.js";
import { AcquisitionStars } from "../talk-screens/mypage/stars.main.js";
import { StreamingBonus } from "../talk-screens/mypage/streambonus.main.js";
import { TemplateSettings } from "../talk-screens/mypage/templatesettings.main.js";
import { Permission } from "../talk-screens/permission/permission.main.js";
import { AttackTab } from "../talk-screens/search/attacktab.main.js";
import { CallAppeal } from "../talk-screens/search/callappeal.main.js";
import { CallSettings } from "../talk-screens/search/callsettings.main.js";
import { TimelineComment } from "../talk-screens/timeline/timeline.comment.js";
import { TimelineDeletion } from "../talk-screens/timeline/timeline.deletion.js";
import { TimelineList } from "../talk-screens/timeline/timeline.list.js";
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
    var timelineDeletion: TimelineDeletion;
    var timelineList: TimelineList;
    var timelineComment: TimelineComment;
    var messageList: MessageList;
    var editPage: EditPage;
}

export {};