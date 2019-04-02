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
            state.path.push(item);
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