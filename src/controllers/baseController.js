import axios from "axios";

// TODO: change default error handler to 422-handler instead of null
export default class BaseController {
    client

    constructor(host, settings = null) {
        if (!settings) settings = {
            baseURL: host,
            timeout: 2000,
            headers: {'Content-Type': 'application/json'}
        };
        this.client = axios.create(settings);
    }

    async genericPostRequest(url, params, errorHandler = null) {
        try {
            const response = await this.client.post(url, {}, {
                params: params
            });
            return response.data;
        } catch (e) {
            if (errorHandler)
                errorHandler(e);
            else throw e;
        }
    }

    async genericGetRequest(url, params = {}, errorHandler = null) {
        try {
            const response = await this.client.get(url, {
                params: params
            });
            return response.data;
        } catch (e) {
            if (errorHandler)
                errorHandler(e);
            else throw e;
        }
    }

    async genericDeleteRequest(url, params = {}, errorHandler = null) {
        try {
            const response = await this.client.delete(url, {
                params: params
            });
            return response.data;
        } catch (e) {
            if (errorHandler)
                errorHandler(e);
            else throw e;
        }
    }

    /**
     * Converts provided Date object to required by API string representation
     *
     * @param {Date} date
     * @returns {string} DateTime in format 'YYYY-MM-DD HH:MM'
     */
    convertDateTime(date) {
        const parts = date.toISOString().split('T');
        parts[1] = parts[1].split('.')[0];
        return `${parts[0]} ${parts[1]}`;
    }

}