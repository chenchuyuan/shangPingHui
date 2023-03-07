<template>
  <div>
    <div class="header">
      <span class="header-title">搜索用户数</span>
      <i class="el-icon-info" />
    </div>
    <div class="main">
      <span class="main-first">12321</span>
      <span>17.1</span><i class="el-icon-top" style="color: red" />
    </div>
    <div class="footer">
      <div ref="charts" class="charts" style="width: 100%;height: 50px" />
    </div>
  </div>
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
.header{
  /* 垂直居中 */
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  margin-left: 10px;
}

.header-title{
  margin-right: 10px;
}

.main-first{
  margin-right: 20px;
  font-size: 20px;
  margin-left: 10px;
}
</style>
