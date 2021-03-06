/*!
 * iScroll v4.1.9 ~ Copyright (c) 2011 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
 import iScroll4 from './iscroll4.js';

define('iscrollLoading', function() {
	var iscrollLoading = {};

	//以下 上拉  下拉刷新的  业务函数	
	iscrollLoading.beforeScrollStart = function() {}; //开始移动前
	iscrollLoading.scrollMove = function() {}; //手指移动时候
	iscrollLoading.beforeScrollEndTrue = function() {}; //手指移开前 满足条件
	iscrollLoading.beforeScrollEndFalse = function() {}; //手指移开前 不满足条件
	iscrollLoading.scrollEnd = function() {}; //滑动完成后	
	iscrollLoading.downLoadingData = function() {}; //下拉加载数据API
	iscrollLoading.upLoadingData = function() {}; //上拉加载数据API
	iscrollLoading.bottomHeight = iscrollLoading.bottomHeight || 20; // 下拉加载的高度
	//添加订阅事件用的
	['onBeforeScrollStart', 'onScrollMove', 'onBeforeScrollEnd', 'onScrollEnd'].forEach(function(name) {
		iscrollLoading[name] = [];
	});
	iscrollLoading.on = function(name, cbFn) {
		iscrollLoading[name].push(cbFn);
	};

	iscrollLoading.set = function(id, options) {
		if (!id) {
			return;
		}
		options = options || {};

		options = Object.assign({
			vScrollbar: false,
			preventDefault: true,
			fixedScrollbar: true,
			useTransition: true,
			click: true,
			onBeforeScrollStart: function() { //滚动前  刚下手 （多事件捆绑onBeforeScrollStart）
				iscrollLoading['onBeforeScrollStart'].length && iscrollLoading['onBeforeScrollStart'].forEach(function(cbFn) {
					cbFn();
				});
			},
			onScrollMove: function() { //移动时候  判断Y位置 及是否允许上拉 （多事件捆绑onScrollMove）
				if (this.y >= 0 && options.userUp) {
					iscrollLoading.scrollMove && iscrollLoading.scrollMove();
				}
				iscrollLoading['onScrollMove'].length && iscrollLoading['onScrollMove'].forEach(function(cbFn) {
					cbFn();
				});
			},
			onBeforeScrollEnd: function() { //松手前  上拉判别  （多事件捆绑 onBeforeScrollEnd）
				if (this.y >= 60 && options.userUp) {
					iscrollLoading.beforeScrollEndTrue && iscrollLoading.beforeScrollEndTrue();
				} else {
					iscrollLoading.beforeScrollEndFalse && iscrollLoading.beforeScrollEndFalse();
				}
				iscrollLoading['onBeforeScrollEnd'].length && iscrollLoading['onBeforeScrollEnd'].forEach(function(cbFn) {
					cbFn();
				});
			},
			onScrollEnd: function() { //松手及滑动结束后   判断是否下拉  及允许下拉(多事件捆绑 onScrollEnd)
				//长帐单
				if (this.y < 0 && (this.y - iscrollLoading.bottomHeight < this.maxScrollY) && options.userDown) {
					iscrollLoading.scrollEnd && iscrollLoading.scrollEnd();
				}
				iscrollLoading['onScrollEnd'].length && iscrollLoading['onScrollEnd'].forEach(function(cbFn) {
					cbFn();
				});
			},
		}, options);
		return new iScroll4(id, options);
	};

	return iscrollLoading;
});