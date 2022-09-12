import {defineStore} from 'pinia';
import UserRequestController from "@/controllers/userRequestController";

const defaultUserData = {token: null};

function getLocalUser(prefix) {
    const user = localStorage.getItem(`${prefix}--user`);
    if (user)
        return JSON.parse(user);
    // To be filled with other data later
    return defaultUserData;
}

function setLocalUser(prefix, data) {
    console.log('Save user');
    localStorage.setItem(`${prefix}--user`, JSON.stringify(data));
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        userRequestController: new UserRequestController('http://markwebdev.ru/api/v1'),
        user: defaultUserData
    }),
    getters: {
        isAuthorised: (state) => state.user?.token !== undefined && state.user.token !== null
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

setTimeout(() => {
    const store = useAuthStore();
    store.tryRememberUser();
    store.$subscribe((
        mutation,
        state) => setLocalUser('vue-cloud-storage', state.user));
}, 0);

