
<template>
    <div :id="id" class="v-exp-container" @drop.prevent="drop" :style="{width: width, height: height}">
        <transition-group name="v-exp-list" tag="div">
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
			id: '',
            draggedFile: null,
            selectedFiles: [],
            localFiles: [],
            oldFiles: []
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
		const that = this;
		that.id += ('v-explorer-container_' + Math.floor((Math.random() * 1000) + 1));
		document.addEventListener("DOMContentLoaded", function(event) {			
			that.addListeners();
			that.loadLocalFiles();
		});			
    },
    methods: {
        loadLocalFiles() {
            //create blank 'files'
			const numBlocks = this.getNumberOfBlocks();
            for (let x = 0; x <= numBlocks; x++){
                this.localFiles.push(generateBlankFile(x));
            }
            //add the real files to the list
            this.files.forEach(file => {
                this.localFiles.splice(file.index, 1, file);
            });
            this.localFiles.sort((a, b) => a.index - b.index);
            this.oldFiles = this.oldFiles.concat(this.files);
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
        drop(e) {
            if(e.dataTransfer.files.length > 0) {
                this.$emit('drop', e.dataTransfer.files);
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
			const that = this;
			setTimeout(() => {
				block.style.opacity = 0;
				that.localFiles[file.index] = generateBlankFile(file.index);
			}, 50);
			this.swap(file, blank);
        }
    },
    watch: {
        files() {
            if (this.files.length > this.oldFiles.length) {
                let newFiles = this.files.filter(file => this.oldFiles.indexOf(file) == -1);
                newFiles.forEach(file => {
                    this.localFiles.splice(file.index, 1, file);
                });
            } else {
                let deletedFiles = this.oldFiles.filter(file => this.files.indexOf(file) == -1);
                deletedFiles.forEach(file => {
                    this.deleteFile(file);
                });
            }
            this.oldFiles = [].concat(this.files);
        }
    },
    components: {
        'v-file': FileComponent
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


