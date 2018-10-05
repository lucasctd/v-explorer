import Vue from 'vue';
import Explorer from '../components/Explorer'
import File from "./file"
import Option from './option'

Vue.component('v-explorer', Explorer);

new Vue({
    el: '#app',
    data: {
        files: [
            new File(1, "File 1 wqewq weqeq www wwww wwww", 0),
            new File(2, "File 2 qwew eeeee", 2),
            new File(3, "File 3", 4)
        ],
        options: [
            new Option('Delete', (e) => {
            }, (file) => {
                return file.id == 2;
            }),
            new Option('Save', (e) => {
            })
        ]
    },
    methods: {
        contextmenu(e) {
            console.log(e);
        }
    }
});