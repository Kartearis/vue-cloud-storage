import {defineStore} from 'pinia';
import UserRequestController from "@/controllers/userRequestController";

const defaultUserData = {token: null};


// TODO: Refactor those functions to storageController class
function buildLabel(prefix) {
    return `${prefix}--user`;
}

function getLocalUser(prefix) {
    const user = localStorage.getItem(buildLabel(prefix));
    if (user)
        return JSON.parse(user);
    // To be filled with other data later
    return defaultUserData;
}

function setLocalUser(prefix, data) {
    console.log('Save user');
    localStorage.setItem(buildLabel(prefix), JSON.stringify(data));
}

// TODO: Should handle requests failed because of 'unauthorized'
export const useAuthStore = defineStore('auth', {
    state: () => ({
        userRequestController: new UserRequestController('http://markwebdev.ru/api/v1'),
        user: defaultUserData
    }),
    getters: {
        isAuthorized: (state) => state.user?.token !== undefined && state.user.token !== null
    },
    actions: {
        /**
         * Authenticate user. Returns object with result data for view
         *
         * @param {string} email
         * @param {string} password
         * @returns {Promise<{success: boolean, errors: string[]}>}
         */
        async authenticate(email, password) {
            try {
                const token = await this.userRequestController.login(email, password);
                this.user.token = token;
                this.userRequestController.setToken(token);
                return {success: true, errors: ["Logged in!"]}
            }
            catch (e) {
                return {success: false, errors: e};
            }
        },

        /**
         * Register user. Returns object with results for view.
         *
         * @param {string} email
         * @param {string} password
         * @param {string} name
         * @returns {Promise<{success: boolean, errors: string[]}>}
         */
        async register(email, password, name) {
            try {
                await this.userRequestController.register(email, password, name);
                return {success: true, errors: ["Registered!"]};
            }
            catch (e) {
                return {success: false, errors: e};
            }
        },

        /**
         * Make a logout call to API. Caller expected to redirect user afterwards
         *
         * @returns {Promise<void>}
         */
        async logout() {
            await this.userRequestController.logout();
            this.user = defaultUserData;
            this.userRequestController.setToken(null);
        },

        /**
         * Attempt to recover user data from localhost
         */
        tryRememberUser() {
            console.log('Remember user');
            this.user = getLocalUser('vue-cloud-storage');
            if (this.user.token)
                this.userRequestController.setToken(this.user.token);
        }
    },
});

// TODO: replace with Promise.resolve
setTimeout(() => {
    const store = useAuthStore();
    store.tryRememberUser();
    store.$subscribe((
        mutation,
        state) => setLocalUser('vue-cloud-storage', state.user));
}, 0);

