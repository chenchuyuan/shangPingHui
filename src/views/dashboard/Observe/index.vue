<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12">
        <Search />
      </el-col>
      <el-col :span="12">
        <Type />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Search from './Search'
import Type from './Type'
export default {
  name: 'Index',
  components: {
    Search,
    Type
  }
}
</script>

<style scoped>

</style>
