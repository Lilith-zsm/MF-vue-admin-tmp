<template>
  <div class="common-wrap">
    <el-tabs v-model="tabName" class="con-tab">
      <el-tab-pane :label="$t('手机发短信')" name="sendPhone" />
      <el-tab-pane :label="$t('运单发短信')" name="sendWaybillNo" />
    </el-tabs>
    <keep-alive>
      <component :is="tabName" />
    </keep-alive>
  </div>
</template>
<script>
import sendPhone from './sendPhone'
import sendWaybillNo from './sendWaybillNo'
export default {
  name: 'SmsStatistics',
  components: {
    sendPhone,
    sendWaybillNo
  },
  data() {
    return {
      tabName: 'sendPhone'
    }
  }
}
</script>
