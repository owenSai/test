/**
 * 原生JS弹窗 供组件js使用
 * 
 * 使用方法：Tips(msg)
 * 
 */


function $( sel ){
	return document.querySelector( sel );
}

function createStyle( cssText ){
    let resultStyle = $('#tips-style');
	if( !resultStyle ){
		resultStyle = document.createElement('style'); 
		var head = $( 'head' );
		resultStyle.type = 'text/css';
        resultStyle.id = 'tips-style';
		resultStyle.media = 'screen';	
		head.appendChild( resultStyle );
	}
	resultStyle.innerHTML = cssText;
}

export function Tips( msg, t ){

    var time = t || 2000; // 停留时间

    createStyle (`
        .tips-st {
            position: fixed;
            left: 50%;
            bottom: 25%;
            line-height: 18px;
            z-index: 9999999;
            opacity: 0;
            font-size: 12px;
            background-color: rgba(0,0,0,.8);
            border-radius: 9px;
            color: #ffffff;
            text-align: center;
            padding: 10px;
            white-space: nowrap;
            transform: translate3d(-50%,15%,0);
            -webkit-transform: translate3d(-50%,15%,0);
            transition: all .25s linear;
            -webkit-transition: all .25s linear;
            pointer-events:none;
        }
        .tips-st.enter{
            opacity: 1;
            bottom: 45%;
        }
    `);

    let dom = $('.tips-st');
    if (!dom) {
        dom = document.createElement('div');
        dom.className = 'tips-st';
        dom.innerHTML = msg;
        document.body.appendChild( dom );
    }

	let timer = null;
    setTimeout(function() {
        dom.className += ' enter';
        clearTimeout(timer);
        timer = setTimeout(() => {
            dom.className = dom.className.replace(' enter', '');
        }, time);
    }, 10);
}