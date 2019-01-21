
<template>
    <div :id="id" class="v-exp-container" @drop.prevent="drop" :style="{width: width, height: height}">
        <v-breadcrumb :path.sync="path"></v-breadcrumb>
        <transition-group name="v-exp-list" tag="div">
            <v-file v-for="file in localFiles" :file="file" :key="file.id" @drop="updateFiles"
                @dragstart="dragstart" @dragend="dragend" :options="options" @click.stop="click" 
                @contextmenu="contextmenu" @upload-canceled="uploadCanceled" @file-rename="fileRename" @dblclick="dblclick">
            </v-file>
        </transition-group>
    </div>
</template>
<script>

import vFile from './File.vue'
import vBreadcrumb from './Breadcrumb.vue'
import {generateBlankFile} from '../js/file'
import Breadcrumb from '../js/breadcrumb'

export default {
    data() {
        return {
			id: '',
            draggedFile: null,
            selectedFiles: [],
            localFiles: [],
            oldFiles: [],
            currentFolder: null,
            path: [new Breadcrumb('C:', null)]
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
        },
		width: {
            required: false,
            type: String,
			default() {
				return '100%';
			}
        },
		height: {
            required: false,
            type: String,
			default() {
				return '100%';
			}
        }
    },
    mounted() {
		this.id += ('v-explorer-container_' + Math.floor((Math.random() * 1000) + 1));
		document.addEventListener("DOMContentLoaded", function(event) {			
            this.addListeners();
            this.loadChildren();
            this.loadLocalFiles();
		}.bind(this));			
    },
    methods: {
        loadChildren() {
            this.files.forEach(file => {
                file.children = this.files.filter(f => f.parentId == file.id);
            });
        },
        async loadLocalFiles() {
            //create blank 'files'
            this.localFiles = this.localFiles.filter(f => {//remove existing files
                return f.blank;
            });
			await this.sleep(.6);//wait for the animation ends
            this.localFiles = [];
			await this.sleep(.2);//wait for the animation ends
			this.localFiles = [];
            const numBlocks = this.getNumberOfBlocks();
            for (let x = 0; x <= numBlocks; x++){
                this.localFiles.push(generateBlankFile(x));
            }
            //add the real files to the list, if you are inside a folder, it will show only its files
            const files = this.currentFolder == null ? this.files.filter(f => f.parentId == null) : this.currentFolder.children;
            files.forEach(file => {
                this.localFiles.splice(file.index, 1, file);
            });
			await this.sleep(.1);
            this.localFiles.sort((a, b) => a.index - b.index);
            this.oldFiles = [].concat(this.files);
        },
        updateFiles(file) {
            this.swap(file, this.draggedFile);
        },
		swap(fileA, fileB) {
			const fileAIndex = fileA.index;
            const fileBIndex = fileB.index;
            fileA.index = fileBIndex;
            fileB.index = fileAIndex;
            this.localFiles.splice(fileAIndex, 1, fileB);
            this.localFiles.splice(fileBIndex, 1, fileA);
		},
        dragstart(file) {
            this.draggedFile = file;
            this.$emit('dragstart', file);
        },
        dragend(file) {
            this.$emit('dragend', file);
        },
        getNumberOfBlocks() {
			const el = document.getElementById(this.id);
            const totalArea = el.clientWidth * el.clientHeight;
            const blockSize = 100 * 135;
            return totalArea / blockSize;
        },
        click(e){
            this.addSelectedFile(e.file);
            this.$emit('select', e.file);
        },
        addListeners() {
            document.addEventListener("click", () => {
                this.clearSelectedFileList();
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
            } else {
                this.clearFileList();
            }
        },
        clearSelectedFileList() {
            this.selectedFiles = [];
        },
        uploadCanceled(file) {
			this.deleteFile(file);
            this.$emit('upload-canceled', file);
        },
        fileRename(file) {
            this.$emit('file-rename', file);
        },
        drop(e) {
            if(e.dataTransfer.files.length > 0) {
                this.$emit('drop', e.dataTransfer.files);
            } else {
				this.$emit('move', this.draggedFile);
			}
        },
        async deleteFile(file) {
            const containerWidth = document.getElementById(this.id).offsetWidth;
            const block = document.getElementById(file.id);
			const blockStyle = getComputedStyle(block);
			const blockWidth = parseInt(blockStyle.marginLeft) + parseInt(blockStyle.marginRight) + block.clientWidth;
			const numBlocksPerLine = Math.floor(containerWidth / blockWidth);
			const mod = file.index % numBlocksPerLine;
			
            let blank = this.localFiles.find(f => f.index >= numBlocksPerLine && f.blank && mod == (f.index % numBlocksPerLine));
			if(!blank) {
				blank = this.localFiles[this.localFiles.length - 1];
			}
			this.swap(file, blank);
            await this.sleep(.05);
            block.style.opacity = 0;
            this.localFiles[file.index] = generateBlankFile(file.index);
        },
        dblclick(file) {
            if(file.dir) {
                this.path.push(new Breadcrumb(file.name, file));
            }
            this.$emit('dblclick', file);
        },
        sleep(seconds) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, seconds * 1000);
            });
        }
    },
    watch: {
        async files() {
            this.loadChildren();
			console.log('watch files')			
            if(this.localFiles.length == 0) {
				console.log('loadLocalFiles watch')
                await this.loadLocalFiles();
            }
            //add the real files to the list, if you are inside a folder, it will show only its files
            if (this.files.length > this.oldFiles.length) {
                const files = this.currentFolder == null ? this.files.filter(f => f.parentId == null) : this.currentFolder.children;
                let newFiles = files.filter(file => this.oldFiles.indexOf(file) == -1);
                newFiles.forEach(async file => {
                    const blankFile = this.localFiles.find(f => f.index == file.index);
                    this.localFiles.push(file);
                    file.blank = false;
                    file.index = this.localFiles.length - 1;
                    this.swap(file, blankFile);
                });
            } else {
                const parentId = this.currentFolder == null ? null : this.currentFolder.id;
                const files = this.oldFiles.filter(f => f.parentId == parentId);
                let deletedFiles = files.filter(file => this.files.indexOf(file) == -1);
                deletedFiles.forEach(file => {
                    this.deleteFile(file);
                });
            }
			this.localFiles.sort((a, b) => a.index - b.index);
            this.oldFiles = [].concat(this.files);
        },
        path(value) {
			this.currentFolder = value[value.length - 1].folder;
			this.loadLocalFiles();
        }
    },
    components: {
        vFile,
        vBreadcrumb
    }
}
</script>
<style lang="stylus" scoped>
    .v-exp-container {
        > div {
            display: flex
		    flex-wrap: wrap
            width inherit
            height inherit
        }
    }

    .v-exp-list-enter, .v-exp-list-leave-to {
        opacity: 0;
        transform: translateY(30px);
    }

    .v-exp-list-leave-active {
        position: absolute;
    }
</style>


