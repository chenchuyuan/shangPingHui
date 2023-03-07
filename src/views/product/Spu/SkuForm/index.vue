<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="SPU名称">
        {{ spu.spuName }}
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="SKU名称" />
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input v-model="skuInfo.price" placeholder="价格(元)" type="number" />
      </el-form-item>
      <el-form-item label="重量(元)">
        <el-input v-model="skuInfo.weight" placeholder="重量(元)" />
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input v-model="skuInfo.skuDesc" placeholder="规格描述" type="textarea" rows="4" />
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form inline>
          <el-form-item v-for="(attrInfo,index) in attrInfoList" :key="attrInfo.id" :label="attrInfo.attrName">
            <el-select v-model="attrInfo.attrIdAndValueId" placeholder="请选择">
              <el-option v-for="(attrValue,index) in attrInfo.attrValueList" :key="attrValue.id" :label="attrValue.valueName" :value="`${attrInfo.id}:${attrValue.id}`" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form inline>
          <el-form-item v-for="(saleAttr, index) in spuSaleAttrList" :key="saleAttr.id" :label="saleAttr.saleAttrName">
            <el-select v-model="saleAttr.saleAttrAndValue" placeholder="请选择">
              <el-option v-for="(saleAttrValue,index) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id" :value="`${saleAttr.id}:${saleAttrValue.id}`" :label="saleAttrValue.saleAttrValueName" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table border :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="80" />
          <el-table-column label="图片">
            <template slot-scope="{row,$index}">
              <img :src="row.imgUrl" alt="" style="height: 100px; width:100px">
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName" />
          <el-table-column label="操作">
            <template slot-scope="{row,$index}">
              <el-button v-if="row.isDefault === 0" type="primary" @click="changeDefault(row)">设置默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      // 储存图片的信息
      spuImageList: [],
      // 储存销售属性
      spuSaleAttrList: [],
      // 储存平台属性的数据
      attrInfoList: [],
      skuInfo: {
        // 第一类数据：下面3组数据通过父（spu）获取
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 第二类数据：下列数据通过v-model双向绑定获取
        skuName: '',
        price: 0,
        weight: '',
        skuDesc: '',
        // 第三类：需要自己书写代码
        // 默认图片
        skuDefaultImg: '',
        // 收集图片的字段
        skuImageList: [],
        // 平台属性
        skuAttrValueList: [
          {
            attrId: 0,
            valueId: 0
          }
        ],
        // 销售属性
        skuSaleAttrValueList: []
      },
      spu: {},
      // 暂时储存图片信息
      imgList: []
    }
  },
  methods: {
    async initData(category1Id, category2Id, spu) {
      // 收集父组件提供的数据
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      this.spu = spu
      // 获取图片数据
      const res1 = await this.$Api.spu.reqSpuImageList(spu.id)
      if (res1.data.code === 200) {
        // 将获取的数据进行处理，添加isDefault属性
        const list = res1.data.data
        // 注意forEach能够改变原数组跟不能改变原数组的情况
        list.forEach(item => {
          item.isDefault = 0
        })
        this.spuImageList = list
      }
      // 获取销售属性的数据
      const res2 = await this.$Api.spu.reqSpuSaleAttrList(spu.id)
      if (res2.data.code === 200) {
        this.spuSaleAttrList = res2.data.data
      }
      // 获取平台属性的数据
      const res3 = await this.$Api.spu.reqAttrInfoList(category1Id, category2Id, spu.category3Id)
      if (res3.data.code === 200) {
        this.attrInfoList = res3.data.data
      }
    },
    // 表格勾选回调事件
    handleSelectionChange(obj) {
      this.imgList = obj
    },
    changeDefault(row) {
      // 排他操作
      this.spuImageList.forEach(item => {
        item.isDefault = 0
      })
      row.isDefault = 1
      // 收集默认图片信息
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    cancel() {
      this.$emit('changeScene', 0)
      // 清楚回显数据
      Object.assign(this._data, this.$options.data())
    },
    // 保存sku
    async save() {
      // 平台属性整理方式一：
      // const { attrInfoList, skuInfo } = this
      // 用来暂时储存数据
      // const arr = []
      // attrInfoList.forEach(item => {
      //   if (item.attrIdAndValueId) {
      //     const [attrId, ValueId] = item.attrIdAndValueId.split(':')
      //     arr.push({ attrId, ValueId })
      //   }
      // })
      // 将储存的数据放入到要提交的属性中
      // skuInfo.skuAttrValueList = arr
      // 方式二：
      const { attrInfoList, spuSaleAttrList, skuInfo } = this
      // 平台属性收集
      // reduce 方法适用于要累计、求最大值的场景s
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, ValueId] = item.attrIdAndValueId.split(':')
          prev.push({ attrId, ValueId })
        }
        // 注意将储存的数据 return
        return prev
      }, []) // [] 就是 prev的初始值
      // 销售属性收集
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(':')
          prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev
      }, [])
      console.log('imgList', this.imgList)
      // 图片属性收集(通过map创建映射来实现)
      skuInfo.skuImageList = this.imgList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          spuImgId: item.id,
          isDefault: item.isDefault
        }
      })
      // 发送数据
      const res = await this.$Api.spu.reqAddSku(skuInfo)
      console.log(res)
      if (res.data.code === 200) {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.$emit('changeScene', 0)
      }
    }
  }
}
</script>

<style scoped>

</style>
