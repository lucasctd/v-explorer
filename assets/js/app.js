import Vue from 'vue';
import Explorer from '../components/Explorer'
import File from "./file"
import Option from './option'

Vue.component('v-explorer', Explorer);

new Vue({
    el: '#app',
    data: {
        files: [
            new File(1, "File 1 wqewq weqeq www", 0, 'file', false, true),
            new File(2, "File 2 qwew eeeee", 1),
            new File(3, "File 3", 7)
        ],
        options: []
    },
    mounted() {
        this.options.push(new Option('Delete', (e) => {
            this.files = this.files.filter(f => f.id != e.id);
        }, (file) => {
            return !file.blank;
        }));
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