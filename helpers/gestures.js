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

    async _swipeInsidePicker(elementOrSelector) {
        // Resolve element
        let el = elementOrSelector;
        if (typeof elementOrSelector === 'string') {
            el = await this.driver.$(elementOrSelector);
        }
        if (Array.isArray(el)) el = el[0];

        // Get boundaries
        let rect = typeof el.getRect === 'function'
            ? await el.getRect()
            : {
                ...(await el.getLocation()),
                ...(await el.getSize())
            };

        const startX = Math.round(rect.x + rect.width / 2);
        const startY = Math.round(rect.y + rect.height * 0.7);
        const endY   = Math.round(rect.y + rect.height * 0.3);

        // Perform W3C Touch Action (modern Appium)
        await this.driver.performActions([{
            type: "pointer",
            id: "finger1",
            parameters: { pointerType: "touch" },
            actions: [
                { type: "pointerMove", duration: 0, x: startX, y: startY },
                { type: "pointerDown", button: 0 },
                { type: "pause", duration: 200 },
                { type: "pointerMove", duration: 300, x: startX, y: endY },
                { type: "pointerUp", button: 0 }
            ]
        }]);

        // Reset actions (important)
        await this.driver.releaseActions();
    }

}