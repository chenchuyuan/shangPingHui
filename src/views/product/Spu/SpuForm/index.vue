<template>
  <div>
    <el-form v-model="spu" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="SPU名称" />
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option
            v-for="tm in tradeMark"
            :key="tm.id"
            :label="tm.tmName"
            :value="tm.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input v-model="spu.description" type="textarea" rows="4" />
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="imageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="attrIdAndAttrName" :placeholder="`未选择属性还有${unSelectAttrList.length}个`">
          <el-option v-for="item in unSelectAttrList" :key="item.id" :label="item.name" :value="`${item.id}:${item.name}`" />
        </el-select>
        <el-button icon="el-icon-plus" type="primary" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column
            type="index"
            label="序号"
            width="80"
          />
          <el-table-column
            prop="saleAttrName"
            label="属性名"
          />
          <el-table-column
            prop="date"
            label="属性值名称列表"
          >
            <template slot-scope="{row}">
              <el-tag
                v-for="(item,index) in row.spuSaleAttrValueList"
                :key="item.id"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index,1)"
              >
                {{ item.saleAttrValueName }}
              </el-tag>
              <!--              @keyup.enter.native="handleInputConfirm"
                -->
              <el-input
                v-if="row.inputVisible"
                ref="saveTagInput"
                v-model="row.inputValue"
                class="input-new-tag"
                size="small"
                @blur="handleInputConfirm(row)"
              />
              <el-button v-else class="button-new-tag" size="small" @click="addAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="date"
            label="操作"
          >
            <template slot-scope="{row,$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      spu: {
        category3Id: 0,
        spuName: '',
        description: '',
        tmId: '',
        spuSaleAttrList: [
          // {
          //   id: 1,
          //   spuId: 1,
          //   baseSaleAttrId: 1,
          //   saleAttrName: '颜色',
          //   spuSaleAttrValueList: []
          // }
        ],
        spuImageList: []
      },
      // 照片未处理 url 和 name 的图片列表
      spuImageList: [],
      tradeMark: [], // 品牌
      imageList: [], // spu图片
      sale: [], // 销售信息
      inputValue: '', // 属性值名称列表的值
      attrIdAndAttrName: '' // 收集新选择的销售属性id
    }
  },
  computed: {
    unSelectAttrList() {
      return this.sale.filter(item => {
        return this.spu.spuSaleAttrList.every(item1 => {
          return item.name !== item1.saleAttrName
        })
      })
    }
  },
  methods: {
    handleRemove(file, fileList) {
      // file 是所删除文件的信息
      // fileList 是删除文件后剩余的文件信息
      // 照片的url和name还未处理
      this.spuImageList = fileList
    },
    // 照片预览的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 父组件调用的子组件方法
    async initData(spu) {
      // 获取spu信息
      const SpuResult = await this.$Api.spu.reqSpu(spu.id)
      if (SpuResult.data.code === 200) {
        this.spu = SpuResult.data.data
      }
      // 获取品牌信息
      const tradeMarkResult = await this.$Api.spu.reqTradeMarkList()
      this.tradeMark = tradeMarkResult.data.data
      // 获取spu图片
      const imageListResult = await this.$Api.spu.reqSpuImageList(spu.id)
      const listArray = imageListResult.data.data
      listArray.forEach(item => {
        item.url = item.imgUrl
        item.name = item.imgName
      })
      // 将整理好的数组赋值
      // 数组进行变更或者替换的时候，上方添加的属性是能够检测得到的
      this.imageList = listArray
      // 销售信息
      const saleResult = await this.$Api.spu.reqBaseSaleAttrList()
      this.sale = saleResult.data.data
    },
    // 处理图片上传成功的回调
    handleSuccess(response, file, fileList) {
      // fileList未图片上传成功后所有的图片列表
      this.spuImageList = fileList
    },
    // 添加销售属性的回调
    addSaleAttr() {
      const newArr = this.attrIdAndAttrName.split(':')
      const [baseSaleAttrId, saleAttrName] = newArr
      this.spu.spuSaleAttrList.push({ baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] })
      this.attrIdAndAttrName = ''
    },
    // 点击添加属性值回调
    addAttrValue(row) {
      this.$set(row, 'inputVisible', true)
      this.$set(row, 'inputValue', '')
    },
    // 销售属性值失焦时触发的回调
    handleInputConfirm(row) {
      const { inputVisible, inputValue } = row
      // 内容为空的时候不给上传内容
      if (inputValue.trim() === '') {
        this.$message('内容不能为空！')
        return // 终止
      }
      // 内容相同时不给上传
      const result = row.spuSaleAttrValueList.every(item => {
        return item.saleAttrValueName !== inputValue
      })
      if (!result) return
      console.log(result)
      const newArr = {
        inputVisible,
        saleAttrValueName: inputValue
      }
      row.spuSaleAttrValueList.push(newArr)
      row.inputVisible = false
    },
    // 保存或者更新spu
    saveOrUpdateSpu() {
      // 处理参数：将现有数组进行参数上的处理，然后添加到需要发送的数据里边
      // map方法会返回新数组
      const newArr = this.spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url
        }
      })
      this.spu.spuImageList = newArr
      this.$Api.spu.reqSaveOrUpdateSpu(this.spu)
      this.$emit('changeScene', { scene: 0, flag: this.spu.spuName ? '修改' : '新建' })
      // 清空数据
      Object.assign(this._data, this.$options.data())
    },
    // 新增内容时需初始化的数据
    async addInit(category3Id) {
      // 获取品牌信息
      const tradeMarkResult = await this.$Api.spu.reqTradeMarkList()
      this.tradeMark = tradeMarkResult.data.data
      // 销售信息
      const saleResult = await this.$Api.spu.reqBaseSaleAttrList()
      this.sale = saleResult.data.data
      // categoryId3赋值
      this.spu.category3Id = category3Id
    },
    // 取消操作
    cancel() {
      this.$emit('changeScene', { scene: 0, flag: this.spu.spuName ? '编辑' : '新建' })
      // 清楚数据
      // assign 方法能够合并对象
      // this._data可以操作data中的响应式数据
      // this.$options可以获取配置对象，配置对象的date函数执行，返回的响应式数据为空的
      Object.assign(this._data, this.$options.data())
    }

  }
}
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
