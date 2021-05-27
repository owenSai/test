<!--
**Created by jiangxiaoni on 17/03/03.
*
* <Success :success-show="successShow" :success-text="'密码修改成功,请牢记,3s后自动跳转'"></Success>
*
* success-show: 判断是否显示
* success-text: 提示文案
*
*
-->
<template>
    <div class="dialog-success" v-show="successShow">
        <div class="dialog-success-box">
            <div class="dialog-success-box-img"></div>
            <div class="dialog-success-box-text">{{successText}}</div>
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return{}
        },
        props: ['successShow','successText']

    }
</script>
<style lang="sass" rel="stylesheet/scss">
    .dialog-success{
        width:100%;
        height:100%;
        background-color: rgba(0,0,0,0.6);
        position: fixed;
        top:0;
        left:0;
        z-index:1000;
        &-box{
            width:70%;
            height:160px;
            background-color: #FFFFFF;
            border-radius: 10px;
            position: absolute;
            top:30%;
            left:15%;
            text-align: center;
            &-img{
                display: block;
                width:41px;
                height: 41px;
                background-image: url("./images/success.png");
                background-size: 41px 41px;
                margin: 0 auto;
                margin-top: 20px;
            }
            &-text{
                width:80%;
                margin:0 auto;
                margin-top: 20px;
                color: #5580f7;
            }
        }
    }
</style>