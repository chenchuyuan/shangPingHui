<template>
  <div>
    <div class="class-header">
      <span>{{ title }}</span>
      <i class="el-icon-info" />
    </div>
    <div class="class-content">{{ count }}</div>
    <div class="class-charts">
      <!-- 具名插槽 -->
      <slot name="charts" />
    </div>
    <div class="class-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  props: ['title', 'count']
}
</script>

<style scoped>
.class-header{
  display: flex;
  justify-content: space-between;
  color: #d9d9d9;
}
.class-content{
  font-size: 30px;
  padding:10px 0px;
}
.class-charts{
  height: 50px;
}
.class-footer{
  border-top: 1px solid #eee;
  padding-top: 10px;
}
</style>
