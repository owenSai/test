<!--
 *
 * 仅作为v2.3.0新用户开启页以及落地页使用
 * 
 * 使用方法：
 * <payback-section v-on:fetch="fetchData"></payback-section>
 * 
 * 若要获取数据，在调用组件页面添加fetchData(data)方法，接受data参数
 * 
 -->


<template>
    <section class="payback" :class="currentPage">
        <div class="return1">
            <h2>果仁分红{{currentPage==='welcome' ? '天天领' : ''}}</h2>
            <p class="bonus">已累计发放分红<span><b v-text="bonusData.cumulativePushBonusRMB||'-'"></b>元</span></p>
            <div class="bonus-daily">
                <p>每日万元分红约</p>
                <p class="price"><span v-text="bonusData.perMillionBonusProfit||'-'"></span>元</p>
            </div>
            <p class="tip">新用户专享{{bonusData.bonusNewUserCritRate||'-'}}倍分红特权{{bonusData.bonusNewUserActivityTime||'-'}}天</p>
        </div>

        <div class="return2">
            <!-- <h2>{{currentPage==='welcome' ? '果仁(GOP)价格增值' : '果仁(GOP)价值投资'}}</h2> -->
            <h2>果仁(GOP)价值投资</h2>
            <p class="chg">近{{incomeDays}}天年涨跌幅<span>{{incomeRate||'-'}}%</span></p>
            <div class="chart">
                <!-- <history-chart :history-day="incomeDays" :bgcolor="currentPage==='welcome'?'#ff9e45':'#f23d50' "></history-chart> -->
                <historyChartNew :history-day="incomeDays"  :bgcolor="newBgColor"></historyChartNew>
            </div>
            <p class="tip">{{incomeDays}}天前购买{{sampleAmount}}元今日已赚{{incomeSum||'-'}}元</p>
        </div>
    </section>
</template>

<script>
    import Tips from '../tips/Tips.vue';
    // import ChartHistory from '../charthistory/chartHistory.vue';
    import Api from '../../library/h5-api'
    import historyChartNew from '../chartHistoryNew/chartHistoryNew.vue';

    export default {
        components: {
            tip: Tips,
            // historyChart: ChartHistory
            historyChartNew
        },
        
        data() {
            let href = location.href;
            return {
                currentPage: href.indexOf('welcome') > 0 ? 'welcome' : href.indexOf('landingpage') > 0 ? 'landingpage' : 'none',
                bonusData: {},
                incomeRate: '-',
                incomeSum: '-',
                incomeDays: 180,
                sampleAmount: 10000,

                newBgColor:this.currentPage==='welcome'?'#ff9e45':'#f23d50'
            };
        },

        created() {
            this.getBounsData();
        },

        methods: {
            showTip( content ){
                this.showFlag = true;
                this.tipContent = content;
            },

            numSplit(num) {
                return num.toString().replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, '$&,');
            },

            getBounsData() {
                let vm = this;
                const DAYS = this.incomeDays;

                Api.bonusConfig({}).then(function(res) {
                    if (res.status == 200) {
                        res.data.userNumByRealGopNum = vm.numSplit(res.data.userNumByRealGopNum);
                        res.data.cumulativePushBonusRMB = vm.numSplit(res.data.cumulativePushBonusRMB.toFixed(2));
                        vm.bonusData = res.data;
                        vm.$emit('fetch', res.data);
                    } else {
                        vm.showTip( res.msg );
                    }
                });

                Api.annualizedReturns({ severalDays: DAYS }).then(function(res) {
                    if (res.status == 200) {
                        let incomeRate = +res.data.annualizedReturns;
                        // incomeRate = filters.ceilFix(incomeRate);
                        vm.incomeRate = incomeRate.toFixed(2);
                        if (incomeRate > 0) vm.incomeRate = "+" + incomeRate.toFixed(2);
                    } else {
                        vm.showTip( res.msg );
                    }
                });

                // 计算180天购买的人收益
                Api.priceBid({}).then(function(data) {
                    let currPrice = data.bid;
                    Api.somedayHistoryprice({ days: DAYS }).then(function(res) {
                        if (res.status == 200) {
                            let someday = res.data.data[DAYS];
                            vm.incomeSum = (((vm.sampleAmount / someday.price) * currPrice) - vm.sampleAmount).toFixed(2);
                        } 
                    });
                });
            }
        }
    }
</script>

<style lang="sass" rel="stylesheet/scss">

    section.payback {
        &.none {display:none}
        text-align: center;
        line-height: 1;

        [class^=return] {
            background-color: #f5f5f5;
            margin: 0 .36rem .42rem;
            padding: .56rem 0;
            border-radius: .2rem;
            position: relative;
            &:before {
                content: '';
                position: absolute;
                left: .24rem;
                top: -.09rem;
                width: .94rem;
                height: .9rem;
                background-repeat: no-repeat;
                background-size: cover;
            }

            &>h2 {
                font-size: .44rem;
            }

            .bonus {
                display: inline-block;
                font-size: .24rem;
                color: #666;
                margin: .32rem 0;
                position: relative;
                &:before, &:after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: -.68rem;
                    width: .45rem;
                    height: 1px;
                    background-color: #d5d5d5;
                }

                &:after {
                    left: auto;
                    right: -.68rem;
                }

                span b {
                    font-size: .32rem;
                }
            }

            .bonus-daily {
                width: 2.78rem;
                background-color: #fff;
                color: #666;
                font-size: .24rem;
                margin: 0 auto .2rem;
                border-radius: .2rem;
                padding: .26rem 0;
                .price {
                    color: #ff3b30;
                    margin-top: .24rem;
                    span {
                        font-size: .88rem;
                    }
                }
            }

            .chg {
                display: inline-block;
                border-radius: .2rem;
                padding: .16rem;
                background-color: #fff;
                margin-top: .24rem;
                span {
                    color: #ff3b30;
                    font-size: .44rem;
                }      
            }

            .chart {
                margin: .4rem .32rem 0;
            }

            .tip {
                display: inline-block;
                line-height: 1.5;
                color: #fff;
                background-color: #ff9e45;
                padding: 0 .12rem;
                border-radius: .6rem;
            }
        }

        $welcomeColor: #ff9e45;
        $landingColor: #f23d50;

        &.welcome {
            .bonus span {
                color: $welcomeColor;
            }

            .tip {
                background-color: $welcomeColor;                
            }

            .return1 {
                &:before {
                    background-image: url('./images/kqy_huibao1.png');
                }
            }

            .return2 {
                &:before {
                    background-image: url('./images/kqy_huibao2.png');
                }
            }
        }


        &.landingpage {
            .bonus span {
                color: $landingColor;
            }

            .tip {
                background-color: $landingColor;                
            }

            .return1 {
                &:before {
                    background-image: url('./images/kqy_fl1.png');
                }
            }

            .return2 {
                &:before {
                    background-image: url('./images/kqy_fl2.png');
                }
            }
        }

    }
    
</style>