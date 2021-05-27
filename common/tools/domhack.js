define('domhack', function() {

	// hack:微信端设置title hack
	var setDocTitle = function(title){
		document.title = title;
	    if (/ip(hone|od|ad)/i.test(navigator.userAgent)) {
	        var i = document.createElement('iframe');
	        i.src = '/build/favicon.ico';
	        i.style.display = 'none';
	        i.onload = function() {
	            setTimeout(function(){
	                i.remove();
	            }, 9)
	        }
	        document.body.appendChild(i);
	    }
	}

	return {
		setDocTitle
	}

});