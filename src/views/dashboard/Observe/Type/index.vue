<template>
  <div>
    <el-card>
      <div slot="header" class="header">
        <span>销售额类别占比</span>
        <el-radio-group v-model="value">
          <el-radio-button label="全部渠道" />
          <el-radio-button label="线上" />
          <el-radio-button label="门店" />
        </el-radio-group>
      </div>
      <div class="echarts" style="width: 100%; height: 300px" />
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'Index',
  data() {
    return {
      value: '全部渠道'
    }
  },
  mounted() {
    const dom = document.querySelector('.echarts')
    const myEcharts = echarts.init(dom)
    myEcharts.setOption({
      title: {
        text: '视频',
        subtext: 1048,
        left: 'center',
        top: 'center'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'outside'
          },
          labelLine: {
            show: true
          },
          data: [
            { value: 1048, name: '视频' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' }
          ]
        }
      ]
    })
    myEcharts.on('mouseover', (e) => {
      const { name, value } = e.data
      myEcharts.setOption({
        title: {
          text: name,
          subtext: value
        }
      })
    })
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}
</style>
