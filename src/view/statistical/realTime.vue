<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-s-data grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{ numberOfParking }}</div>
                                    <div>今日停车量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-s-order grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{ numberOfOrders }}</div>
                                    <div>今日订单数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-cpu grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{ amountReceived }}</div>
                                    <div>今日已收金额</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="12">
                        <el-card shadow="hover" style="height:403px;max-width: 553px;">
                            <div slot="header" class="clearfix">
                                <span>今日营业额</span>
                            </div>
                            <div class="schart-box">
                                <div class="content-title">饼状图</div>
                                <div id="main"></div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="12">
                        <el-card shadow="hover" style="height:403px;max-width: 553px;">
                            <div slot="header" class="clearfix">
                                <span>实时入场记录</span>
                                <!--<el-button style="float: right; padding: 3px 0" type="text">添加</el-button>-->
                            </div>
                            <vue-seamless-scroll :data="returnDate" :class-option="classOption" style="height: 229px; overflow: hidden;">
                                <ul class="item">
                                    <li v-for="item in returnDate">
                                        <span class="title" style="height: 50px" v-text="item.parkName"></span>
                                        <span class="date" v-text="item.plate"></span>
                                        <span v-text="item.gatewayName"></span>
                                        <span >
                                            <template>
                                                {{ item.enterTime | formatDate }}
                                            </template>
                                        </span>
                                    </li>
                                </ul>
                            </vue-seamless-scroll>

                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Schart from 'vue-schart';
    import * as echarts from 'echarts';
    import {formatDate} from "../../utils/dateUtil";
    export default {
        name: 'realTime',
        data() {
            return {
                viewData: [],
                returnDate: [],
                options: {},
                numberOfParking: '',
                amountReceived: '',
                numberOfOrders:'',
                bloading : true,
                columnNumberValue: 0,
                option : {
                    title: {
                        text: '某站点用户访问来源',
                        subtext: '纯属虚构',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '50%',
                            data: [
                                {value: 1048, name: '搜索引擎'},
                                {value: 735, name: '直接访问'},
                                {value: 580, name: '邮件营销'},
                                {value: 484, name: '联盟广告'},
                                {value: 300, name: '视频广告'}
                            ],
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                },


            };
        },
        computed: {
            classOption () {
                return {
                    direction: 0
                }
            }
        },
        components: {
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                this.$addr.get("/statistics/real/time").then((res) => {
                        this.returnDate = res.data.data.records;
                        this.numberOfParking = res.data.data.numberOfParking;
                        this.amountReceived = res.data.data.amountReceived;
                        this.numberOfOrders = res.data.data.numberOfOrders;
                    }
                );
                this.chart();
            },
            chart() {
                var chartDom = document.getElementById('main');
                var myChart = echarts.init(chartDom);
                this.option && myChart.setOption(this.option);
            },

            changeDate() {
                const now = new Date().getTime();
                this.data.forEach((item, index) => {
                    const date = new Date(now - (6 - index) * 86400000);
                    item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
                });
            }
        },
        filters: {
            formatDate (time) {
                if (time === null) {
                    return null;
                }
                let date = new Date(time);
                return formatDate(time)
            }
        }
    };
</script>


<style scoped lang="scss">
    .seamless-warp {
        height: 229px;
        overflow: hidden;
    }

    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

    .schart {
        width: 100%;
        height: 300px;
    }


</style>
