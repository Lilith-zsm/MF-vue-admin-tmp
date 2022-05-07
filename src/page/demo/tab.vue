<template>
  <div class="container">
    <div>
      <el-tabs v-model="activeName" class="conTab">
        <el-tab-pane label="网点汇总" name="siteList" />
        <el-tab-pane label="客户汇总" name="cusList" />
        <el-tab-pane label="明细" name="detailList" />
      </el-tabs>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Tab',
  components: {
  },
  data() {
    return {
      activeName: 'siteList'
    }
  }
}
</script>
<style lang="scss" scoped>
.receiptManagement-container {
  padding-top: 0;
}
</style>
