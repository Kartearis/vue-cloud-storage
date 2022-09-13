import axios, {AxiosError} from "axios";

const LONG_TIMEOUT = 1000 * 60 * 60;
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

    async getFolder(folderId) {
        const data = await this.genericGetRequest(`/folders/${folderId}`, {},
        (e) => {
            if (e.response && e.response.status === 404)
                throw 'Folder not found';
        });
        return data.data;
    }

    async createFolder(folderName) {
        try {
            const response = await this.genericPostRequest('/folders', {name: folderName});
            if (response instanceof AxiosError)
                throw response;
            else return response.data;
        } catch (e) {
            if (e.response && e.response.status === 422)
                throw Object.values(e.response.data.errors).flat();
            throw e;
        }
    }

    async renameFile(id, newName) {
        try {
            const result = await this.client.patch(`/files/${id}`, {}, {
                params: {
                    name: newName
                }
            });
            if (result instanceof AxiosError)
                throw result;
            return result.data.data;
        } catch (e) {
            if (e.response && e.response.status === 422)
                throw Object.values(e.response.data.errors).flat();
        }
    }

    async publishFile(id) {
        try {
            const result = await this.genericPostRequest(`/files/${id}/publish`, {});
            if (result instanceof AxiosError)
                throw result;
            return result.data;
        } catch (e) {
            if (e.response && e.response.status === 422)
                throw Object.values(e.response.data.errors).flat();
        }
    }

    async deleteFile(id) {
        await this.genericDeleteRequest(`/files/${id}`, {}, (e) => {
            if (e.response && e.response.status === 404)
                throw 'File not found. Maybe it has expired?';
            throw e;
        });
    }

    async uploadFile(file, folder_id = -1, expires_at = null, progressHandler = () => {}) {
        const formData = new FormData();
        formData.append("file", file);
        if (folder_id !== -1)
            formData.append("folder_id", folder_id);
        if (expires_at)
            formData.append("expires_at", this.convertDateTime(expires_at));
        try {
            const response = await this.client.post('/files', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                timeout: LONG_TIMEOUT,
                onUploadProgress: progressHandler
            });
            if (response instanceof AxiosError)
                throw response;
            else return response.data.data;
        } catch (e) {
            if (e.response && e.response.status === 422)
            {
                throw Object.values(e.response.data.errors).flat();
            }
            else throw e;
        }
    }

    async downloadFile(file, progressHandler = () => {}) {
        try {
            const response = await this.client.get(`/files/${file.id}/download`, {
                responseType: 'blob',
                timeout: LONG_TIMEOUT,
                onDownloadProgress: progressHandler
            });
            if (response instanceof AxiosError)
                throw response;
            // Content disposition is unavailable, so full_name from file data is used
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.full_name);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (e) {
            if (e.response && e.response.status === 404)
                throw 'File not found. Maybe it has expired?';
            throw e;
        }
    }

    async genericPostRequest(url, params, errorHandler = null) {
        // console.log(params);
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
        // console.log(url, params);
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

    async genericDeleteRequest(url, params, errorHandler = null) {
        // console.log(url, params);
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