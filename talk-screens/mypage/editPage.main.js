import { Gestures } from "../../helpers/gestures.js";
import { EditPageSelectors, MyPageSelectors } from "../../selectors/selectors.js";
import { BasePage } from "../base.js";

export class EditPage extends BasePage{
    constructor (driver) {
        super(driver);
        this.selectors = {
            ...MyPageSelectors,
            ...EditPageSelectors,
        }
        this.gesture = new Gestures(driver);
    }


    async navEditPage () {
        try {
            await this.waitAndClick(this.selectors.myPageNav);
            await this.waitAndClick(this.selectors.myPageEditPage);
        } catch {
            await this.waitAndClick(this.selectors.myPageEditPage);
            return[];
        }
    }

    async selfIntro ({selfIntro}) {
        await this.navEditPage();
        await this.gesture.swipeDownToRefresh();
        await this.waitAndClick(this.selectors.itemSelfIntro);
        await this.setValue(this.selectors.editSelfIntro, selfIntro);
        await this.waitAndClick(this.selectors.btnSave);
        
    }

    async userAge () {
        await this.waitAndClick(this.selectors.itemAge);

    }
}