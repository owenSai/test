<template>
    <div class="button-wrap" v-bind:style="wrapStyleobj">
        <div class="button" v-if="showButton" @click="clickButton"  v-bind:style="styleObj">
            {{buttonText}}
        </div>
    </div>

</template>

<script>
    export default {
        data() {
            return {};
        },
        props: [ 'showButton', 'buttonText', 'styleObj', 'wrapStyleobj'],
        methods: {
            clickButton: function () {
                this.$emit('clickButton');
            }
        }
    }
</script>

<style lang="sass" rel="stylesheet/scss">
    .button-wrap{
        padding: 0 .4rem;
        margin: .6rem auto ;
    }
</style>