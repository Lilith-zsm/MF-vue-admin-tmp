
<template>
  <div class="container">
    <iframe :src="file" frameborder="0" style="width: 100%; height: 100%;" />
  </div>
</template>

<script>
export default {
  name: 'PrintTemplatePreview',
  components: {
  },
  data() {
    return {
      file: ''
    }
  },
  watch: {
    $route: {
      deep: true,
      handler(val, oldval) {
        this.getInfo()
      }
    }
  },
  mounted() {
    if (this.$route.query.code) {
      this.getInfo()
    }
  },
  methods: {
    async getInfo() {
      if (!this.$route.query.code) {
        return
      }
      const res = await this.$api.common.sysSetting.printTemplate.preview(this.$route.query.code)
      this.file = this.getObjectURL(res.data)
    },
    // 将返回的流数据转换为url
    getObjectURL(file) {
      let url = null
      if (window.createObjectURL !== undefined) { // basic
        url = window.createObjectURL(file)
      } else if (window.webkitURL !== undefined) { // webkit or chrome
        try {
          url = window.webkitURL.createObjectURL(file)
        } catch (error) {
          this.$message.warning(this.$i18n.tc('预览失败'))
        }
      } else if (window.URL !== undefined) { // mozilla(firefox)
        try {
          url = window.URL.createObjectURL(file)
        } catch (error) {
          this.$message.warning(this.$i18n.tc('预览失败'))
        }
      }
      return url
    }
  }
}
</script>

<style  lang="scss" scoped>
.container{
  height: calc(100vh - 75px);
}
</style>
