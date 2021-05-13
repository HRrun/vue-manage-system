<template>
  <div id="center">
    <div class="up">
      <div class="bg-color-black item" v-for="item in titleItem" :key="item.title">
        <p class="ml-3 colorBlue fw-b" >{{item.title}}</p>
        <div>
          <dv-digital-flop :config="item.number" style="width:1.25rem;height:.625rem;" />
        </div>
      </div>
    </div>
    <div class="down">
      <div class="ranking bg-color-black">
        <span style="color:#5cd9e8">
          <icon name="align-left"></icon>
        </span>
        <span class="fs-xl text mx-2 mb-1" style="color: #ffffff;">车辆入场记录</span>
        <dv-scroll-ranking-board :config="ranking" />
      </div>
      <!--<div class="percent" style="height: 100%;">
        <div class="item bg-color-black">
          <span style="color: #ffffff;">今日任务通过率</span>
          <CenterChart :id="rate[0].id" :tips="rate[0].tips" :colorObj="rate[0].colorData" />
        </div>
        <div class="item bg-color-black">
          <span style="color: #ffffff;">今日任务达标率</span>
          <CenterChart :id="rate[1].id" :tips="rate[1].tips" :colorObj="rate[1].colorData" />
        </div>
      </div>-->
    </div>
  </div>
</template>

<script>
import CenterChart from "@/components/echart/center/centerChartRate";

export default {
  data () {
    return {
      titleItem: [],
      ranking: {
        data: [
          {
            name: "周口",
            value: 55
          },
          {
            name: "南阳",
            value: 120
          },
          {
            name: "西峡",
            value: 78
          },
          {
            name: "驻马店",
            value: 66
          },
          {
            name: "新乡",
            value: 80
          },
          {
            name: "新乡2",
            value: 80
          },
          {
            name: "新乡3",
            value: 80
          },
          {
            name: "新乡4",
            value: 80
          },
          {
            name: "新乡5",
            value: 80
          },
          {
            name: "新乡6",
            value: 80
          },
        ],
        carousel: "single",
        unit: "人"
      },
      water: {
        data: [24, 45],
        shape: "roundRect",
        formatter: "{value}%",
        waveNum: 3
      },
      // 通过率和达标率的组件复用数据
      rate: [
        {
          id: "centerRate1",
          tips: 60,
          colorData: {
            textStyle: "#3fc0fb",
            series: {
              color: ["#00bcd44a", "transparent"],
              dataColor: {
                normal: "#03a9f4",
                shadowColor: "#97e2f5"
              }
            }
          }
        },
        {
          id: "centerRate2",
          tips: 40,
          colorData: {
            textStyle: "#67e0e3",
            series: {
              color: ["#faf3a378", "transparent"],
              dataColor: {
                normal: "#ff9800",
                shadowColor: "#fcebad"
              }
            }
          }
        }
      ]
    };
  },
  components: {
    CenterChart
    // centerChart1,
    // centerChart2
  },
  created() {
    this.getData();
  },
  methods : {
    getData(){
      this.$addr.get("/statistics/home/page/statistics").then((res) => {
                this.tableData = res.data.data;
                this.titleItem = res.data.data.titleItem;
              }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
#center {
  display: flex;
  flex-direction: column;
  margin-top: 5px;
  .up {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    .item {
      padding-top: 10px;
      margin-top: 5px;
      width: 32%;
      height: 70px;
    }
  }
  .down {
    padding: 5px;
    padding-bottom: 0;
    width: 100%;
    height: 255px;
    display: flex;
    justify-content: space-between;
    .ranking {
      padding: 0.125rem;
      width: 100%;
    }
    .percent {
      width: 40%;
      display: flex;
      flex-wrap: wrap;
      .item {
        width: calc(50% - 5px);
        height: 250px;
        margin-left: 5px;
        span {
          margin-top: 15px;
          display: flex;
          justify-content: center;
        }
      }
      .water {
        width: 100%;
        height: 115px;
        margin-top: 5px;
      }
    }
  }
}
</style>