<!--
**Created by jiangxiaoni on 17/03/07.
*
* 验证码倒计时组件
*
* 使用方法
* <IdentCode :seconds="60" @immediately-send="true" @send-code="sendCode" :left-show="true" :ident-style-object="identStyleObject" :left-line-style="leftLineStyle"></IdentCode>
*
* seconds：倒计时的秒数
* immediatelySend: false   是否立即发送   true为立即发送
* send-code：发送验证码的请求接口，一个参数：倒计时的回调函数
* left-show: 左边框是否显示
* identStyleObject: 外层的样式
* leftLineStyle: 左侧线条样式
*
-->
<template>
    <div class="baitiao-text-ident" :style="identStyleObject" @click="getIdentCode" :class="{disabled:startFlag}">
       <div class="baitiao-text-ident-leftline" :style="leftLineStyle" :class="{leftcolorshow:leftShow,leftcolorhide:!leftShow}"></div>
       <span> {{content}}</span>
    </div>
</template>

<style lang="sass" rel="stylesheet/scss">
    .baitiao-text-ident{ 
        height:100%;
        text-align: center;
        color: #ff8833;
        background-color: #FFFFFF;
        float: right;
        display:flex;
        justify-content:center;
        align-items:center;
        width: 2rem;
        span{
            float: right;
            font-size: .3rem;
            width: 1.8rem;
            margin-left:.2rem;
            
        }
        &-leftline{
            float: left;
            height: .5rem;
            &.leftcolorshow{
                border-left: 1px solid #ccc;
            }
            &.leftcolorhide{
                border-left: none;
            }
        }
        &.disabled{
            color: #ccc;
        }
       
    }
</style>
<script>
    export default{
        data(){
            return{
                content: '获取验证码',
                localSeconds: this.seconds,
                startFlag: false
            }
        },
        props: ['seconds','leftShow','identStyleObject','leftLineStyle','immediatelySend'],
        mounted(){
            console.log(this.immediatelySend);
            if(this.immediatelySend){
                this.getIdentCode();
            }
            if(sessionStorage.getItem("leaveSeconds")){
                let leaveSeconds = parseInt(sessionStorage.getItem("leaveSeconds"));
                let leaveTime = parseInt((new Date().getTime() - parseInt(sessionStorage.getItem("leavetime"))) / 1000);
                let showTime = leaveSeconds - leaveTime;
                this.localSeconds = showTime;
                this.startTimeInterval();
            }else{
                this.localSeconds = this.seconds;
            }
        },
        destroyed(){
            if(this.localSeconds != this.seconds){
                sessionStorage.setItem("leaveSeconds",this.localSeconds);
                sessionStorage.setItem("leavetime",new Date().getTime());
            }  
        },
        methods: {
            getIdentCode(){
                if(this.startFlag){
                    return;
                }
                this.$emit('send-code',this.startTimeInterval);
            },
            startTimeInterval() {
                if (this.localSeconds <= 0) { //为0的时候还原
                    this.content = '获取验证码';
                    this.localSeconds = this.seconds;
                    this.startFlag = false;
                    sessionStorage.removeItem("leaveSeconds");
                    sessionStorage.removeItem("leavetime");
                    return false;
                }
                this.startFlag = true;
                this.content = `${this.localSeconds}s`;
                this.localSeconds--;
                setTimeout(this.startTimeInterval, 1000);
            }
        }
    }
</script>
