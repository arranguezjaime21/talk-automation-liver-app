export class BasePage { 
    constructor(driver) {

        this.driver = driver;
    }

    async waitAndClick (selector, timeout = 5000) {
        const el = await this.driver.$(selector);
        await el.waitForDisplayed({ timeout });
        await el.click();
    }
    
    async waitAndFind$$ (selector, timeout = 5000) {
        const elements = await this.driver.$$(selector);

        if(elements.length === 0) {
            throw new Error (`Element not found: ${selector}`);
        }

        for (const el of elements) {
            await el.waitForDisplayed({timeout});
        }
        return elements;
    }

    async setValue (selector, value, timeout = 5000) {
        const el = await this.driver.$(selector, timeout);
        await el.clearValue();
        await el.setValue(value);
    }

    async waitAndFind(selector, timeout = 5000) {
        try {
            const element = await this.driver.$(selector);
            await element.waitForDisplayed({ timeout });
            return element;
        } catch {
            return null;
        }
    }

    async elementExists(selector, timeout = 5000) {
        try {
            const el = await this.waitAndFind(selector, timeout);
            return el ? await el.isDisplayed().catch(() => false) : false;
        } catch {
            return false;
        }
    }

    async waitAndGetText (selector, timeout = 5000) {
        try {
            const el = await this.waitAndFind(selector, timeout);
            const text = await el.getText();
            return text;
        } catch {
            return null;
        }
    }

    async isButtonEnable (selector, timeout = 3000) {
        try {
            const el = await this.waitAndFind(selector, timeout);
            const btnStats = await el.getAttribute("checked");
            return btnStats === "true";
        } catch {
            return false;
        }
    }

    async safeFindAll(selector, timeout = 3000) {
        try {
            return await this.waitAndFind$$(selector, timeout);
        } catch (err) {
            return []; 
        }   
    }


}