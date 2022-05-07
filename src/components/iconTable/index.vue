<!--
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2021-12-30 16:06:04
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-04-16 10:25:36
-->
<template>
  <div id="websiteContent">
    <base-dialog
      :title="$t('选择图标')"
      :visible.sync="dialogVisible"
      :is-minus-full="false"
      width="700px"
      center
    >
      <div class="box">
        <el-row :gutter="10">
          <el-col v-for="(item,index) in iconList" :key="index" :span="4">
            <div @click="onSubmit(item)">
              <svg-icon class="icon" :icon-class="item" />
            </div>
          </el-col>
        </el-row>
      </div>
    </base-dialog>
  </div>
</template>

<script>
import svgIcon from '@/components/svgIcon'
export default {
  name: 'IconTable',
  components: {
    svgIcon
  },
  props: {
    visible: {
      type: Boolean
    }
  },
  data() {
    return {
      // 表格值集
      dataSource: [],
      iconList: [
        'icon-houtairizhiguanli',
        'icon-03_04wangzhankehuzhuceshenpi',
        'icon-zuzhijigou',
        'icon-yonghushezhi1',
        'icon-soucha',
        'icon-shouye',
        'icon-yidongyunkongzhitaiicon45',
        'icon-yuyanshezhi',
        'icon-app',
        'icon-shezhi',
        'icon-caidanshezhi',
        'icon-jiaosequanxian1',
        'icon-jiaosequanxian',
        'icon-gonggongziliao',
        'icon-texiaolizi',
        'icon-duanxin',
        'icon-gonggao',
        'icon-jichuziliao',
        'icon-gaojingxinxi'
      ]
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  mounted() {
  },
  methods: {
    // 提交
    onSubmit(val) {
      this.$emit('submit', val)
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/    .el-dialog__body{
        padding: 0;
    }
/deep/  .el-dialog__header{
    margin-bottom: 0!important;
}
    .box{
        max-height:500px;
        overflow-y:auto;
        overflow-x:hidden;
        text-align:center;
    }
    .icon{
        font-size: 26px;
        padding: 20px 10px;
        display: block;
        cursor: pointer;
    }
    .icon:hover{
        color: #000;
        font-weight: bold;
    }
</style>
