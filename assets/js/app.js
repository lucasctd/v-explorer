import Vue from 'vue';
import Explorer from '../components/Explorer'
import File from "./file"
import Option from './option'

Vue.component('v-explorer', Explorer);

new Vue({
    el: '#app',
    data: {
        files: [],
        options: []
    },
    mounted() {
        this.options.push(new Option('Delete', (e) => {
            this.files = this.files.filter(f => f.id != e.id);
        }, (file) => {
            return !file.blank;
        }));
        setTimeout(function() {
            this.files =  [
                new File(1, "Folder 1", 0, 'folder'),
                new File(2, "File 2", 2, 'file', 1),
            ];
            setTimeout(function() {
                this.files.push(new File(3, "Folder 3", 1, 'folder'));
                this.files.push(new File(4, "File 4", 7, 'file', 3));
            }.bind(this), 1000);
        }.bind(this), 500);
    },
    methods: {
        contextmenu(e) {
        },
        uploadCanceled(file) {
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
            /*let interval = setInterval(() => {
                x+=5;
                file.progress = x;
                if(x >= 100 || !file.uploading) {
                    clearInterval(interval);
                }
            }, 1000);*/
        },
        genFakeId() {
            return Math.floor((Math.random() * 1000) + 1);
        }
    }
});