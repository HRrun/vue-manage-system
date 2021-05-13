<template>
    <div id="content-in" class="content-in">
      <div class="content-in-title">停车数据概览</div>
      <div class="row-in">
        <div class="row-item-in" style="width: 28.6%;">
          <centerLeft1 />
        </div>
        <div class="row-item-in" style="width: calc(42.8% - 5px); padding-left: 5px;">
          <center />
        </div>
        <div class="row-item-in" style="width: 28.6%;">
          <centerRight1 />
        </div>
      </div>
      <div class="row-in">
        <div class="row-item-in" style="width: 100%; height: auto; ">
          <bottomLeft />
        </div>
      </div>
      <div class="row-in" >
        <div class="row-item-in" style="width: 100%; height: auto; ">
          <bottomRight />
        </div>
      </div>

    </div>
</template>

<script>
    import { formatTime } from '../utils/index.js'
    import centerLeft1 from "./centerLeft1";
    import centerRight1 from "./centerRight1";
    import centerRight2 from "./centerRight2";
    import center from "./center";
    import bottomLeft from "./bottomLeft";
    import bottomRight from "./bottomRight";
    export default {
        data () {
            return {
                loading: true,
                dateDay: null,
                dateYear: null,
                dateWeek: null,
                weekday: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
            };
        },
        components: {
            centerLeft1,
            centerRight1,
            centerRight2,
            center,
            bottomLeft,
            bottomRight
        },
        mounted () {
            this.timeFn();
            this.cancelLoading();
        },
        methods: {
            timeFn () {
                setInterval(() => {
                    this.dateDay = formatTime(new Date(), 'HH: mm: ss');
                    this.dateYear = formatTime(new Date(), 'yyyy-MM-dd');
                    this.dateWeek = this.weekday[new Date().getDay()];
                }, 1000)
            },
            cancelLoading () {
                setTimeout(() => {
                    this.loading = false;
                }, 500);
            }
        }
    };
</script>

<style lang="scss">
    @import '../assets/scss/index.scss';

    .content-in {
      width: 100%;
      height: auto;
    }
    .content-in .content-in-title {
      background: url("../assets/title-bg.png") no-repeat center;
      background-size: cover;
      width: calc(100% - 20px);
      margin: auto;
      height: 70px;
      text-align: center;
      line-height: 70px;
      color: #ffffff;
      font-size: 32px;
      font-weight: 500;
      font-family: 微软雅黑,'microsoft yahei',宋体,新宋体,sans-serif;
    }
    .content-in .row-in {
      width: 100%;
      min-height: 410px;
      margin-bottom: 10px;
    }
    .content-in .row-in .row-item-in {
      height: 370px;
      float: left;
    }
</style>