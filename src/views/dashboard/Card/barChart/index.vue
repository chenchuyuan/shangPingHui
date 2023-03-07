<template>
  <div ref="charts" class="charts" style="width: 100%;height: 100%" />
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'Index',
  mounted() {
    // dom挂载完毕才初始化
    const lineChart = echarts.init(this.$refs.charts)
    lineChart.setOption({
      xAxis: {
        type: 'category',
        show: false
      },
      yAxis: {
        show: false
      },
      series: [
        {
          type: 'bar',
          data: [40, 20, 30, 50, 80, 55, 66, 49, 88],
          color: 'cyan'
        }
      ],
      // 布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      },
      tooltip: {}
    })
  }
}
</script>

<style scoped>

</style>
