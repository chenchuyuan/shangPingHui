<template>
  <div>
    <el-row :gutter="20">
      <!--第一个区域-->
      <el-col :span="6">
        <el-card>
          <Detail title="总销售" count="￥ 126560">
            <template slot="charts">
              <span>周同比 56.67%</span><i class="el-icon-top" style="color: red" />
              &nbsp;
              <span>日同比 19.16%</span><i class="el-icon-bottom" style="color: green" />
            </template>
            <template slot="footer">
              <span>日销售额￥ 12423</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <!--第二个区域-->
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" count="88460">
            <template slot="charts">
              <LineChart />
            </template>
            <template slot="footer">
              <span>日访问量 1234</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <!--第三个区域-->
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" count="88460">
            <template slot="charts">
              <Barchart />
            </template>
            <template slot="footer">
              <span>转化率 64%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <!--第四个区域-->
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" count="78%">
            <template slot="charts">
              <ProgressChart />
            </template>
            <template slot="footer">
              <span>周同比 56.67%</span><i class="el-icon-top" style="color: red" />
              &nbsp;
              <span>日同比 19.16%</span><i class="el-icon-bottom" style="color: green" />
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from './Detail/index'
import LineChart from './lineChart'
import Barchart from './barChart'
import ProgressChart from './progressChart'
export default {
  name: 'Index',
  components: {
    Detail,
    LineChart,
    Barchart,
    ProgressChart
  }
}
</script>

<style scoped>

</style>
