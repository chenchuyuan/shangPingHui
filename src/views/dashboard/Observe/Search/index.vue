<template>
  <div>
    <el-card>
      <div slot="header" class="header">
        <div class="search-header">
          <span>线上热门搜索</span>
          <el-dropdown>
            <span>
              <i class="el-icon-more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>狮子头</el-dropdown-item>
              <el-dropdown-item>螺蛳粉</el-dropdown-item>
              <el-dropdown-item>双皮奶</el-dropdown-item>
              <el-dropdown-item>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="12">
            <LineCharts />
          </el-col>
          <el-col :span="12">
            <LineCharts />
          </el-col>
        </el-row>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%;margin: 10px 0px"
        border
      >
        <el-table-column
          label="序号"
          type="index"
          width="80"
        />
        <el-table-column
          label="搜索关键字"
        />
        <el-table-column
          label="用户数"
          sortable
          width="180"
        />
        <el-table-column
          label="周涨幅"
          sortable
          width="180"
        />
      </el-table>
      <el-pagination
        class="pagination"
        layout="prev, pager, next"
        :total="50">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import LineCharts from './lineCharts'
export default {
  name: 'Index',
  components: {
    LineCharts
  },
  data() {
    return {
      tableData: [{}]
    }
  }
}
</script>

<style scoped>
.search-header{
  display: flex;
  justify-content: space-between;
}
.header{
  border-bottom: 1px solid #eee;
  padding: 5px 0px;
}

.pagination{
  float: right;
  margin: 10px 0;
}
</style>
