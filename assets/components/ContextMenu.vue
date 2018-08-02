<template>
    <transition name="v-exp-context-menu-fade">
        <div v-if="show" class="v-exp-context-menu" :style="{top: top + 'px', left: left + 'px'}">
            <div v-for="opt in options" :key="opt.name" class="v-exp-context-menu-option" @click.stop="click($event, opt)" v-if="opt.visible(file)">
                {{opt.name}}
            </div>
        </div>
    </transition>
</template>
<script>

export default {
    props: {
        top: {
            required: true,
            type: Number
        },
        left: {
            required: true,
            type: Number
        },
        options: {
            required: true,
            type: Array
        },
        file: {
            required: true
        },
        show: {
            required: true,
            type: Boolean
        }
    },
    mounted(){
        this.addListeners();
    },
    methods: {
        click(e, opt) {
            opt.click(this.file);
            this.hide();
        },
        hideAllContextMenu() {
            document.dispatchEvent(new CustomEvent("hideAllContextMenu", {
                detail: this
            }));
        },
        addListeners() {
            const that = this;
            document.addEventListener("hideAllContextMenu", (e) => {
                if(e.detail._uid !== that._uid){
                    that.hide();
                }
            });
            document.addEventListener("mousedown", () => {
                that.hide();
            });
        },
        hide() {
            this.$emit('update:show', false);
        }
    },
    watch: {
        show(val) {
            if(val){
                this.hideAllContextMenu();
            }
        }
    }
}

</script>
<style lang="stylus">
    .v-exp-context-menu {
        width 120px
        min-height 150px
        position fixed
        background-color white
        opacity: .98
        z-index 10000
        border 1px solid gray
        box-shadow: 5px 4px 15px -4px rgba(0,0,0,0.75);
    }

    .v-exp-context-menu-option {
        text-transform uppercase
        height 20px
        cursor pointer
        padding 5px 10px
        overflow hidden
        a {
            text-decoration none
            color gray 
            font-weight bold 
        }
        span {
        }
        &:hover {
            color white
            background-color gray
        }
    }

    .v-exp-context-menu-fade-enter-active, .v-exp-context-menu-fade-leave-active {
        transition: opacity .5s;
    }

    .v-exp-context-menu-fade-enter, .v-exp-context-menu-fade-leave-to {
        opacity: 0;
    }
    
</style>


