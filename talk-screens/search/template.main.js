import { SearchScreenSelectors, TemplateSelectors } from "../../selectors/selectors";
import { BasePage } from "../base.js";
import { TemplateSettings } from "../mypage/templateSettings.main.js";

export class Template extends BasePage{
    constructor(driver) {
        super(driver);
        this.selectors = {
            ...TemplateSelectors,
            ...SearchScreenSelectors
        }
        this.templateSettings = new TemplateSettings(driver);
    }

    async 


}