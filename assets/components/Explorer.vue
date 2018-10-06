
<template>
    <div class="container">
         <v-file v-for="file in _files" :file="file" :key="file.id" @drop="updateFiles"
            @dragstart="dragstart" @dragend="dragend" :options="options" @click.stop="click" @contextmenu="contextmenu">
        </v-file>
    </div>
</template>
<script>

import FileComponent from './File.vue'
import File, {generateBlankFile} from '../js/file'

export default {
    data() {
        return {
            draggedFile: null,
            selectedFiles: []
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
    },
    computed: {
        _files() {
            let listFiles = [];
            const max = Math.max.apply(null, this.files.map(f => f.index));
            for (let x = 0; x <= this.getNumberOfBlocks(); x++){
                listFiles.push(generateBlankFile(x));
            }
            this.files.forEach(file => {
                listFiles.splice(file.index, 1, file);
            });
            return listFiles;
        }
    },
    methods: {
        updateFiles(file) {
			const that = this;
			if(!file.blank) {
				let draggedEl = document.getElementById(that.draggedFile.id);
				let fileEl = document.getElementById(file.id);
				console.log(draggedEl.offsetTop);
				console.log(draggedEl.offsetLeft);
				console.log(that.draggedFile);
				fileEl.style.position = 'absolute';
				fileEl.style.left = draggedEl.offsetLeft + 'px';
				fileEl.style.top = draggedEl.offsetTop + 'px';
			}
			/*setTimeout(() => {
				let tempIndex = that.draggedFile.index;
				that.draggedFile.index = file.index;
				file.index = tempIndex;
			}, 3000);*/
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
            this.addFile(e.file);
        },
        addListeners() {
            document.addEventListener("click", () => {
                this.clearFileList();
            });
        },
        contextmenu(file) {
            this.addFile(file);
            this.$emit('contextmenu', this.selectedFiles);
        },
        addFile(file) {
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
        }
    },
    components: {
        'v-file': FileComponent
    }
}
</script>
<style lang="stylus">
    .container {
        width: 100%
        height: 100%
		display: flex
		flex-wrap: wrap
    }
</style>


