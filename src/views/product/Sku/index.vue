<template>
  <div>
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="skuName" label="名称" width="width" />
      <el-table-column prop="skuDesc" label="描述" width="width" />
      <el-table-column prop="date" label="默认图片" width="110">
        <template slot-scope="{row,$index}">
          <img :src="row.skuDefaultImg" alt="1" style="width: 80px;height: 80px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80" />
      <el-table-column prop="price" label="价格" width="80" />
      <el-table-column prop="date" label="操作" width="width">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.isSale === 0" type="success" icon="el-icon-sort-down" size="mini" @click="cancel(row)" />
          <el-button v-else type="success" icon="el-icon-sort-up" size="mini" @click="sale(row)" />
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit" />
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)" />
          <el-button type="danger" icon="el-icon-delete" size="mini" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      style="text-align: center"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="getSkuList"
      @size-change="sizeChange"
    />
    <!-- 抽屉 -->
    <el-drawer
      :visible.sync="show"
      :show-close="false"
      size="50%"
    >
      <!--     elementUI布局 -->
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ SkuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ SkuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ SkuInfo.weight }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag v-for="(attr,index) in SkuInfo.skuAttrValueList" :key="attr.id" style="margin-right: 10px">{{ attr.id }}---{{ attr.valueId }}</el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="150px">
            <el-carousel-item v-for="item in SkuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" alt="">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      page: 1,
      limit: 20,
      total: 0,
      tableData: [],
      SkuInfo: {},
      // 控制抽屉的显示
      show: false
    }
  },
  mounted() {
    this.getSkuList()
  },
  methods: {
    async getSkuList(pages = 1) {
      this.page = pages
      const { page, limit } = this
      const res = await this.$Api.sku.reqSkuList(page, limit)
      if (res.data.code === 200) {
        this.total = res.data.data.total
        this.tableData = res.data.data.records
      }
    },
    sizeChange(limit) {
      this.limit = limit
      this.getSkuList()
    },
    // 上架
    async sale(row) {
      // 声明变量用于解决竞态条件
      const nowRow = row
      const res = await this.$Api.sku.onSale(nowRow.id)
      if (res.data.code === 200) {
        this.$message({
          type: 'success',
          message: '上架成功'
        })
        nowRow.isSale = 0
      }
    },
    // 下架
    async cancel(row) {
      // 声明变量用于解决竞态条件
      const nowRow = row
      const res = await this.$Api.sku.cancelSale(nowRow.id)
      if (res.data.code === 200) {
        this.$message({
          type: 'success',
          message: '下架成功'
        })
        nowRow.isSale = 1
      }
    },
    edit() {
      this.$message('正在开发中...')
    },
    async getSkuInfo(row) {
      const res = await this.$Api.sku.reqSkuById(row.id)
      console.log(res)
      this.SkuInfo = res.data.data
      this.show = true
    }
  }
}
</script>
<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}


</style>

<style scoped>
.el-row .el-col-5{
  text-align: right;
  font-size: 18px;
}
.el-row .el-col{
  margin: 10px 10px;
}

/* 轮播图下方按钮样式 */
/deep/.el-carousel__button {
  height: 15px;
  width: 15px;
  background: red;
  border-radius: 50%;
}
</style>
