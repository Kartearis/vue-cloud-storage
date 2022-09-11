import { defineStore } from 'pinia';
import UserRequestController from "@/controllers/userRequestController";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        userRequestController: new UserRequestController('http://markwebdev.ru/api/v1'),
        token: null,
        user: null
    }),
    getters: {
        isAuthorised: (state) => state.token !== null
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
                this.token = token;
                this.userRequestController.setToken(token);
                return {success: true, errors: ["Logged in!"]}
            }
            catch (e) {
                return {success: false, errors: e};
            }
        }
    },
})