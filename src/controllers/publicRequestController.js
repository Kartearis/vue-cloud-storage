import BaseController from "@/controllers/baseController";

export default class PublicRequestController extends BaseController{

    downloadPublicFile(uuid) {
        const path = `${this.client.getUri()}/downloads/${uuid}`;
        console.log(path);
        try {
            window.open(path);
        } catch(e) {
            console.log(e);
        }
    }

}