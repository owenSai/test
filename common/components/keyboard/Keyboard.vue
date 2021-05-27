<!--
**Created by jiangxiaoni on 17/02/28.
*
* 安全键盘
*
* 使用方法
* <Keyboard :main-class="'pay-bankcard'" :keyboard-show="keyboardShow" @click-num="clickNum" @delete-num="deleteNum"  @hide-keyboard="keyboardShow=false"></Keyboard>
*
* main-class: 页面所在的app下最外层的class名  用于处理安全键盘盖住input问题
* keyboard-show：是否显示安全键盘  布尔值
* complete-show : 是否显示右上角的完成  布尔值
* click-num：选择数字回调函数   返回值：点击的数字
* delete-num：删除数字回调函数
* hide-keyboard: 点击页面空白处隐藏键盘
*
* ps:   1、调用该组件的input需要屏蔽弹出自带虚拟键盘  可设置readonly
*       2、调用该组件的input需要加ref='keyboard_1'  用于判断当前点击位置是否在该input上-----yes:不隐藏键盘   no:隐藏键盘
* 
* 
-->
<template>
    <transition name="wlf-safekeyboard">
        <div class="wlf-safekeyboard" id="wlf-safekeyboard" v-show="keyboardShow">
            <ul class="wlf-safekeyboard-key">
                <li v-for='item in numArr' v-tap.prevent="{methods:touchstart,item:item}">{{(typeof item) !=
                    string ? item : ''}}
                </li>
                <li v-tap.prevent="{methods:touchstart,item:'delete'}"><i class="wlf-safekeyboard-delete"></i></li>
            </ul>
        </div>
    </transition>
</template>
<script>
    export default{
        data(){
            return {
                numArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0],
            }
        },
        props: ['keyboardShow','mainClass'],
        watch:{
            keyboardShow(){
                if(!this.mainClass){
                    return;
                }
                if(this.keyboardShow){
                    document.getElementsByClassName(this.mainClass)[0].style.paddingBottom = '200px';
                    setTimeout(() => {
                        window.scrollTo(0,80);
                    },100);
                }else{
                    document.getElementsByClassName(this.mainClass)[0].style.paddingBottom = '0px';
                    window.scrollTo(0,0);
                }
            }
        },
        mounted(){
            // document.body.addEventListener('touchend', this.hideKeyboardHandler, false);
            document.body.addEventListener('touchomve', function (e) {
                e.preventDefault();//滑动的时候连续地触发,阻止滚动
            }, false);
        },
        methods: {
            touchstart(params){
                let target = event.target;
                if (target.nodeName.toLowerCase() === 'li') {
                    target.style.backgroundColor = '#f2f2f2';
                } else {
                    target.parentNode.style.backgroundColor = '#f2f2f2';
                }
                setTimeout(() => {
                    target.style.backgroundColor = '#ffffff';
                },100);
                if(params.item === ''){
                    return;
                }
                if(params.item == 'delete'){
                    this.$emit('delete-num');
                }else{
                    this.$emit('click-num', params.item);
                }
            },
            // clickNum(item){
            //     event.target.style.backgroundColor = '#ffffff';
            //     this.$emit('click-num', item);
            // },
            // deleteNum(){
            //     if (event.target.nodeName.toLowerCase() === 'li') {
            //         event.target.style.backgroundColor = '#ffffff';
            //     } else {
            //         event.target.parentNode.style.backgroundColor = '#ffffff';
            //     }
            //     this.$emit('delete-num');
            // },
            hideKeyboardHandler(){
                let obj = event.srcElement ? event.srcElement : event.target;
                let isClickKeyboard = this.parentsUntil(obj, document.getElementById("wlf-safekeyboard"));
                if (this.$parent.$refs.keyboard_1.indexOf(obj) < 0 && isClickKeyboard.length==0) {
                    this.$emit('hide-keyboard');
                }
            },
            hideKeyboard(){
                this.$emit('hide-keyboard');
            },
            isClickKeyboard(parentsArr){
                let isClick = false;
                for (let i = 0; i < parentsArr.length - 1; i++) {
                    if (parentsArr[i].className && parentsArr[i].className.toString().toLowerCase() === 'wlf-safekeyboard') {
                        isClick = true;
                    }
                }
                return isClick;
            },
            dir(el, until){
                var matched = [], cur =el;
                if (!until) {
                    return [];
                }
                if (cur == until) {
                    return [cur];
                } else {
                    for (; ;) {
                        if (!cur || cur.nodeType == 9) {
                            break;
                        }
                        if (cur == until) {
                            matched.push(cur);
                            break;
                        }
                        cur = cur.parentNode;
                    }
                }
                return matched;
            },
            parentsUntil(el, until){
                return this.dir(el,  until);
            }
        }
    }
</script>
<style lang="sass" rel="stylesheet/scss">
    .wlf-safekeyboard {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 10000;
        width: 100%;
        user-select: none;
        &-hide {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
        }
        &-key {
            width: 100%;
            position: absolute;
            bottom: 0;
            left: 0;
            background: #FFFFFF;
            li {
                width: 33%;
                height: 50px;
                line-height:50px;
                position: relative;
                text-align: center;
                font-size: 24px;
                font-weight: 800;
                float: left;
                border-top: 1px solid #DDDDDD;
                border-right: 1px solid #DDDDDD;
                &:after{
                    content:'';
                    display: block;
                    height:0;
                    clear:both;
                }
            }
            li:nth-child(3n) {
                border-right: none;
                i {
                    display: inline-block;
                    margin-top: -3px;
                }
            }
        }
        &-delete{
            text-align: center;
            background-image: url('./images/safeclose.png');
            width: 24px;
            height: 19px;
            background-size: contain;
            background-repeat: no-repeat;
            display: inline-block;
        }
    }

    .wlf-safekeyboard-enter, .wlf-safekeyboard-leave-active {
        bottom: -50%;
    }

    .wlf-safekeyboard-enter-active, .wlf-safekeyboard-leave-active {
        transition: all .25s linear;
    }
</style>