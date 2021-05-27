<!--
 *
 * 弹出框
 * 
 * 使用方法：
 * <popup  @hide-popup="showPopup=false" v-on:hide="showPopup=!showPopup" :show-popup="showPopup" :title="'佣金说明'" :hide-delete=""  :actions="actionsArr" :scroll="">
 *     //任意内容，可自定义样式
 *      <p>推荐提成：自己推荐成功的推广员成单成绩的20%</p>
 *      <p>成单任务奖：每日完成任务即得20元奖金</p>
 *      <p>周度排行奖：按成单量及消费量排名</p>
 * </popup>
 *
 *
 * show-popup: 是否显示弹出框，布尔值
 * hide-popup: 点击黑色蒙版隐藏弹窗,可选 (不添加该事件就不会触发点击黑色蒙版隐藏弹窗)
 * title: 弹出框标题文字, 可选
 * hide-delete: 隐藏对话框，值为true的时候才会隐藏，可选
 * actions: 按钮操作，必须为数组，例：[{text:'确认', style: 'color:#666', callback: cb}, {text:'取消', style: 'color:red', callback: cb}]，可选
 * scroll: 值为true的时候, 内容区域限定高度，显示滚动条，可选
 * outerStyleObject: 外框样式，可选
 * titleStyleObject: 标题样式，可选
 * contentStyleObject: 内容外层样式，可选
 * actionsStyleObject: 按钮外层样式，可选
 * 
 -->

<template>
    <div class="popup" v-show="showPopup" v-cloak>
        <transition name="popup-fade">
            <div class="popup-bg" v-show="showPopup" v-tap.prevent="{methods:hide}">
                <a class="popup-close" v-tap.prevent="{methods:hidepopup}" v-show="hideDelete!==!!1" ref="close"></a>
            </div>
        </transition>
        <transition name="popup-show">
            <div class="popup-content" v-show="showPopup" v-bind:style="outerStyleObject" ref="content">
                <h1 class="popup-title" v-if="title" v-bind:style="titleStyleObject">{{title}}</h1>
                <div class="popup-context" :class="{'scroll':scroll}" v-bind:style="contentStyleObject"><slot></slot></div>
                <div class="popup-actions" v-if="actions" v-bind:style="actionsStyleObject">
                    <b v-for="action in actions" :style="action.style" @click="action.callback">{{action.text}}</b>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>

    function getStyle( el, prop ){
        return window.getComputedStyle( el )[ prop ];
    }

    export default {
        data() {
            return {};
        },
        props: ['showPopup', 'title', 'hideDelete', 'actions', 'scroll',"outerStyleObject","titleStyleObject","contentStyleObject","actionsStyleObject"],
        methods: {
            hidepopup () {
                this.$refs.content.style.cssText = this.$refs.content.style.cssText.replace(/margin-top(.+);/, '');
                this.$refs.close.style.cssText = this.$refs.close.style.cssText.replace(/bottom(.+);/, '');
                this.$emit('hide');
            },
            hide(){
                this.$refs.content.style.cssText = this.$refs.content.style.cssText.replace(/margin-top(.+);/, '');
                this.$refs.close.style.cssText = this.$refs.close.style.cssText.replace(/bottom(.+);/, '');
                this.$emit('hide-popup');
            }
        }, 
        watch: {
            showPopup( val ) {
                if( val && this.$refs.close.style.display != 'none' ) {
                    // 防止内容与关闭按钮重叠
                    let htmlFont = parseInt(document.documentElement.style.fontSize);
                    const MARGINTOP = 1.25 * htmlFont,
                          vm = this;

                    setTimeout( ()=>{
                        let dist = vm.$refs.content.offsetHeight+MARGINTOP - vm.$refs.close.offsetTop;
                        if( dist >= 0 ) {
                            let newDist = (dist + vm.$refs.close.offsetHeight) / 2 / htmlFont;
                            vm.$refs.content.style.marginTop = 1.25 - newDist + 'rem';
                            vm.$refs.close.style.bottom = 1.24 - newDist + 'rem';
                        }
                    }, 10);
                }
            }
        }
    }
</script>

<style lang="sass" rel="stylesheet/scss">
    .popup {
        position: fixed;
        top: 0; left: 0;
        height: 100%; 
        width: 100%;       
        z-index: 999999;
        &-bg {
            position: absolute;
            top: 0; left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,.5);
        }
        &-content {
            /*position: absolute;*/
            /*top: 1.25rem;
            left: .36rem;
            right: .36rem;*/
            position: relative;
            margin: 3.5rem .36rem 0;
            background-color: #fff;
            border-radius: .1rem;
            background-color: #fff;
            z-index: 1;
            width: 80%;
            margin-left: 10%;
            h1 {
                font-size: .36rem;
                text-align: center;
                padding-bottom: .2rem;
                border-bottom: 1px solid #f2f2f2;
            }
            p {
                font-size: .3rem;
                line-height: .4rem;
                margin-bottom: .18rem;
            }
        }
        &-context.scroll {
            max-height: 4.1rem;
            overflow: auto;
        }

        &-close {
            position: absolute;
            left: 0; right: 0;
            bottom: 1.24rem;
            margin: auto;
            width: .5rem;
            height: .5rem;
            border-radius: .5rem;
            border: 1px solid #fff;

            &:before, &:after {
                content: '';
                position: absolute;
                top: 0; bottom: 0;
                left: 0; right: 0;
                margin: auto;
                width: 1px;
                height: 75%;
                background-color: #fff;
                transform: rotate(45deg)
            }

            &:after {
                transform: rotate(-45deg)                
            }
        }

        &-actions {
            display: flex;
            margin-top: .5rem;
            &>b {
                flex: 1;
                margin-left: .4rem;
                height: .8rem;
                line-height: .8rem;
                background: #4696d1;
                color: white;
                border-bottom-right-radius: .1rem;
                border-bottom-left-radius: .1rem;
                text-align: center;
                font-size: .32rem;
                &:first-child {
                    margin-left: 0;
                }
            }
        }

        .popup-show-enter-active, .popup-fade-enter-active {
            transition: all .3s ease;
            transform: translateZ(0);
        }
        .popup-show-leave-active, .popup-fade-leave-active {
            transition: all .3s ease-out;
            transform: translateZ(0);
        }
        .popup-show-enter, .popup-show-leave-active {
            margin-top: -12rem;
        }
        .popup-fade-enter, .popup-fade-leave-active {
            opacity: 1;
        }
    }
</style>