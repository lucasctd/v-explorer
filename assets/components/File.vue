
<template>
    <div :id="file.id" :class="{'v-exp-file': !file.blank, 'v-exp-blank': file.blank, 'v-exp-file-dragging': dragging}" draggable="true" 
        @drop.prevent="drop" @dragstart="dragstart" @dragend="dragend" @dragenter.prevent="dragenter" @dragleave="dragleave" @dragover.prevent="dragover"
        @contextmenu.prevent="contextmenu" @click.stop="click">

        <!-- <fa-icon :icon="file.icon"></fa-icon> -->
        <fa-icon v-if="!file.blank" :icon="['far', file.icon]" size="3x" class="v-file-icon"></fa-icon>
        <p :title="file.name">{{_fileName}}</p>
        <!-- when hovering a file/field -->
        <div class="v-exp-file-hover" :class="{'v-exp-file-hover-enabled': draggingover}"></div>
         <!-- when selecting a file -->
        <div class="v-exp-file-selected" :class="{'v-exp-file-selected-enabled': selected}"></div>
        <transition name="fade">
            <div v-if="file.uploading" class="v-exp-file-uploading" :style="{height: file.progress + '%'}">
                <span :style="file.progress < 20 ? 'margin: -24px auto; color: #191970;': ''">{{file.progress}}%</span>
            </div>
        </transition>
        <v-context-menu :show.sync="showContextMenu" :file="file" :options="options" :top="contextMenuTop" :left="contextMenuLeft"></v-context-menu>
    </div>
</template>
<script>
import ContextMenu from './ContextMenu.vue'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import {far} from '@fortawesome/free-regular-svg-icons'

library.add(far)

export default {
    data() {
        return {
            dragging: false,
            draggingover: false,
            showContextMenu: false,
            contextMenuTop: 0,
            contextMenuLeft: 0,
            selected: false
        }
    },
    props: {
        file: {
            required: true
        },
        options: {
            required: true,
            type: Array
        }
    },
    mounted() {
        this.addListeners();
    },
    methods: {
        dragenter() {
            this.draggingover = true
        },
        dragleave() {
            this.draggingover = false
        },
        drop() {
            this.draggingover = false
            this.$emit('drop', this.file);
        },
        dragstart() {
            this.dragging = true;
            this.$emit('dragstart', this.file);
        },
        dragend() {
            this.dragging = false;
            this.$emit('dragend', this.file);
        },
        dragover() {
        },
        contextmenu(e) {
            let file = null;
            if (!this.file.blank) {
                this.selected = true;
                file = this.file;
				this.$emit('contextmenu', file);
            }
            this.contextMenuTop = e.clientY;
            this.contextMenuLeft = e.clientX;
            this.showContextMenu = true;
        },
        click(e) {
            if (!this.file.blank && !this.file.uploading) {
                this.selected = true;
                e.file = this.file;
				this.$emit('click', e);
            }else{
                document.dispatchEvent(new Event("click"));
            }            
        },
        addListeners() {
            document.addEventListener("click", () => {
                this.selected = false;
            });
        }
    },
    computed: {
        _fileName() {
            if (!this.file.blank && this.file.name.length > 13) {
                return this.file.name.substring(0, 13).trim().concat('...');
            }
            return this.file.name;
        }
    },
    watch: {
        file: {
            handler(file) {
                if(file.progress >= 100) {
                    setTimeout(() => {
                        file.uploading = false;
                    }, 3000);
                } 
            },
            deep: true
        }
    },
    components: {
        'v-context-menu': ContextMenu,
        'fa-icon': FontAwesomeIcon
    }
}
</script>
<style lang="stylus">
    $blue = #191970
    .v-exp-block {
        width 100px
        height 135px
        margin 10px 5px
        position relative
    }

    .v-exp-file {
        @extends .v-exp-block
        border 1px solid gray
        box-shadow: 5px 5px 25px -5px rgba(0,0,0,1)
		transition: all .1s ease-out;
        p {
            position: relative;
            z-index: 20;
            top: 30px;
            text-align: center;
            font-size: 12px;
			font-family: Verdana, Georgia, Palatino;
        }
    }

    .v-exp-blank {
        @extends .v-exp-block 
        border none
    }

    .v-exp-file-dragging {
        transform translateX(-3500px)
    }

    .v-exp-file-hover {
        width 100%
        height 100%
        display block
        opacity 0        
        background-color orange
        transition: opacity .7s;
        position absolute
        top 0px
        z-index 10
    }

    .v-exp-file-selected {
        background-color $blue
        @extends .v-exp-file-hover
    }

    .v-exp-file-selected-enabled {
        opacity .5
    }

    .v-exp-file-hover-enabled {
        opacity .2
    }

    .v-file-icon {
        margin: 0 auto
        position: relative
        display: table
        top: 15px
    }

    .v-exp-file-uploading {
        width 100%
        position absolute
        bottom 0
        background-color $blue
        opacity .8
        transition height .7s
        z-index 10
        span {
            font-size 24px
            color white
            font-weight bold
            display table
            margin 0 auto
            transition margin 1s
        }
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>


