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
          type: 'line',
          data: [40, 20, 30, 50, 80, 55, 66, 49, 88],
          // 拐点样式设置
          itemStyle: {
            opacity: 0
          },
          //  线条的样式
          lineStyle: {
            color: 'purple'
          },
          // 填充的颜色设置
          areaStyle: {
            color: 'purple'
          }
        }
      ],
      // 布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }
    })
  }
}
</script>

<style scoped>

</style>
