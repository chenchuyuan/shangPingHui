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
        show: false,
        //  设置最大值最小值
        min: 0,
        max: 100
      },
      yAxis: {
        show: false,
        // y 轴上均分，这样柱状图是水平的
        type: 'category'
      },
      series: [
        {
          type: 'bar',
          data: [78],
          color: 'yellowgreen',
          //  柱状图宽度
          barWidth: 10,
          //  背景
          showBackground: true,
          // 柱状图背景颜色
          backgroundStyle: {
            color: '#eee'
          },
          //  文本标签
          label: {
            show: true,
            // 文本标签内容
            formatter: '|',
            // 文本标签位置
            position: 'right'
          }
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
