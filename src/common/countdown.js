/**
 * @name		jQuery Countdown Plugin
 * @author		Martin Angelov
 * @version 	1.0
 * @url			http://tutorialzine.com/2011/12/countdown-jquery/
 * @license		MIT License
 */

(function($){
	
	// Number of seconds in every time division
	var days	= 24*60*60,
		hours	= 60*60,
		minutes	= 60;
	
	// Creating the plugin
	$.fn.countdown = function(prop){
		
		var options = $.extend({
			callback	: function(){},
			timestamp	: 0
		},prop);

		var left, d, h, m, s, positions;

		// Initialize the plugin
		init(this, options);
		
		positions = this.find('.position');
		
		(function tick(){
			//console.log("stamp...",options.timestamp)
			// Time left
			left = Math.floor((options.timestamp - (new Date())) / 1000);
			// console.log("options.timeStamp...",options.timestamp)
			if(left < 0){
				left = 0;
			}
			
			// Number of days left
			d = Math.floor(left / days);
			updateDuo(0, 1, d);
			left -= d*days;
			
			// Number of hours left
			h = Math.floor(left / hours);
			updateDuo(2, 3, h);
			left -= h*hours;
			
			// Number of minutes left
			m = Math.floor(left / minutes);
			updateDuo(4, 5, m);
			left -= m*minutes;
			
			// Number of seconds left
			s = left;
			updateDuo(6, 7, s);
			
			// Calling an optional user supplied callback
			options.callback(d, h, m, s);
			
			// Scheduling another call of this function in 1s
			setTimeout(tick, 1000);
		})();
		
		// This function updates two digit positions at once
		function updateDuo(minor,major,value){
			switchDigit(positions.eq(minor),Math.floor(value/10)%10);
			switchDigit(positions.eq(major),value%10);
		}
		
		return this;
	};


	function init(elem, options){
		elem.addClass('countdownHolder');
		var timeOptions = ['Days','Hours','Minutes','Seconds'];
		var countOptions = ['天','小时','分钟','秒'];

		// Creating the markup inside the container
		$.each(timeOptions,function(i){
			$('<span class="count-item count-item'+this+'">').html(
			// $('<span class="count'+this+' countdown-box">').html(
				'<span class="count'+this+' countdown-box">\
					<span class="position leftnum">\
						<span class="digit static">0</span>\
					</span>\
					<span class="position rightnum">\
						<span class="digit static">0</span>\
					</span>\
				</span>'+
				'<span class="count-options count-options'+timeOptions[i]+'">'+countOptions[i]+'</span>'
			).appendTo(elem);
			// let subElem = $('count-item'+this);
			// $('<span class="count-item'+this+'">').html(
			// 	'<span class="countOptions'+timeOptions[i]+'"></span>'
			// ).appendTo(subElem);
			// console.log(i)
			// if(i === timeOptions.length - 1){
			// subElem.append('<span class="countOptions'+timeOptions[i]+'"></span>')
			// }
			// if(this!="Seconds"){
			// 	elem.append('<span class="countDiv countDiv'+i+'"></span>');
			// }
		});

	}

	// Creates an animated transition between the two numbers
	function switchDigit(position,number){
		
		var digit = position.find('.digit')
		
		if(digit.is(':animated')){
			return false;
		}
		
		if(position.data('digit') == number){
			// We are already showing this number
			return false;
		}
		
		position.data('digit', number);
		
		var replacement = $('<span>',{
			'class':'digit',
			css:{
				top:'-2.1em',
				opacity:0
			},
			html:number
		});
		
		// The .static class is added when the animation
		// completes. This makes it run smoother.
		
		digit
			.before(replacement)
			.removeClass('static')
			.animate({top:'2.5em',opacity:0},'fast',function(){
				digit.remove();
			})

		replacement
			.delay(100)
			.animate({top:0,opacity:1},'fast',function(){
				replacement.addClass('static');
			});
	}
})(jQuery);