
const fileLayoutMixin = {
    data: () => ({
        selection: {
            folder: null,
            file: null
        }
    }),
    props: {
        files: Array,
        folders: Array
    },
    methods: {
        updateSelection: function(key, value) {
            Object.keys(this.selection)
                .filter((k) => k !== key)
                .forEach((k) => this.selection[k] = null);
            this.selection[key] = value;
            if (key === 'folder' && value !== undefined) {
                this.$emit('open_folder', this.folders[this.selection[key]]);
                this.selection[key] = null;
            }
        }
    },
};

export default fileLayoutMixin;