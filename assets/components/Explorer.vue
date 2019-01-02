
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
        loadLocalFiles() {
            //create blank 'files'
            this.localFiles = this.localFiles.filter(f => {//remove existing files
                return f.blank;
            });
            setTimeout(function () {
                this.localFiles = [];
            }.bind(this), 600);

            setTimeout(function () {
                const numBlocks = this.getNumberOfBlocks();
                for (let x = 0; x <= numBlocks; x++){
                    this.localFiles.push(generateBlankFile(x));
                }
                //add the real files to the list, if you are inside a folder, it will show only its files
                const files = this.currentFolder == null ? this.files.filter(f => f.parentId == null) : this.currentFolder.children;
                files.forEach(file => {
                    this.localFiles.splice(file.index, 1, file);
                });
                this.localFiles.sort((a, b) => a.index - b.index);
                this.oldFiles = [].concat(this.files);
            }.bind(this), 800);
        },
        updateFiles(file) {
            this.swap(file, this.draggedFile);
        },
		swap(fileA, fileB) {
			const fileAIndex = fileA.index;
            const fileBIndex = fileB.index;

            this.localFiles[fileAIndex].index = fileBIndex;
            this.localFiles[fileBIndex].index = fileAIndex;

            this.localFiles.splice(fileAIndex, 1, fileB);
            this.localFiles.splice(fileBIndex, 1, fileA);
		},
        dragstart(file) {
            this.draggedFile = file;
        },
        dragend(file) {
        },
        getNumberOfBlocks() {
			const el = document.getElementById(this.id);
            const totalArea = el.clientWidth * el.clientHeight;
            const blockSize = 100 * 135;
            return totalArea / blockSize;
        },
        click(e){
            this.addSelectedFile(e.file);
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
        deleteFile(file) {
            const containerWidth = document.getElementById(this.id).offsetWidth;
            const block = document.getElementById(file.id);
			const blockStyle = getComputedStyle(block);
			const blockWidth = parseInt(blockStyle.marginLeft) + parseInt(blockStyle.marginRight) + block.clientWidth;
			const numBlocksPerLine = Math.floor(containerWidth / blockWidth);
			const mod = file.index % numBlocksPerLine;
			
			const blank = this.localFiles.find(f => f.index >= numBlocksPerLine && f.blank && mod == (f.index % numBlocksPerLine));
			setTimeout(function() {
				block.style.opacity = 0;
                this.localFiles[file.index] = generateBlankFile(file.index);
            }.bind(this), 50);
			this.swap(file, blank);
        },
        dblclick(file) {
            if(file.children != null) {                
                this.path.push(new Breadcrumb(file.name, file));
            }
        }
    },
    watch: {
        files() {
            this.loadChildren();
            //add the real files to the list, if you are inside a folder, it will show only its files
            if (this.files.length > this.oldFiles.length) {
                const files = this.currentFolder == null ? this.files.filter(f => f.parentId == null) : this.currentFolder.children;
                let newFiles = files.filter(file => this.oldFiles.indexOf(file) == -1);
                newFiles.forEach(file => {
                    //this.localFiles.splice(file.index, 1, file);
					console.log(file)
					const id = this.localFiles.find(f => f.index == file.index).id;
					if(!id) return;
					console.log(id)
					const block = document.getElementById(id);
                    this.localFiles[file.index] = file;//.splice(file.index, 1, file);
					block.opacity = 1;
                });
            } else {
                const parentId = this.currentFolder == null ? null : this.currentFolder.id;
                const files = this.oldFiles.filter(f => f.parentId == parentId);
                let deletedFiles = files.filter(file => this.files.indexOf(file) == -1);
                deletedFiles.forEach(file => {
                    this.deleteFile(file);
                });
            }
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


