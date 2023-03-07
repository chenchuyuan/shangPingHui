<template>
  <div>
    <el-card style="margin:20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"/>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button icon="el-icon-plus" type="primary" :disabled="!categoryId.three" @click="addAttr">添加属性</el-button>
        <!-- attr属性展示表格 -->
        <el-table border :data="attrInfoList">
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          />
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="180"
          />
          <el-table-column label="属性值列表">
            <template slot-scope="{row}">
              <el-tag v-for="(item,index) in row.attrValueList" :key="index" type="success" style="margin: 0 20px">
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="{row}">
              <el-button icon="el-icon-edit" type="warning" size="mini" @click="updateAttr(row)" />
              <el-button icon="el-icon-delete" type="danger" size="mini" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加attr属性 -->
      <div v-show="!isShowTable">
        <el-form v-model="attrInfoForm" :inline="true">
          <el-form-item label="属性名">
            <el-input v-model="attrInfoForm.attrName" placeholder="请输入属性名" />
          </el-form-item>
        </el-form>
        <el-button icon="el-icon-plus" type="primary" :disabled="!attrInfoForm.attrName" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
        <el-table border style="width: 100%; margin: 20px 0" :data="attrInfoForm.attrValueList">
          <el-table-column
            label="序号"
            type="index"
            width="80"
          />
          <el-table-column
            label="属性值名称"
            prop=""
          >
            <template slot-scope="{row,$index}">
              <el-input v-if="row.flag" :ref="$index" v-model="row.valueName" size="mini" @blur="toLook(row)" @keyup.native.enter="toLook(row)" />
              <span v-else style="display: block" @click="toEdit(row,$index)">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            prop=""
            width="180"
          >
            <template slot-scope="{row,$index}">
              <el-popconfirm
                :title="'是否删除 ' + row.valueName"
                @onConfirm="deleteAttrValueName($index)"
              >
                <el-button slot="reference" icon="el-icon-delete" size="mini" type="danger" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="saveOrEditAttrInfo" :disabled="attrInfoForm.attrValueList.length < 1">保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入深拷贝方法
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data() {
    return {
      categoryId: {
        one: '',
        two: '',
        three: ''
      },
      attrInfoList: [],
      isShowTable: true,
      // 添加|编辑属性
      attrInfoForm: {
        attrName: '', // 属性名
        attrValueList: [],
        categoryId: 0, // 第三级分类id，不能通过this.categoryId.three 拿到,因为对象存储数据是无序的，这时候categoryId.three不一定会有
        categoryLevel: 3
      }
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
        this.getAttrInfoList()
      }
    },
    // 获取attr属性接口
    async getAttrInfoList() {
      const { one, two, three } = this.categoryId
      const res = await this.$Api.attr.getAttrInfoList(one, two, three)
      if (res.data.code === 200) {
        this.attrInfoList = res.data.data
      }
    },
    // 添加属性值
    addAttrValue() {
      this.attrInfoForm.attrValueList.push({
        attrId: this.attrInfoForm.id, // 属性值对应的属性名id,点击编辑的时候attrInfoForm被赋值了，能够拿到id
        valueName: '', // 属性值
        flag: true // 用来控制显示或者编辑
      })
      // 自动聚焦,注意也需要添加nexTtick
      this.$nextTick(() => {
        this.$refs[this.attrInfoForm.attrValueList.length - 1].focus()
      })
    },
    // 添加属性解决回显问题
    addAttr() {
      this.isShowTable = false
      this.attrInfoForm = {
        attrName: '', // 属性名
        attrValueList: [],
        categoryId: this.categoryId.three, // 这里能够通过这种方式拿到，因为点击此按钮的时候 categoryId.three已存在
        categoryLevel: 3
      }
    },
    // 更新属性
    updateAttr(row) {
      this.isShowTable = false
      // 直接这样使用当点击取消的时候数据仍旧会被更改
      // this.attrInfoForm = row
      // 使用浅拷贝的时候，name的修改能够变回原来的，但是对象的修改仍旧会生效
      this.attrInfoForm = { ...row }
      // 因为有对象应该使用深拷贝
      this.attrInfoForm = cloneDeep(row)
      this.attrInfoForm.attrValueList.forEach(item => {
        console.log(item)
        // 使用这种方式能够添加上属性，但是视图无法进行切换，因为添加的属性不是响应式属性
        // 通过row.attrValueList.forEach添加好像会出现一样的情况
        // item.flag = true
        // 使用set方法能够设置响应式的数据，（对象，属性，属性值）
        this.$set(item, 'flag', false)
      })
    },
    // 查看属性状态
    toLook(row) {
      // 判断输入值是否为空
      if (row.valueName.trim() === '') {
        this.$message('输入值不能为空')
        // 中止
        return
      }
      // 判断是否存在相同值
      const isSame = this.attrInfoForm.attrValueList.some(item => {
        // 避免与自己进行判断,row为最新的属性值，也就是数组中的最后一项
        if (row !== item) {
          return row.valueName === item.valueName
        }
      })
      if (isSame === true) return
      row.flag = false
    },
    // 点击span的时候执行的回调
    toEdit(row, index) {
      row.flag = true
      // 获取dom节点实现自动聚焦
      // 浏览器进行重绘或者重排的时候是需要事件的，当点击的时候直接操作节点可能会出现节点还未存在的问题
      // 节点渲染完成之后执行一次
      this.$nextTick(() => {
        // 需要注意ref在input上，因为要获取的是input节点
        this.$refs[index].focus()
      })
    },
    // 删除气泡框点击确认弹出的回调
    deleteAttrValueName(index) {
      // 删除属性值
      this.attrInfoForm.attrValueList.splice(index, 1)
    },
    // 新增或者编辑数据
    async saveOrEditAttrInfo() {
      // 数据处理：去掉空的数据；把后端不需要的属性删除，例如flag
      // filter 方法会返回新数组
      this.attrInfoForm.attrValueList = this.attrInfoForm.attrValueList.filter(item => {
        // 去掉空的数据
        if (item.valueName !== '') {
          // 删除不需要的属性
          delete item['flag']
          return true
        }
      })
      // 处理成功和失败结果
      try {
        await this.$Api.attr.saveOrEditAttrInfo(this.attrInfoForm)
        this.$message('保存成功')
        // 获取页面最新数据
        await this.getAttrInfoList()
        // 页面跳转
        this.isShowTable = true
      } catch {
        console.log('保存失败')
      }
    }
  }
}
</script>

<style scoped>

</style>
