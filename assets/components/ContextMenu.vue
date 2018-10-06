<template>
    <transition name="v-exp-context-menu-fade">
        <div v-if="show" class="v-exp-context-menu" :style="{top: top + 'px', left: left + 'px'}">
            <div v-for="opt in options" v-if="opt.visible(file)" ref="opt" :key="opt.name" 
				class="v-exp-context-menu-option" :style="{fontSize: fontSize(opt.name) + 'px'}" @click.stop="click($event, opt)">
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
				opt.click(null);
			}            
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
        },
		fontSize(name) {
			//let size = 
			/*if(name.length < 13) {
				return 
			}*/
		}
    },
    watch: {
        show(val) {
            if(val){
                this.hideAllContextMenu();
				this.$nextTick(() => {//resize font to fit in the div's default height
					let defaultFontSize = 13;
					this.$refs.opt.forEach(el => {
						while(el.clientHeight > 30) {
							el.style.fontSize = --defaultFontSize + 'px';
						}
					});					
				});				
            }
        }
    }
}

</script>
<style lang="stylus">
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
		color: gray 
		font-size: 13px
		font-family: Verdana, Georgia, Palatino
        &:hover {
            color: white
            background-color: gray
        }
    }

    .v-exp-context-menu-fade-enter-active, .v-exp-context-menu-fade-leave-active {
        transition: opacity .5s;
    }

    .v-exp-context-menu-fade-enter, .v-exp-context-menu-fade-leave-to {
        opacity: 0;
    }
    
</style>


