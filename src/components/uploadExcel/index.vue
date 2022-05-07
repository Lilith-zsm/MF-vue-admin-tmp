<template>
  <div class="uploadExcel">
    <el-upload
      ref="upload"
      class="upload"
      action=""
      :show-file-list="false"
      :http-request="handleImport"
    >
      <el-button type="success" icon="el-icon-upload2">{{ $t('导入') }}</el-button>
    </el-upload>
    <base-dialog title="导入文件" width="300px" :visible.sync="innerVisible" @close="handleClose">
      <div class="process-div">
        <svg-icon icon-class="icon-wenjian-" style="font-size: 100px; color:#b6b5b8; margin-bottom: 20px;" />
        <p>{{ fileName }}</p>
        <el-progress :text-inside="true" :stroke-width="24" :percentage="percentage" :status="processStatus" :format="formatProcessText" />
      </div>
      <div class="icon-div">
        <svg-icon v-show="status === '1'" icon-class="icon-schedule" class="status-icon" />
        <i v-show="status === '2'" class="el-icon-success status-icon" />
        <i v-show="status === '3'" class="el-icon-warning status-icon" />
        <div v-if="status !== '1'" style="float: right">
          <el-button :icon="status === '3' ? 'el-icon-refresh-right' : 'el-icon-upload2'" :title="status === '3' ? $t('重新上传') : $t('继续上传')" @click="handleSelectFile" />
          <el-button icon="el-icon-close" :title="$t('关闭并刷新')" @click="handleCloseUpload" />
        </div>
      </div>
    </base-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  props: {
    apiModule: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      percentage: 0,
      innerVisible: false,
      fileName: '',
      status: '2' // 1. 导入中  2. 导入成功  3. 导入失败
    }
  },
  computed: {
    processStatus() {
      const obj = {
        '1': null,
        '2': 'success',
        '3': 'exception'
      }
      return obj[this.status]
    }
  },
  methods: {
    formatProcessText(percentage) {
      return this.status === '3' ? this.$i18n.tc('上传失败') : `${percentage}%`
    },
    async handleImport(data) {
      this.innerVisible = true
      this.fileName = data.file.name
      const formData = new FormData()
      formData.append('file ', data.file)
      const apiArr = this.apiModule.split('.')
      let apiFn = this.$api
      apiArr.forEach(i => {
        apiFn = apiFn[i]
      })
      try {
        this.status = '1'
        await apiFn(formData, (e) => {
          if (e.lengthComputable) {
            this.percentage = _.floor((e.loaded / e.total) * 100)
          }
        })
        this.message.success(this.$i18n.tc('导入成功'))
        this.status = '2'
      } catch {
        this.status = '3'
      }
    },
    handleClose() {
      this.percentage = 0
      this.fileName = ''
    },
    handleCloseUpload() {
      this.innerVisible = false
      this.$emit('handleFinish')
    },
    handleSelectFile() {
      this.$refs["upload"].$refs["upload-inner"].handleClick()
    }
  }
}
</script>
<style lang="scss" scoped>
.uploadExcel {
  display: inline-block;
  margin: 0 10px;
  .process-div {
    text-align: center;
    padding: 20px 0 5px;
  }
  .status-icon {
    line-height: 28px;
    &.el-icon-success {
      color: green
    }
    &.el-icon-warning {
      color: red
    }
  }
}
</style>
