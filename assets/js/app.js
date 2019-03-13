import Vue from 'vue';
import Explorer from '../components/Explorer'
import File from "./file"
import Option, {renameOption} from './option'

Vue.component('v-explorer', Explorer);

new Vue({
    el: '#app',
    data: {
        files: [],
        options: []
    },
    mounted() {
        this.options.push(renameOption);
        this.files =  [
            new File(1, "Folder 1", 10, 'folder'),
        ];
		this.files[0].dir = true;
        setTimeout(function() {
            this.files.push(new File(2, "Folder 2", 8, 'folder', 1, false, 0, true));			
        }.bind(this), 3000);
    },
    methods: {
        contextmenu(e) {
        },
        uploadCanceled(file) {
            console.log('uploadCanceled');
            console.log(file);
        },
        fileRename(file) {
            console.log('fileRename');
            console.log(file);
        },
        drop(files) {
            const ids = this.files.map(f => f.id);
            let fakeId = this.genFakeId();
            while(ids.find(id => id == fakeId)) {
                fakeId = this.genFakeId();
            }
            let x = 0;
            let file = new File(fakeId, files[0].name, 4);
            file.uploading = true;
            this.files.push(file);
            //fake upload progress
            let interval = setInterval(() => {
                x+=5;
                file.progress = x;
                if(x >= 100 || !file.uploading) {
                    clearInterval(interval);
                }
            }, 1000);
        },
		move(e) {
			console.log(e)
		},
        genFakeId() {
            return Math.floor((Math.random() * 1000) + 1);
        }
    }
});