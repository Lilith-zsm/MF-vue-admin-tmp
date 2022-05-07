<!--
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-03-11 17:17:57
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-04-22 13:40:43
-->
<template>
  <div class="common-wrap">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>上传图片（可裁剪）：</span>
          </div>
          <upload-img
            :fixed-number="[1,1]"
            output-type="jpg"
            :auto-crop-width="400"
            :auto-crop-height="400"
            :images="images"
            @handleUpload="handleUpload"
          />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>上传图片（可多张）：</span>
          </div>
          <upload-img
            multiple
          />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>上传excel(单个)：</span>
          </div>
          <upload-excel-button
            api-module="system.lang.import"
            @handleFinish="handleFinish"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import uploadImg from '@/components/uploadImg'
import uploadExcelButton from '@/components/uploadExcel'
export default {
  components: {
    uploadImg,
    uploadExcelButton
  },
  methods: {
    handleUpload(val) {

    },
    handleFinish() {

    }
  }
}
</script>
<style lang="scss" scoped>
.common-box {
  text-align: center;
}
</style>
