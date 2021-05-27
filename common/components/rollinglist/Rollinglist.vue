<template>
    <div class="rolling" :style="rollingStyle" ref="rolling">
        <ul class="rolling-wraper" :style="rollingWraperStyle" ref="rollingWraper" v-cloak>
            <slot v-for="item in rollingItems" :item="item">
                <li class="rolling-line">
                    <span class="rolling-left">恭喜{{item.nick}}</span>
                    <span class="rolling-right">获得{{item.rewardName}}</span>
                </li>
            </slot>
        </ul>
    </div>
</template>
<script>
export default {
    data() {
            return {
                isRolling: false,
                translateY: 0,
                rollingIndex: 0,
                rollingHeight: '100px',
                rollingLiHeight: '25px',
                rollingDone:false,
            }
        },
        computed: {
            rollingStyle() {
                return {
                    height: this.rollingHeight,
                    paddingTop: this.graduallyHide ? this.rollingLiHeight : 0,
                }
            },
            rollingWraperStyle() {
                return {
                    transform: `translate3d(0px,-${this.translateY}px, 0px)`,
                    transition: `transform ${this.transition}s ease-out`
                }
            },
            rollingLen() {
                return this.rollingItems.length;
            },
        },
        props: {
            rollingItems: {
                type: Array,
                default: [],
            },
            transition: { //滚动持续时间
                default: 1.2
            },
            rollInterval: {
                default: 2000,
            },
            showCount: {
                default: 4,
            },
            addLineObj: {
                type: Object,
                default: {},
            },
            graduallyHide: {
                default: false,
            }
        },
        watch: {
            rollingItems() {
                Vue.nextTick(() => {
                    this.setRollingHeight();
                    this.start();
                })
            },
            addLineObj(item) {
                if (item) {
                    this.rollingItems.splice(this.rollingIndex, 0, item)
                }
            }
        },
        methods: {
            setRollingHeight() {
                let rollingWraper = this.$refs.rollingWraper;
                let rollingLi = rollingWraper.getElementsByTagName("li")[0];
                if (rollingLi) {
                    let liHeight = parseFloat(this.getStyle(rollingLi, 'height'));
                    this.rollingHeight = `${liHeight * this.showCount}px`;
                }
            },
            start() {
                if (this.isRolling) {
                    return;
                }
                this.isRolling = true;
                if(!this.rollingDone){
                    this.translateY = 0;
                }
                
                this.rollingIndex = this.showCount;

                let rollingWraper = this.$refs.rollingWraper;
                let rollingLiArray = rollingWraper.getElementsByTagName("li");
                let rollingLi = rollingLiArray[0];
                let liHeight = parseFloat(this.getStyle(rollingLi, 'height'));
                this.rollingLiHeight = `${liHeight}px`;

                let rolling = () => {
                    if (this.rollingIndex++ >= this.rollingLen) {
                        this.isRolling = false;
                        if(this.rollingLen !== 0) {
                            this.rollingDone = true;
                        }
                        return;
                    }
                    if (this.graduallyHide) {
                        rollingLiArray[this.rollingIndex - this.showCount - 1].style.opacity = 0;
                    }
                    this.translateY += liHeight;
                    this.$emit('rolling-callback', this.rollingIndex);
                    if(!this.rollingDone){
                        setTimeout(() => {
                            rolling();
                        }, this.rollInterval);
                    }
                }
                rolling();
            },
            getStyle(target, style) {
                if (!target) {
                    return;
                }
                return window.getComputedStyle(target)[style] || "";
            }
        },
        mounted() {
            this.setRollingHeight();
            this.start();
        },
}
</script>
<style lang="sass" rel="stylesheet/scss">
.rolling {
    overflow: hidden;
    &-wraper {
        li {
            transition: opacity 1s ease-out;
        }
    }
    &-right {
        float: right;
    }
}
</style>
