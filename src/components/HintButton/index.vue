<template>
  <a style="margin: 10px" :title="title">
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </a>
</template>

<script>
export default {
  name: 'HintButton',
  // 上方左边的title是属性，右边的title是下方的title，下方的title是组件传进来的参数
  props: ['title']
}
</script>

<style scoped>

</style>
