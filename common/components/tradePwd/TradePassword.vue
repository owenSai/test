<!--
**Created by jiangxiaoni on 17/03/01.
*
* 安全键盘---针对支付时的交易密码
*
* 使用方法
* <Tradepwd :trade-pwd-show="tradePwdShow" :has-pwd="hasPwd" :isLoan='true' :bank-icon="bankIcon" :loan-money="loanMoney" :bank-info="bankInfo"  @close-keyboard="tradePwdShow=false" @request-data="requestData"></Tradepwd>
*
* tradePwdShow：是否显示安全键盘  布尔值
* //isLoan: true 表示借款时的弹出的交易密码   false为还款时的交易密码
* hasPwd: 是否已经设置密码  字符串“true” "false"
* bankIcon: 银行卡图片
* loanMoney:借款金额
* bankInfo: 银行卡信息
* close-keyboard：点击密码框的X 隐藏安全键盘
* request-data: 输入6位密码后请求接口数据
* tradeTitle :金额上方标题
* 
-->
<template>
	<div class="tradePwd" v-show="tradePwdShow">
		<transition name="trade-password">
			<section class="trade-password" v-show="tradePwdShow">
				<h3 class="trade-password-title"><i class="trade-password-close" @click="closeKeyboard"></i>{{pwdTitle}}</h3>
				<div class="trade-password-desc">{{tradeTitle}}</div>
				<div class="trade-password-money">¥{{loanMoney}}</div>
				<div class="trade-password-bank">
					<img :src="bankIcon" class="trade-password-bank-icon">{{bankInfo}}
				</div>
				<div class="trade-password-box">
					<div class="trade-password-box-item" v-for="n in paypassLength" :class="{'on': n-1<keyboardText.length}"></div>
				</div>
			</section>
		</transition>
		<Keyboard :keyboard-show="tradePwdShow" @click-num="clickNum" @delete-num="deleteNum" :complete-show="false"></Keyboard>
		<Tips v-on:hidetips="showFlag=false" :show-flag="showFlag" :content="tipContent"></Tips>
	</div>
</template>
<script type="text/javascript">
	import Keyboard from '../keyboard/Keyboard.vue';
	import Tips  from '../tips/Tips.vue';
	export default{
        data(){
            return{
				keyboardText:[],
				paypassLength: 6,
				showFlag:false,
				tipContent:'',
				pwdTitle: '请输入交易密码',
				tradeTitle: '借款金额'
			}
        },
        components: {
            Keyboard,
            Tips
        },
        props: ['tradePwdShow','bankIcon','loanMoney','bankInfo','hasPwd','tradeTitle'],
        created(){
        	sessionStorage.removeItem("firstPwd");
        	// this.tradeTitle = this.isLoan? '借款金额' : '还款金额';
        },
        watch:{
        	hasPwd(){
        		this.pwdTitle = this.hasPwd === 'true' ? '请输入交易密码' : '请设置交易密码';
        	}
        },
        methods: {
        	showTip( content ){  // 显示弱提示
		      this.showFlag = true;
		      this.tipContent = content;
		    },
			clickNum(item){
				if(item === ''){
					return;
				}
				if(this.keyboardText.length < this.paypassLength) this.keyboardText.push(item);
				console.log(this.hasPwd,'......');
				if(this.hasPwd != 'true'){
					setTimeout(() => {
						if(this.keyboardText.length == this.paypassLength){
							if(sessionStorage.getItem("firstPwd")){
								if(this.keyboardText.join('') == sessionStorage.getItem("firstPwd")){
									sessionStorage.removeItem("firstPwd");
									this.pwdTitle = this.hasPwd === 'true' ? '请输入交易密码' : '请设置交易密码';
									this.$emit('close-keyboard');
									this.$emit('request-data',this.keyboardText.join(''));
									this.keyboardText = [];
								}else{
									this.showTip("两次输入的密码不一致");
									this.pwdTitle = '请设置交易密码';
									sessionStorage.removeItem("firstPwd");
									this.keyboardText = [];
								}
							}else{
								sessionStorage.setItem("firstPwd",this.keyboardText.join(''));
								this.pwdTitle = '请再次输入交易密码';
								this.keyboardText = [];
							}
						}
					},100);
				}else{
					if(this.keyboardText.length == this.paypassLength){
						sessionStorage.removeItem("firstPwd");
						this.$emit('close-keyboard');
						this.$emit('request-data',this.keyboardText.join(''));
						this.keyboardText = [];
					}
				}
				
			},
			deleteNum(){
				if(this.keyboardText.length) this.keyboardText.pop();
			},
			closeKeyboard(){
				this.keyboardText = [];
				this.pwdTitle = this.hasPwd === 'true' ? '请输入交易密码' : '请设置交易密码';
				sessionStorage.removeItem("firstPwd");
				this.$emit('close-keyboard');
			}
        }
    }
</script>
<style lang="sass" rel="stylesheet/scss">
	.tradePwd{
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background-color:rgba(0,0,0,0.6);
	}
	.trade-password{
		position: absolute;
		top:10%;
		left:10%;
		z-index:10000;
		width:80%;
		height: 4rem;
		background: #fff;
		box-sizing: border-box;
		padding:0 .3rem;
		user-select:none;
		border-radius: .1rem;
		&-close{
			content: '';
			width: 15px;
			height:15px;
			background-image: url('./images/close.png');
			background-size: 15px 15px;
			background-repeat: no-repeat;
			position: absolute;
			top: 17px;
			left: 15px;
			z-index:2;
		}
		&-title{
			height: .92rem;
			line-height: .92rem;
			text-align: center;
			font-size: .32rem;
			border-bottom: 1px solid #3ba3f2;
		}
		&-desc{
			text-align: center;
			font-size: .28rem;
			margin-top: .2rem;
		}
		&-money{
			text-align: center;
			font-size: .48rem;
			margin-top: .1rem;
			font-weight: 500;
		}
		&-bank{
			text-align: center;
			font-size: .28rem;
			margin-top: .1rem;
			&-icon{
				width: .44rem;
			    height: .44rem;
			    vertical-align: middle;
			    margin-right: .1rem;
			}
		}
		&-box{
			width:220px;
			height:35px;
			margin:0 auto;
			margin-top: 15px;
			position: relative;
			display: flex;
			border:1px solid #8c8c8c;
			background-color: #FFFFFF;
			&-item{
				flex:1;
				height:100%;
				border-right: 1px solid #ddd;
				box-sizing: border-box;
				position: relative;
				&:last-child{
					border-right:none;
				}
				&.on{
					color:red;
					&:after{
						content: '';
						width:24%;
						height:24%;
						position: absolute;
						top:50%;
						left:50%;
						margin-left: -12%;
						margin-top: -12%;
						background-color: #000;
						border-radius: 50%;
					}
				}
			}
		}
		&-forget{
			text-align: right;
			font-size: .28rem;
			margin-top: 8px;
			color: #6888d9;
			span{
				float: left;
				margin-left: 25px;
				color: #ff5a6b;
			}
			a{
				color: #6888d9;
			}
		}
	}
	.tel-blue{
		color: #6888d9;
	}
	.trade-password-enter,.trade-password-leave-active{
		bottom:-50%;
	}
	.trade-password-enter-active,.trade-password-leave-active{
        transition: all .25s linear;
    }
</style>






