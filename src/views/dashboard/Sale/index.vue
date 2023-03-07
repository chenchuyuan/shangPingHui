<template>
  <div>
    <el-card style="margin: 10px 0px">
      <div slot="header" class="clearfix">
        <!--         @tab-click="handleClick"-->
        <!-- 头部左侧内容 -->
        <el-tabs v-model="activeName" class="tab">
          <el-tab-pane label="销售额" name="sale" />
          <el-tab-pane label="访问量" name="visit" />
        </el-tabs>
        <!-- 头部右侧内容 -->
        <div class="right">
          <span @click="setDay">今日</span>
          <span @click="setWeek">本周</span>
          <span @click="setMonth">本月</span>
          <span @click="setYear">本年</span>
          <el-date-picker
            v-model="data"
            type="datetimerange"
            range-separator="-"
            size="mini"
            class="data"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-DD"
          />
        </div>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="18">
            <div ref="charts" class="charts" />
          </el-col>
          <el-col :span="6">
            <h3>门店{{ title }}排名</h3>
            <ul>
              <li>
                <span class="rindex">1</span>
                <span>肯德基</span>
                <span class="rvalue">123456</span>
              </li>
              <li>
                <span class="rindex">2</span>
                <span>肯德基</span>
                <span class="rvalue">123456</span>
              </li>
              <li>
                <span class="rindex">3</span>
                <span>肯德基</span>
                <span class="rvalue">123456</span>
              </li>
              <li>
                <span class="rindex">4</span>
                <span>肯德基</span>
                <span class="rvalue">123456</span>
              </li>
              <li>
                <span class="rindex">5</span>
                <span>肯德基</span>
                <span class="rvalue">123456</span>
              </li>
              <li>
                <span class="rindex">6</span>
                <span>肯德基</span>
                <span class="rvalue">123456</span>
              </li>
              <li>
                <span class="rindex">7</span>
                <span>肯德基</span>
                <span class="rvalue">123456</span>
              </li>
            </ul>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import dayjs from 'dayjs'
export default {
  name: 'Index',
  data() {
    return {
      activeName: 'sale',
      myEcharts: null,
      data: []
    }
  },
  //  计算属性
  computed: {
    title() {
      return this.activeName === 'sale' ? '销售额' : '访问量'
    }
  //  监听属性，因为mounted只渲染一次，不能及时更行，所以需要监听相应属性进行重新渲染
  },
  // 监听属性
  watch: {
    title() {
      // 更改的配置项使用新的，没有更改的配置项会使用原来的
      this.myEcharts.setOption({
        title: {
          text: this.title + '趋势'
        }
      })
    }
  },
  mounted() {
    this.myEcharts = echarts.init(this.$refs.charts)
    this.myEcharts.setOption({
      title: {
        text: this.title + '趋势'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220, 400, 500, 241, 314, 645]
        }
      ]
    })
  },
  methods: {
    setDay() {
      const day = dayjs().format('YYYY-MM-DD')
      this.data = [day, day]
    },
    setWeek() {
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.data = [start, end]
    },
    setMonth() {
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.data = [start, end]
    },
    setYear() {
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.data = [start, end]
    }
  }
}
</script>

<style scoped>
.clearfix{
  position: relative;
  display: flex;
  justify-content: space-between;
}

.tab{
  width: 100%;
}

.right{
  position: absolute;
  right: 0px;
}
.right span{
  margin: 0px 10px;
}

.data{
  width: 250px;
  margin: 0px 20px;
}

.charts{
  width: 100%;
  height: 300px;
}

ul{
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0;
}

ul li{
  height: 8%;
  margin: 10px 0px;
}

.rindex{
  /* float能够解决在ul在inline时，li宽高无效*/
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: black;
  text-align: center;
  margin-right: 20px;
}

.rvalue{
  float: right;
}
</style>
