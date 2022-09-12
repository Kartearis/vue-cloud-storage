import { createPinia as createPiniaDefault } from 'pinia';

let instance = null;

export default function createPinia() {
    if (instance === null)
        instance = createPiniaDefault();
    return instance;
}