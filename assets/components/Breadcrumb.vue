<template>
	<div class="v-exp-breadcrumb">
		<transition-group name="v-exp-list" tag="span">
			<a href="javascript:void(0)" v-for="item in path" :key="item.name" @click="click(item.name)">{{item.name}}/</a>
		</transition-group>
	</div>
</template>
<script>
import store from '../store/store'

export default {
	store,
    methods: {
        click(name) {
            const index = this.path.map(p => p.name).indexOf(name);
            if(index < (this.path.length - 1)) {
                this.$store.commit('slicePath', index + 1);
            }
        }
    },
	computed: {
		path() {
			return this.$store.state.path;
		}
	}
}

</script>
<style lang="stylus" scoped>
	.v-exp-breadcrumb {
		display block !important
		height 15px !important
		width 100% !important
		position relative
		top -16px
		a {
            transition: all .85s ease-in-out, opacity .5s ease-in-out;
			text-decoration none
			color #191970
			cursor pointer
			&:hover{
				opacity .65
			}
		}
	}

    .v-exp-list-enter, .v-exp-list-leave-to {
        opacity 0
        transform translateY(30px)
    }

    .v-exp-list-leave-active {
        position absolute
    }

</style>