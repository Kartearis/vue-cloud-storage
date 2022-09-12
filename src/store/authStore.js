import {defineStore} from 'pinia';
import UserRequestController from "@/controllers/userRequestController";

/**
 * Date reviver function for json.parse
 *
 * @param key
 * @param value
 * @returns {Date|*}
 */
function dateTimeReviver(key, value) {
    if (typeof value === 'string') {
        let reISO = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;
        if (reISO.test(value)) {
            return new Date(value);
        }
    }
    return value;
}

function fileSizeFormatter(bytes) {
    switch (true) {
        case bytes > 1000000:
            return `${(bytes / 1000000).toFixed(2)} MB`;
        case bytes > 1000:
            return `${(bytes / 1000).toFixed(2)} KB`;
        default: return `${bytes} B`;
    }
}

/**
 * Generates default userdata object. Fields with displayable: false will not be displayed with other user info
 * Label is human-readable field title
 * TODO: refactor to class with field iterator (for view) and field getters/setters (for others)
 *
 * @type {() => Record<string, {value: unknown, label: string} | {displayable: false, value: unknown}>}
 */
const getDefaultUserData = () => ({
    name: {
        value: "",
        label: "Username"
    },
    email: {
        value: "",
        label: "Email"
    },
    storageInUse: {
        label: "Storage in use",
        value: 0,
        formatter: fileSizeFormatter
    },
    storageTotal: {
        label: "Total storage",
        value: 0,
        formatter: fileSizeFormatter
    },
    registrationDate: {
        value: "",
        label: "Registration date",
        formatter: (date) => date.toLocaleString()
    },
    token: {
        displayable: false,
        value: null
    }
});


// TODO: Refactor those functions to storageController class
function buildLabel(prefix) {
    return `${prefix}--user`;
}

// Function to read local user from storage. Ugly, all this mess should be remade into userData class
function getLocalUser(prefix) {
    let user = localStorage.getItem(buildLabel(prefix));
    if (!user)
        return getDefaultUserData();
    user = JSON.parse(user, dateTimeReviver);
    const defUser = getDefaultUserData();
    // restore formatters
    Object.keys(user).forEach((key) => {
        if (defUser[key].formatter !== undefined)
            user[key].formatter = defUser[key].formatter;
    })
    return user;
}

function setLocalUser(prefix, data) {
    console.log('Save user');
    localStorage.setItem(buildLabel(prefix), JSON.stringify(data));
}

// TODO: Should handle requests failed because of 'unauthorized'
export const useAuthStore = defineStore('auth', {
    state: () => ({
        userRequestController: new UserRequestController('http://markwebdev.ru/api/v1'),
        user: getDefaultUserData()
    }),
    getters: {
        isAuthorized: (state) => state.user?.token.value !== undefined && state.user.token.value !== null
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
                this.user.token.value = token;
                this.userRequestController.setToken(token);
                await this.getUserData();
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
            this.user = getDefaultUserData();
            this.userRequestController.setToken(null);
        },

        async getUserData() {
            const userData = await this.userRequestController.getUserData();
            this.user.email.value = userData.email;
            this.user.name.value = userData.name;
            this.user.storageInUse.value = userData.storage_size;
            this.user.storageTotal.value = userData.storage_quota;
            this.user.registrationDate.value = new Date(userData.created_at);
        },

        /**
         * Attempt to recover user data from localhost
         */
        tryRememberUser() {
            console.log('Remember user');
            this.user = getLocalUser('vue-cloud-storage');
            if (this.user.token.value)
                this.userRequestController.setToken(this.user.token.value);
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

