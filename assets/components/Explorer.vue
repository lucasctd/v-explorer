
<template>
    <div class="container" @drop.prevent="drop">
        <transition-group name="list" tag="div">
            <v-file v-for="file in localFiles" :file="file" :key="file.id" @drop="updateFiles"
                @dragstart="dragstart" @dragend="dragend" :options="options" @click.stop="click" 
                @contextmenu="contextmenu" @uploadCanceled="uploadCanceled">
            </v-file>
        </transition-group>
    </div>
</template>
<script>

import FileComponent from './File.vue'
import File, {generateBlankFile} from '../js/file'

export default {
    data() {
        return {
            draggedFile: null,
            selectedFiles: [],
            localFiles: []
        }
    },
    props: {
        files: {
            required: true,
            type: Array
        },
        options: {
            required: true,
            type: Array
        }
    },
    mounted() {
        this.addListeners();
        this.loadLocalFiles();
    },
    methods: {
        loadLocalFiles() {
            let listFiles = [];
            //create blank 'files'
            for (let x = 0; x <= this.getNumberOfBlocks(); x++){
                listFiles.push(generateBlankFile(x));
            }
            //add the real files to the list
            this.files.forEach(file => {
                listFiles.splice(file.index, 1, file);
            });
            this.localFiles = listFiles;
        },
        updateFiles(file) {
            let listFiles = [];
            const destFileIndex = file.index;
            const draggedFileIndex = this.draggedFile.index;

            listFiles = listFiles.concat(this.localFiles);
            listFiles[destFileIndex].index = draggedFileIndex;
            listFiles[draggedFileIndex].index = destFileIndex;

            listFiles.splice(destFileIndex, 1, this.draggedFile);
            listFiles.splice(draggedFileIndex, 1, file);
            this.localFiles = listFiles;
            this.$emit('update:files', listFiles)
        },
        dragstart(file) {
            this.draggedFile = file;
        },
        dragend(file) {
        },
        getNumberOfBlocks() {
            const totalArea = window.outerWidth * window.outerHeight;
            const blockSize = 100 * 135;
            return totalArea / blockSize;
        },
        click(e){
            this.addSelectedFile(e.file);
        },
        addListeners() {
            document.addEventListener("click", () => {
                this.clearFileList();
            });
        },
        contextmenu(file) {
            this.addSelectedFile(file);
            this.$emit('contextmenu', this.selectedFiles);
        },
        addSelectedFile(file) {
            if (file) {
                const rs = this.selectedFiles.find(f => {
                    return f.id === file.id;
                });
                if (rs === undefined) {
                    this.selectedFiles.push(file);
                }
            }else{
                this.clearFileList();
            }
        },
        clearFileList() {
            this.selectedFiles = [];
        },
        uploadCanceled(file) {
            this.localFiles[file.index].blank = true;
            this.$emit('upload-canceled', file);
        drop(e) {
            if(e.dataTransfer.files.length > 0) {
                this.$emit('drop', e.dataTransfer.files);
            }
        }
    },
    components: {
        'v-file': FileComponent
    }
}
</script>
<style lang="stylus" scoped>
    .container {
        width: 100%
        height: 100%
        > div {
            display: flex
		    flex-wrap: wrap
            width inherit
            height inherit
        }
    }

    .list-enter, .list-leave-to {
        opacity: 0;
        transform: translateY(30px);
    }

    .list-leave-active {
        position: absolute;
    }
</style>


