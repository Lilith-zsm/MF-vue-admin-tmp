
<template>
  <div class="common-wrap">
    <el-tabs v-model="tabName" class="con-tab">
      <el-tab-pane :label="$t('汇总查询')" name="sum" />
      <el-tab-pane :label="$t('明细查询')" name="detail" />
    </el-tabs>
    <keep-alive>
      <component :is="tabName" />
    </keep-alive>
  </div>
</template>
<script>
import sum from './sum'
import detail from './detail'
export default {
  name: 'SmsStatistics',
  components: {
    sum,
    detail
  },
  data() {
    return {
      tabName: 'sum'
    }
  }
}
</script>
