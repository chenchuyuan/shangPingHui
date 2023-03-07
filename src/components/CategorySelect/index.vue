<template>
  <div>
    <el-form :inline="true" :model="categoryForm" class="demo-form-inline">
      <el-form-item label="级联选择一">
        <el-select v-model="categoryForm.categoryOne" placeholder="请选择" :disabled="show" @change="handleOne">
          <el-option v-for="item in ListOne" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="级联选择二">
        <el-select v-model="categoryForm.categoryTwo" placeholder="请选择" @change="handleTwo" :disabled="show">
          <el-option v-for="item in ListTwo" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="级联选择三">
        <el-select v-model="categoryForm.categoryThree" placeholder="请选择" @change="handleThree" :disabled="show">
          <el-option v-for="item in ListThree" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: ['show'],
  data() {
    return {
      // 一级级联列表数据
      ListOne: [],
      // 二级级联列表数据
      ListTwo: [],
      // 三级级联列表数据
      ListThree: [],
      // 储存级联所选择的id
      categoryForm: {
        categoryOne: null,
        categoryTwo: null,
        categoryThree: null
      }
    }
  },
  mounted() {
    // 模板渲染后就调用该函数
    this.getCategoryOne()
  },
  methods: {
    // 获取一级级联数据
    async getCategoryOne() {
      const result = await this.$Api.attr.reqCategoryOne()
      if (result.data.code === 200) {
        this.ListOne = result.data.data
      }
    },
    // 获取一级级联回调
    async handleOne() {
      // 清空数据
      this.ListTwo = []
      this.ListThree = []
      this.categoryForm.categoryTwo = ''
      this.categoryForm.categoryThree = ''
      // 解构赋值
      const { categoryOne } = this.categoryForm
      // 参数为级联选择一的id  this.categoryForm.categoryOne
      const result = await this.$Api.attr.reqCategoryTwo(categoryOne)
      if (result.data.code) {
        this.ListTwo = result.data.data
      }
      // 将id传递给父组件
      this.$emit('getCategoryId', { categoryId: categoryOne, level: 1 })
    },
    // 获取二级级联回调
    async handleTwo() {
      // 清空数据
      this.ListThree = []
      this.categoryForm.categoryThree = ''
      // 解构赋值
      const { categoryTwo } = this.categoryForm
      const result = await this.$Api.attr.reqCategoryThree(categoryTwo)
      if (result.data.code) {
        this.ListThree = result.data.data
      }
      // 将id传递给父组件
      this.$emit('getCategoryId', { categoryId: categoryTwo, level: 2 })
    },
    handleThree() {
      // 解构赋值
      const { categoryThree } = this.categoryForm
      // 将id传递给父组件
      this.$emit('getCategoryId', { categoryId: categoryThree, level: 3 })
    }
  }
}
</script>
