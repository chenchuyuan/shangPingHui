<template>
  <div>
    <el-card style="margin: 20px 0">
      <!-- 使用封装好的三级联动组件 -->
      <CategorySelect :show="scene !== 0" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <div v-show="scene === 0">
        <el-button type="primary" icon="el-icon-plus" :disabled="!categoryId.three" @click="addSpu(categoryId.three)">添加SPU</el-button>
        <el-table style="width: 100%" border :data="spuListInfo">
          <el-table-column label="序号" type="index" width="80" />
          <el-table-column label="spu名称" prop="spuName" />
          <el-table-column label="spu描述" prop="description" />
          <el-table-column label="操作">
            <template slot-scope="{row}">
              <hint-button icon="el-icon-plus" type="success" size="mini" title="添加sku" @click="addSku(row)" />
              <hint-button icon="el-icon-edit " type="warning" size="mini" title="修改spu" @click="updateSpu(row)" />
              <hint-button icon="el-icon-info" type="info" size="mini" title="查看spu" @click="handle(row)" />
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <hint-button slot="reference" icon="el-icon-delete" type="danger" size="mini" title="删除spu" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="getSpuInfoList"
        />
      </div>
      <SpuForm v-show="scene === 1" ref="spu" @changeScene="changeScene" />
      <SkuForm v-show="scene === 2" ref="sku" @changeScene="changeSkuScene" />
    </el-card>
    <!--  查看弹出框  -->
    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <!--      接口code201错误    -->
      <el-table v-loading="loading" :data="[]">
        <el-table-column property="date" label="名称" width="150" />
        <el-table-column property="name" label="价值" width="200" />
        <el-table-column property="address" label="重量" />
        <el-table-column property="address" label="默认图片" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
  name: 'Spu',
  components: {
    SpuForm,
    SkuForm
  },
  data() {
    return {
      show: true,
      categoryId: {
        one: '',
        two: '',
        three: ''
      },
      page: 1,
      limit: 3,
      total: 1,
      spuListInfo: [],
      // 控制下方卡片显示的内容
      scene: 0,
      dialogTableVisible: false,
      spu: [],
      loading: true
    }
  },
  methods: {
    // 通过自定义事件回调获取子组件种类id
    getCategoryId({ categoryId, level }) {
      if (level === 1) {
        // 清空由子组件已传的id
        this.categoryId.two = ''
        this.categoryId.three = ''
        this.categoryId.one = categoryId
      } else if (level === 2) {
        // 清空由子组件已传的id
        this.categoryId.three = ''
        this.categoryId.two = categoryId
      } else {
        this.categoryId.three = categoryId
        // 这里所有id都已获取，调用接口
        this.getSpuInfoList()
      }
    },
    // 获取参数数据
    async getSpuInfoList(pages = 1) {
      // 注意pages的名称不能为page，因为page这个命名在下方已经使用了
      this.page = pages
      const { page, limit, categoryId: { three }} = this
      const { data: { data }} = await this.$Api.spu.reqSpuList(page, limit, three)
      this.spuListInfo = data.records
      this.total = data.total
    },
    // 页面展示数更改执行的回调
    handleSizeChange(limit) {
      this.limit = limit
      this.getSpuInfoList()
    },
    addSpu(category3Id) {
      this.scene = 1
      // 调用子组件的初始化接口
      this.$refs.spu.addInit(category3Id)
    },
    updateSpu(spu) {
      this.scene = 1
      // 点击父组件按钮的时候调用子组件的属性和方法
      this.$refs.spu.initData(spu)
    },
    changeScene({ scene, flag }) {
      this.scene = scene
      // flag 用来控制重新获取数据的时候是需要跳转到第一页还是当前页
      // 重新获取数据
      if (flag === '新建') {
        this.getSpuInfoList(1)
      } else {
        this.getSpuInfoList(this.page)
      }
    },
    // 删除spu
    async deleteSpu(row) {
      const res = await this.$Api.spu.reqDeleteSpu(row.id)
      console.log(res)
      if (res.data.code === 200) {
        this.$message({ type: 'success', message: '删除成功' })
        // 重新获取数据
        await this.getSpuInfoList(this.spuListInfo.length > 1 ? this.page : this.page - 1)
      }
    },
    // 添加sku
    addSku(row) {
      this.$refs.sku.initData(this.categoryId.one, this.categoryId.two, row)
      this.scene = 2
    },
    // 更改场景
    changeSkuScene(e) {
      this.scene = e
    },
    async handle(spu) {
      this.dialogTableVisible = true
      this.spu = spu
      // 获取sku列表
      const res = await this.$Api.spu.reqSkuList(spu.id) // status为200 code为201
      if (res.data.code === 201) {
        this.loading = false
      }
    },
    close(done) {
      // 解决loading效果只出现一次
      this.loading = true
      // 解决快速点击不同spu时出现的回显问题
      this.skuList = []
      done()
    }
  }
}
</script>

<style scoped>
</style>
