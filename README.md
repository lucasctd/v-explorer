# v-explorer
A "file" explorer component for Vue.

## How to:

### Install

**Yarn**: yarn add v-explorer

**NPM**: npm i v-explorer --save

### Use

----
#### JS
```javascript
import Vue from 'vue'
import {Explorer, renameOption, File} from 'v-explorer'

Vue.component('v-explorer', Explorer); //for global usage

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
        contextmenu(e) {}, //handle context menu events
        uploadCanceled(file) {}, //handle cancel events
        fileRename(file) {}, //handle rename events
        drop(files) {}, //handle drop events
        move(e) {} //handle move events
    }
});
```
#### HTML
```html
<div id="app" style="height: 480px; width: 800px; border: 1px solid red; position: relative; top: 30px;">
    <v-explorer height="50%" 
    :files="files" :options="options" @contextmenu="contextmenu" 
    @upload-canceled="uploadCanceled" 
    @file-rename="fileRename" @drop="drop" @move="move"></v-explorer>
</div>
```
Will render something like this:
![v-explorer example](https://i.ibb.co/zHN0YP8/v-explorer.gif)
You can see the whole code of this example in dist/index.html and assets/js/app.js.

### Events

----
#### contextmenu
It will pass the selected file(s), if any, when a right click is executed.
#### select
It will pass the selected file when a left click is executed.
#### dragstart/dragend
It will pass the selected file when a file is dragged.
#### upload-canceled
It will pass the file that the upload has been canceled
#### file-rename
It will pass the file that has been renamed
#### drop
It will pass the file that has been dropped
#### move
It will pass the file that has been moved (after it's dropped)
#### dblclick
It will pass the file that has been double clicked

### Props

----
#### files (required|array)
<p>
The files that are going to be displayed

<small>Checkout the [File class](https://github.com/lucasctd/v-explorer/blob/master/assets/js/file.js).
</small>
<p>

#### options (required|array)
<p>
The context menu options

<small>Checkout the [Option class](https://github.com/lucasctd/v-explorer/blob/master/assets/js/option.js).
</small>
<p>

#### width
The container's width (default: 100%|string)
#### height
The container's height (default: 100%|string)
#### root-drive
The root letter (default C:|string)
#### can-rename-files
<p>
Set if the user can rename the files (default: true|boolean)

<small>You can also disable this options individually, checkout the [Option class](https://github.com/lucasctd/v-explorer/blob/master/assets/js/option.js).
</small>
<p>

#### auto-resize-options
Explorer will try to resize the context menu options that don't fit will. It may have some
unwanted behaviour so you can disable it by passing false to this option. (default: true|boolean)

### Getters

----
In order to access some explorer data, you will need to import its store and get
what you want like below:

```javascript
import Vue from 'vue'
import {Explorer, store} from 'v-explorer'

Vue.component('v-explorer', Explorer); //for global usage

new Vue({
    el: '#app',
    store,
    computed: {
        currentFolder() { //returns the current displayed folder
            return this.$store.getters.currentFolder;
          },
          selectedFiles() { //return an array of the selected files
              return this.$store.getters.selectedFiles;
          }
      }
  })
```

### Methods

----
You may also call some methods to change things on v-explorer. To do so, you will need to
commit the action on the store.

```javascript
import Vue from 'vue'
import {Explorer, store} from 'v-explorer'

Vue.component('v-explorer', Explorer); //for global usage

new Vue({
    el: '#app',
    store,
    methods: {
        openFolder() { //Open a folder from the current displayed folder
            this.$store.commit('openFolder', folder);
        }
    }
  })
```