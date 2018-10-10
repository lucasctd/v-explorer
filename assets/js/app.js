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
            new File(2, "File 2 qwew eeeee", 2, 'file', false, true, 80),
            new File(3, "File 3", 4)
        ],
        options: [
            new Option('Delete', (e) => {
				console.log("Delete");
				console.log(e);
            }, (file) => {
                return !file.blank;
            }),
            new Option('Save', (e) => {
				console.log("Save");
				console.log(e);
            }, (file) => {
                return !file.blank;
            }),
            new Option('New deFolder', (e) => {
				console.log("New deFolder");
            }, (file) => {
                return file.blank;
            }),
            new Option('New de Folder que eu criei', (e) => {
				console.log("New de Folder");
            }, (file) => {
                return file.blank;
            })
        ]
    },
    mounted() {
        const that = this;
        let x = 0;
        const file = this.files[1];
        //console.log(file);
        let interval = setInterval(() => {
            x+=5;
            file.progress = x;
            if(x >= 100) {
                clearInterval(interval);
            }
        }, 1000);
    },
    methods: {
        contextmenu(e) {
        },
        uploadCanceled(file) {
            console.error('uploadCanceled');
            console.warn(file);
        }
    }
});