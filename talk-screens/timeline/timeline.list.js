import { TimelinePageSelectors } from "../../selectors/selectors.js";
import { BasePage } from "../base.js";

export class TimelineList extends BasePage{
    constructor (driver) {
        super (driver);
        this.selectors = TimelinePageSelectors;
    }

    async navTab1 () {
        try {
            await this.waitAndClick(this.selectors.timelineNav);
            await this.waitAndClick(this.selectors.tab1);
        } catch {
            return;
        }
    }

    async timelineSort({ sort = "recommended" }) {
        await this.navTab1();

        const sortList = {
            recommended: {
                label: "おすすめ順",
                oppositeLabel: "新着順",
                btn: this.selectors.sortRecommended,
            },
            latest: {
                label: "新着順",
                oppositeLabel: "おすすめ順",
                btn: this.selectors.sortLatest,
            }
        };
        
        try {

            const sortType  = sortList[sort];
            if(!sortType) throw new Error (`>>> Invalid sortType: ${sort}, use only "recommended" | "latest"`);
            const currentSort = await this.waitAndGetText(this.selectors.sortLabel);

            if(currentSort === sortType.label) return console.log(`>>> ${sort} sorting is already displayed`);
            if(currentSort === sortType.oppositeLabel) {
                await this.waitAndClick(this.selectors.sortLabel);
                await this.waitAndClick(sortType.btn);

                const updatedSort = await this.waitAndGetText(this.selectors.sortLabel);
                console.log(`Timeline list is displayed under ${sort}, sort text: "${updatedSort}"`);
                return;
            }
            console.warn(`Unpexted text: "${currentSort}", expected: "${sortInfo.label}"`);
        } catch (err) {
            throw new Error(`Unexpected error or sorting element not found: ${err.message}`);
        }
    }

}