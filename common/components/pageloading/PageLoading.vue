<template>
    <div class="page-loadding">
        <p>loading<span class="page-loadding-dotting"></span></p>
    </div>
</template>

<script>
    export default {
        data() {
            return {};
        },
    }
</script>

<style lang="sass" rel="stylesheet/scss">
    .page-loadding {
        width: 150px;
        height: 80px;
        position: absolute;
        top:50%;
        left: 50%;
        margin: -130px auto auto -75px;
        text-align: center;
    }
    .page-loadding img{
        width: 60px;
    }
    .page-loadding p{
        line-height: 50px;
        opacity: 0.7;
    }

    .page-loadding-dotting {
        display: inline-block; min-width: 2px; min-height: 2px;
        box-shadow: 2px 0 currentColor, 6px 0 currentColor, 10px 0 currentColor; /* for IE9+, ..., 3个点 */
        animation: page-loadding-dot 2s infinite step-start both; /* for IE10+, ... */
    }
    .page-loadding-dotting { margin-right: 8px; } /* for IE9+,FF,CH,OP,SF 占据空间*/

    @keyframes page-loadding-dot {
        25% { box-shadow: none; }                                  /* 0个点 */
        50% { box-shadow: 2px 0 currentColor; }                    /* 1个点 */
        75% { box-shadow: 2px 0 currentColor, 6px 0 currentColor;  /* 2个点 */ }
    }
</style>