// 张树垚 2015-12-25 14:07:17 创建
// H5微信端 --- components-alert


import TouchSlide from '../TouchSlide.1.1.source'
// define('h5-touchsliderBanner', ['touch-slide'], function(TouchSlide) {

	var touchsliderBanner = {};

	touchsliderBanner.options = {
		slideCell: '#touchSlide',
		autoPlay: true,
		mainCell: '.slider-bd', //图片内容
		titCell: '.slider-hd-li',//圆点,
		wrapCell:"#touchslider_wraper"
		// endFun: $.noop
	};
	touchsliderBanner.touchsliderFn = function(options) {
		TouchSlide(Object.assign({},this.options, options));
	};

	export default touchsliderBanner;
// });