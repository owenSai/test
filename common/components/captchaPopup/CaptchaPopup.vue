<!--
 *
 * 图形验证码弹框
 * 
 * 使用方法：
 * <captcha-popup :show-captcha="showCaptcha" :captcha-text="captchaText" :captcha-img="captchaImg" :captcha-red="captchaRed" @checkcaptcha="captchaCheck" @getcaptcha="getCaptcha"></captcha-popup>

 show-captcha:图形验证码弹框 显示控制
 captcha-text：输入图形验证码 及 图形验证码输入错误 时的文案展示
 captcha-img：base64图片
 captcha-red:图形验证码输入错误时，文案为红色，captcha-red为true
 checkcaptcha：验证码输入满4位$emit给父组件的函数
 getcaptcha：点击图片区域，再次获取图形验证码（父组件中定义）

 * 
 -->

<template>
    <div class="captcha" v-if="showCaptcha" v-cloak>
        <popup :show-popup="showCaptcha" :hide-delete="true" :outer-style-object="captchaOuter">
            <div class="captcha-info">
                <input class="captcha-info-input" id="captcha-input" name="captcha-input" autocomplete="off" autofocus="autofocus" placeholder=""  maxlength="4" data-text="close" ref="captchaInput" v-model="captcha" @input="captchaCheck($event)">
                <div class="captcha-info-img" @click="getCaptcha">
                    <img class="captcha-info-img-codeimg" :src="captchaImg"/>
                </div>
            </div>
            <div class="captcha-tips" :class="{'captcha-tips-red':captchaRed}">{{captchaText}}</div>
        </popup>
    </div>
</template>

<script>
    import Popup from '../popup/PopUp.vue';

    export default {
        components:{
            Popup
        },
        data() {
            return {
                captchaOuter:{
                    margin:'2rem auto',
                    width:'60%',
                    // padding:'.9rem .6rem',
                    // top:'45%',
                    // transform:'translateY(-50%)'
                },
                // captcha:''
            };
        },
        props: ['showCaptcha','captchaText','captchaImg','captchaRed','captcha'],
        methods: {
            captchaCheck(event){
                let vm = this;
                let captchaCode = vm.captcha;
                if(captchaCode.length === 4){
                    vm.$emit("checkcaptcha",{
                        'captcha':vm.captcha,
                        'target':event.target
                    });
                }
            },
            getCaptcha(){
                this.$emit("getcaptcha")
            }
        }
    }
</script>

<style lang="sass" rel="stylesheet/scss">
    .captcha{
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: 999999;
        %commonHeight{
            height:.77rem;
            line-height: .77rem;
            box-sizing: border-box;
        }
        %commonBorder{
            border: 1px solid #999;
            border-radius: .1rem;
        }
        &-info{
            display: flex;
            justify-content: space-between;
            overflow: hidden;
            @extend %commonHeight;
            &-input{
                width: 2.3rem;
                font-size: .24rem;
                color: #333;
                text-align: center;
                @extend %commonHeight;
                @extend %commonBorder;
            }
            &-img{
                width: 1.6rem;
                overflow: hidden;
                @extend %commonHeight;
                @extend %commonBorder;
                &-codeimg{
                    width:100%;
                    height:100%;
                }
            }
        }
        &-tips{
            font-size: .28rem;
            line-height: .28rem;
            color: #333;
            margin-top: .3rem;
            text-align: center;
            &-red{
                color: #ff3b30;
            }
        }
    }
</style>