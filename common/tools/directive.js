/**
 * @file
 * @auth zhuhao
 * @date 2016/12/19
 */

import Vue from 'vue'
import Utils from './utils'

const scroll = Utils.debounce( function(el, binding) {
    if(document.body.scrollTop + window.innerHeight >= document.body.scrollHeight &&
    +sessionStorage.enableScroll ) {
        var fn = binding.value;
        fn();
    }
}, 200);

Vue.directive('scroll', function(el, binding){
    window.addEventListener('scroll', function(){ scroll(el, binding) });
});