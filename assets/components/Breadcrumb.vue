<template>
	<div class="v-exp-breadcrumb">
		<transition-group name="v-exp-list" tag="span">
			<a href="javascript:void(0)" v-for="item in path" :key="item.name">{{item.name}}</a>
		</transition-group>
	</div>
</template>
<script>

export default {
    props: {
        path: {
            required: true,
            type: Array
        },
    },
    mounted(){
    },
    methods: {
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
			text-decoration none
			color gray
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