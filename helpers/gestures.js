export class Gestures {
    constructor(driver) {
        this.driver = driver;
    }

    async scroll({ element = null, direction = "down", speed = 1200 }) {
        let rect;

        if (element) {
            rect = await element.getRect();      // element-based scroll
        } else {
            rect = await this.driver.getWindowRect(); // full screen scroll
        }

        const startX = rect.x + rect.width / 2;
        const startY = direction === "down"
            ? rect.y + rect.height * 0.8
            : rect.y + rect.height * 0.3;

        const endY = direction === "down"
            ? rect.y + rect.height * 0.3
            : rect.y + rect.height * 0.8;

        await this.driver.execute('mobile: dragGesture', {
            startX,
            startY,
            endX: startX,
            endY,
            speed,
        });

        await this.driver.pause(500);
    }

    // --- screen-level helpers ---

    async scrollDown(speed = 1200) {
        return this.scroll({ direction: "down", speed });
    }

    async scrollUp(speed = 1200) {
        return this.scroll({ direction: "up", speed });
    }

    async swipeDownToRefresh() {
        const { width, height } = await this.driver.getWindowRect();

        await this.driver.execute('mobile: dragGesture', {
            startX: width / 2,
            startY: height * 0.3,
            endX: width / 2,
            endY: height * 0.8,
            speed: 1400,
        });
    }

    // --- element-level scroll until target text appears ---

    async scrollUntilVisible({ container, text, maxScroll = 10 }) {
        for (let i = 0; i < maxScroll; i++) {
            const item = await this.driver
                .$(`//*[@text="${text}"]`)
                .catch(() => null);

            if (item && (await item.isDisplayed())) {
                return item;
            }

            await this.scroll({ element: container, direction: "down" });
        }

        throw new Error(`Element with text "${text}" not found after scrolling`);
    }
}