<!--
 *
 * loading组件--"数据请求中"
 *
 * 使用方法：
 * <loading v-on:hide="hideLoading"  :show-loading="showLoading"></loading>
 *
 *
 * show-loading: 是否显示，布尔值，初始需设置为true
 * loadingText: loading时显示的文案，默认为‘数据请求中’，可更改
 * hideLoading: 添加hideLoading()函数至methods中，控制showLoading值
 *              hideLoading(){
 *                  this.showLoading = false;
 *              },
 *              调用数据的接口，数据成功调回后，调用hideLoading()
 *
 -->
<template>
	<div>
		<transition name="fade">
			<div class="data-loading" v-if="showLoading">
			    <div class="superman-body">
			        <i class="icon-superman i-superman-cloud"></i>
			        <div class="superman">
			            <i class="icon-superman i-superman-body"></i>
			            <i class="icon-superman i-superman-cloak"></i>
			        </div>
			        <p>加载中...</p>
			    </div>
			</div>
		</transition>
	</div>
</template>

<script>
	export default {
		data() {
			return{}
		},
		props: ['showLoading', 'loadingText'],
		watch:{
			showLoading(){
				if(!this.showLoading){
					this.hide();
				}
			}
		},
		methods:{
			hide(){
				this.$emit('hide');
			}
		}
	}
</script>

<style lang="sass" rel="stylesheet/scss">
	
.data-loading {
    position: fixed;
    z-index: 9999;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    .fade-enter-active, .fade-leave-active {
		transition: opacity .5s;
	}
	.fade-enter, .fade-leave-to {
		opacity: 0;
	}
}
</style>