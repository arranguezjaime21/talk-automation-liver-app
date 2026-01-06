export class CameraHelper {
    constructor(driver, waitAndClick, waitAndFind, waitAndFind$$) {
        this.driver = driver;
        this.waitAndClick = waitAndClick;
        this.waitAndFind = waitAndFind;
        this.waitAndFind$$ = waitAndFind$$;
    }

    async templateCamera (selectors) {
         const steps = [
            selectors.btnIDCam,
            selectors.btnCamera,
            selectors.btnCapture,
            selectors.btnConfirm,
            selectors.btnUpload
        ];

        for(const step of steps) {
            if(step) {
                await this.waitAndClick(step);
            } else {
                console.warn(">>> element not found or missing element");
            }
        }
        
    }

    async templateGallery (selectors) {
        await this.waitAndClick(selectors.btnIDCam);
        await this.waitAndClick(selectors.btnGallery);
        
        const permissionDialog = await this.waitAndFind(selectors.libraryDialog, 3000);
        if (permissionDialog) {
        console.log(">>> Permission dialog detected — granting access...");
        await this.waitAndClick(selectors.allowLibrary);
        await this.driver.pause(1000);
        await this.waitAndClick(selectors.btnIDCam);
        await this.waitAndClick(selectors.btnGallery);
        } else {
        console.log(">>> Permission for device library already granted");
        }
        
        await this.waitAndClick(selectors.deviceFile);
        const gallery = await this.waitAndFind(selectors.deviceGallery);
        const picture = await this.waitAndFind$$(selectors.galleryItems, 5000);
        await picture[2].click();

        await this.waitAndClick(selectors.btnUpload);
    }

    async timelineCamera (selectors) { 
        const steps = [
            selectors.postCamera,
            selectors.btnCapture,
            selectors.btnConfirm,
            selectors.btnUpload,
        ];
        for (const step of steps) { 
            if (step) {
                await this.waitAndClick(step);
            } else {
                console.warn("!missing selector in step list");
            }
        }
    }

    async timelineGallery (selectors) {
        const elements = await this.waitAndFind$$(selectors.postGallery, 4000);
        const count = elements.length;
        
        if (count === 2) { //permission not allow
            //console.log(">>>Permission not allow, allowing permission...")
            await elements[1].click();
            const permission = await this.waitAndFind(selectors.libraryDialog);
            if (permission) {
                await this.waitAndClick(selectors.allowLibrary);
            }
            await this.waitAndClick(selectors.deviceFile);
            const gallery = await this.waitAndFind(selectors.deviceGallery, 3000);
            const image = await this.waitAndFind$$(selectors.galleryItems);
            await image[2].click()
            await this.waitAndClick(selectors.btnUpload);
        } else if (count > 2) { //permission already allowed
            await elements[2].click();
            await this.waitAndClick(selectors.btnUpload);
        }

    }

    async profileCamera (selectors) {
        await this.waitAndClick(selectors.profileCamera);
        const permission = await this.waitAndFind(selectors.permissionDialog, 3000);
        if(permission) {
            console.log(">>> Permission required, allowing permission...");
            await this.waitAndClick(selectors.allowCamPermission);
        } 

        const steps = [
            selectors.btnCapture,
            selectors.btnConfirm,
            selectors.btnUpload,
        ];

        for (const step of steps) {
            if(step) {
                await this.waitAndClick(step);
            } else {
                console.log(">>> Element not found or missing")
            }
        }
    }
    
    async profileGallery (selectors) {
        await this.waitAndClick(selectors.profileGallery);
        const permission = await this.waitAndFind(selectors.permissionDialog, 3000);
        if(permission) {
            console.log(">>> Permission required, allowing permission...");
            await this.waitAndClick(selectors.allowAllLibrary);
        }
        
        await this.waitAndClick(selectors.folderList);
        const galleryList = this.waitAndFind(selectors.galleryImageList, 3000);
        if(!galleryList) return console.log(">> No found image in the list");
        const galleryItems = await this.waitAndFind$$(selectors.galleryImageItems);
        if(galleryItems.length === 0) return console.log(">>> Selected folder is empty or no image found");
        await galleryItems[0].click();
        await this.waitAndFind(selectors.cropLayout, 3000);
        await this.waitAndClick(selectors.btnUpload);
        

    }
}