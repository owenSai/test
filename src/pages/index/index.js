import Vue from 'vue';
import VueI18n from 'vue-i18n';
import './index.scss';

Vue.use(VueI18n);

const i18n = new VueI18n({

    locale: 'en', // 定义默认语言为中文 

    messages: {

        'zh': require('../../common/lang/zh.js'),

        'en': require('../../common/lang/en.js'),

        'ko': require('../../common/lang/ko.js')

    }

});

const vm = new Vue({
	el: '#index',
    i18n,
	components: {
	},
	data() {
		return {
            isAdvantage: false,
            isLine: false,
			isPartner:false,
			isContact:false,
			isFixed: false,
			isClickContact: false,
            showLang: false
		};
	},
	mounted() {
        let vm = this;
        window.onscroll = function() {
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            let advantageTop = document.getElementById("advantage").offsetTop;
            let lineTop = document.getElementById("line").offsetTop;
            let partnerTop = document.getElementById("partner").offsetTop;
            let contactTop = document.getElementById("contact").offsetTop;
            if (scrollTop > (advantageTop-200)) {
                document.getElementsByClassName('index-header-box')[0].style.background = 'rgba(0,0,0,0.8)';
                vm.isFixed = true;
            } else {
                document.getElementsByClassName('index-header-box')[0].style.background = 'rgba(0,0,0,0)';
                vm.isFixed = false;
            }

            if (scrollTop >= 0 & scrollTop < (advantageTop-200)) {
                vm.isAdvantage = false;
                vm.isLine = false;
                vm.isPartner = false;
                vm.isContact = false;
            } else if (scrollTop >= (advantageTop-200) & scrollTop < (lineTop-200)) {
                vm.isAdvantage = true;
                vm.isLine = false;
                vm.isPartner = false;
                vm.isContact = false;
            } else if (scrollTop >= (lineTop - 200) & scrollTop < (partnerTop-300)) {
                vm.isAdvantage = false;
                vm.isLine = true;
                vm.isPartner = false;
                vm.isContact = false;
            } else if (scrollTop >= (partnerTop-300) & scrollTop < (contactTop-300)) {
                vm.isAdvantage = false;
                vm.isLine = false;
                vm.isPartner = true;
                vm.isContact = false;
                if(vm.isClickContact){
                    vm.isAdvantage = false;
                    vm.isLine = false;
                    vm.isPartner = false;
                    vm.isContact = true;
                }
            }
        }
	},
	methods:{
		clickContact(){
            location.href='#contact';
            this.isAdvantage = false;
            this.isLine = false;
            this.isPartner = false;
            this.isContact = true;
            this.isClickContact = true;
		},
		clickPartner(){
            location.href='#partner';
            this.isAdvantage = false;
            this.isLine = false;
            this.isPartner = true;
            this.isContact = false;
            this.isClickContact = false;
		},
        chooseLang(){
            this.showLang = true;
        },
        changeToChinese(){
            this.$i18n.locale = 'zh';
            this.showLang = false;
        },
        changeToEn(){
            this.$i18n.locale = 'en';
            this.showLang = false;
        },
        changeToKo(){
            this.$i18n.locale = 'ko';
            this.showLang = false;
        },
        hideLang(){
            this.showLang = false;
        }
	}
});