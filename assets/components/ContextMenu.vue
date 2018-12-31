<template>
    <transition name="v-exp-context-menu-fade">
        <div v-if="show" class="v-exp-context-menu" :style="{top: top + 'px', left: left + 'px'}">
            <div v-for="opt in options" v-if="opt.visible(file)" ref="opt" :key="opt.name" 
				class="v-exp-context-menu-option" @click.stop="click($event, opt)">
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
			if(!this.file.blank) {
				opt.click(this.file);
			} else {
				opt.click(this.file.index);
			}            
            this.hide();
        },
        hideAllContextMenu() {
            document.dispatchEvent(new CustomEvent("hideAllContextMenu", {
                detail: this
            }));
        },
        addListeners() {
            document.addEventListener("hideAllContextMenu", function (e) {
                if(e.detail._uid !== this._uid){
                    this.hide();
                }
            }.bind(this));
            document.addEventListener("mousedown", function () {
                this.hide();
            }.bind(this));
        },
        hide() {
            this.$emit('update:show', false);
        }
    },
    watch: {
        show(val) {
            if(val){
                this.hideAllContextMenu();
				this.$nextTick(() => {//resize font to fit in the div's default height
                    if(this.$refs.opt) {
                        let defaultFontSize = 13;
                        this.$refs.opt.forEach(el => {
                            while(el.clientHeight > 30) {
                                el.style.fontSize = --defaultFontSize + 'px';
                            }
                        });					
                    }
				});				
            }
        }
    }
}

</script>
<style lang="stylus" scoped>
    //$blue = #191970 
    $blue = gray
    .v-exp-context-menu {
		min-width: 110px
        max-width: 130px		
        min-height: 150px
        position: fixed
        background-color: white
        opacity: .98
        z-index: 10000
        border: 1px solid gray
        box-shadow: 5px 4px 15px -4px rgba(0,0,0,0.75)
    }

    .v-exp-context-menu-option {
        text-transform: uppercase
        min-height: 20px
        cursor: pointer
        padding: 5px 10px
        overflow: hidden
		color: $blue 
		font-size: 13px
		font-family: Verdana, Georgia, Palatino
        font-weight bold
        &:hover {
            color: white
            background-color: $blue
            opacity .75
        }
    }

    .v-exp-context-menu-fade-enter-active, .v-exp-context-menu-fade-leave-active {
        transition: opacity .5s;
    }

    .v-exp-context-menu-fade-enter, .v-exp-context-menu-fade-leave-to {
        opacity: 0;
    }
    
</style>


