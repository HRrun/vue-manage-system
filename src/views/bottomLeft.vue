<template>
  <div id="bottomLeft">
    <div class="bg-color-black">
      <div class="d-flex pt-2 pl-2">
        <span style="color:#5cd9e8">
          <icon name="chart-bar"></icon>
        </span>
        <div class="d-flex">
          <span class="fs-xl text mx-2">数据统计图</span>
        </div>
      </div>
      <div>
        <BottomLeftChart />
      </div>
    </div>
  </div>
</template>

<script>
import BottomLeftChart from "@/components/echart/bottom/bottomLeftChart";
export default {
  data() {
    return {};
  },
  components: {
    BottomLeftChart
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="scss">
#bottomLeft {
  padding-left: 10px;
  min-height: 100%;
  width: calc(100% - 10px);
  .bg-color-black {
    height: 100%;
  }
  .text {
    color: #c3cbde;
  }
  .chart-box {
    margin-top: 0.2rem;
    width: 2.125rem;
    height: 2.125rem;
    .active-ring-name {
      padding-top: 0.125rem;
    }
  }
}
</style>