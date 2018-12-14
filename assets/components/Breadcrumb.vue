<template>
    <transition-group name="v-exp-list" tag="span">
        <span v-for="item in path" :key="item.name">{{item.name}}</span>
    </transition-group>
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

    .v-exp-list-enter, .v-exp-list-leave-to {
        opacity: 0;
        transform: translateY(30px);
    }

    .v-exp-list-leave-active {
        position: absolute;
    }

</style>