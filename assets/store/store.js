import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const storeModule = {
    state: {
        currentFolder: null,
        selectedFiles: [],
        path: []
    },
    mutations: {
        setCurrentFolder(state, currentFolder) {
            state.currentFolder = currentFolder;
        },
        addSelectedFile(state, file) {
            state.selectedFiles.push(file);
        },
        clearSelectedFiles(state) {
            state.selectedFiles = [];
        },
        addItemToPath(state, item) {
            if(item.dir) {
                state.path.push(item);
            } else {
                throw `"${item.name}" is not a folder. Make sure to set "folder.dir = true"`;
            }
        },
        openFolder(state, item) {
            this.commit('addItemToPath', item);
        },
        slicePath(state, index) {
            state.path = state.path.slice(0 , index);
        }
    },
    getters: {
        selectedFiles(state) {
            return state.selectedFiles;
        },
        currentFolder(state) {
            return state.currentFolder;
        }
    }
};

const store = new Vuex.Store(storeModule);

export {store, storeModule};
export default store;
