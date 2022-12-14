
const fileTypes = [
    {
        type: 'Image',
        regex: /jpe?g|a?png|kra|gif|psd|tiff|avif|webp|bmp|ico/i,
        icon: 'mdi-file-image'
    },
    {
        type: 'Video',
        regex: /avi|mpe?g|mkv|m4v/i,
        icon: 'mdi-file-video'
    },
    {
        type: 'Audio',
        regex: /mp3|m4a|flac|alac|wav/i,
        icon: 'mdi-file-music'
    },
    {
        type: 'Archive',
        regex: /zipp?|rar|tar|gz/i,
        icon: 'mdi-zip-box'
    },
    {
        type: 'Text',
        regex: /txt|rtf|md/i,
        icon: 'mdi-file-document-outline'
    },
    {
        type: 'Document',
        regex: /docx?|odf|odt|pages/i,
        icon: 'mdi-file-document'
    },
    {
        type: 'PDF',
        regex: /pdf/i,
        icon: 'mdi-file-pdf-box'
    },
    {
        type: 'Table',
        regex: /xlsx?|ods|csv/i,
        icon: 'mdi-file-table'
    },
    {
        type: 'Code',
        regex: /c(pp)?|h(pp)?|jsx?|tsx?|pyc?/i,
        icon: 'mdi-file-code'
    },
    {
        type: 'Folder',
        regex: /folder/i,
        icon: 'mdi-folder'
    },
    {
        type: 'Unknown',
        regex: /.*/i,
        icon: 'mdi-file-question'
    }
];

const fileItemMixin = {
    props: {
        type: {
            type: String,
            default: 'file'
        },
        file: {
            type: Object,
            required: true
        }
    },
    methods: {
        showInformation: function() {
            this.$emit('show_information', this.file, this.fileType);
        },
        download: function() {
            this.$emit('download_file', this.file);
        },
        deleteFile: function() {
            this.$emit('delete_file', this.file);
        },
        renameFile: function () {
            this.$emit('rename_file', this.file);
        },
        publishFile: function () {
            this.$emit('publish_file', this.file);
        },
        getExtension: function(file) {
            const parts = file.split('.');
            if (parts.length > 1)
                return parts.pop();
            return "";
        }
    },
    computed: {
        fileType: function() {
            const fileExtension = this.type === 'folder' ? 'folder' : this.getExtension(this.file.full_name);
            return fileTypes.find((type) => type.regex.test(fileExtension));
        },
        date: function() {
            if (this.file.id === -1) return "";
            if (this.file.updated_at)
                return this.file.updated_at.toLocaleString();
            return this.file.created_at.toLocaleString();
        },
        progress: function() {
            if (!this.file.is_downloading) return 0;
            if (this.file.download_total === 0) return 0;
            return Math.round(this.file.download_progress / this.file.download_total * 100);
        }
    }
};

export default fileItemMixin;