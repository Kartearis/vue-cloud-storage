import axios from "axios";

// Request controller for authorised requests
// TODO: refactor
export default class UserRequestController {
    client
    token

    constructor(host) {
        this.token = null;
        this.client = axios.create({
            baseURL: host,
            timeout: 2000,
            headers: {'Content-Type': 'application/json'}
        });
        this.client.interceptors.request.use((config) => {
            config.headers.Authorization =  this.token ? `Bearer ${this.token}` : '';
            return config;
        });
    }

    /**
     * Sets handler for error 401. Should be called after authStore creation.
     *
     * @param handler handler function. Error will be passed as parameter. Default: empty function.
     */
    setUnAuthHandler(handler = () => {}) {
        this.client.interceptors.response
            .use(
                (response) => response,
                (error) => {

                    if (error.status === 401)
                    {
                        handler(error);
                    }
                    return error;
                })
    }

    setToken(token) {
      this.token = token;
    }

    /**
     * Makes a login request to API
     *
     * @throws Error message on 422 (either wrong email or password)
     *
     * @param {string} email user email
     * @param {string} password user password
     * @returns {Promise<string>} user bearer token
     */
    async login(email, password) {
        const content = await this.genericPostRequest('/auth/login', {email, password},
            (e) => {
                if (e.response && e.response.status === 422) {
                    throw Object.values(e.response.data.errors).flat();
                }
            });
        return content.data.token;
    }

    /**
     * Makes a register call to API.
     *
     * @throws "Email already in use" on status 422
     *
     * @param {string} email User email
     * @param {string} password User password
     * @param {string} name User name
     * @returns {Promise<void>}
     */
    async register(email, password, name) {
        await this.genericPostRequest('/auth/register', {
            email, password, name
        }, (e) => {
            if (e.response && e.response.status === 422) {
                throw Object.values(e.response.data.errors).flat();
            }
        });
    }

    /**
     * Makes a logout request to API
     *
     * @returns {Promise<void>}
     */
    async logout() {
        return this.genericPostRequest('/auth/logout', {});
    }

    async getUserData() {
        const response = await this.client.get('/user');
        return response.data.data;
    }

    async getFiles(folderId = -1) {
        const data = await this.genericGetRequest('/files', { folder_id: folderId });
        return data.data;
    }

    async getFolders() {
        const data = await this.genericGetRequest('/folders', {});
        return data.data;
    }

    async genericPostRequest(url, params, errorHandler = null) {
        console.log(params);
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

    async genericGetRequest(url, params, errorHandler = null) {
        console.log(url, params);
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
}