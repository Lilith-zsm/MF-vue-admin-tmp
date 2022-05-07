<template>
  <div class="common-wrap">
    <div class="common-box">
      <!-- 按钮 -->
      <div class="con-button-rows">
        <el-button type="success" :loading="addLoading" @click="add"><i class="el-icon-add" /> {{ $t('全部添加') }} </el-button>
      </div>
      <!-- 表格 -->
      <m-table
        ref="comTable"
        :data-source="dataSource"
        :columns="tableColumns"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SystemLackLang',
  components: {},
  data() {
    return {
      // 表格值集
      dataSource: [],
      // 表格初始化
      pageVo: {
        total: 0, // 总条目数
        pageSize: 50, // 页数
        currentPage: 1 // 页码
      },
      // 表格展示的列
      tableColumns: [
        {
          title: '序号',
          type: 'seq',
          width: 60,
          fixed: 'left'
        },
        {
          field: 'strid',
          title: '未维护字段',
          align: 'left'
        }
      ],
      addLoading: false
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    // 获取数据
    async getData() {
      var filter_params = []
      const lackList = this.$store.getters.lackLang
      lackList.forEach((it) => {
        const obj = `${it}`.match(/[\u4e00-\u9fa5]/g)
        if (obj && obj.length) {
          // 包含中文
          filter_params.push({ strid: it })
        }
      })
      this.dataSource = filter_params
      this.pageVo.total = filter_params.length
    },
    // 全部添加
    async add() {
      this.addLoading = true
      try {
        await this.$api.system.lang.addMore(this.dataSource)
        this.$store.commit('SET_LACKLANG', [])
        this.message.success(this.$i18n.tc('添加成功'))
        this.addLoading = false
      } catch {
        this.addLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
