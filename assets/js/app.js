import Vue from 'vue';
import Explorer from '../components/Explorer'
import File from "./file"
import Option from './option'

Vue.component('v-explorer', Explorer);

new Vue({
    el: '#app',
    data: {
        files: [
            new File(1, "File 1 wqewq weqeq www", 0),
            new File(2, "File 2 qwew eeeee", 2),
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
    methods: {
        contextmenu(e) {
        }
    }
});