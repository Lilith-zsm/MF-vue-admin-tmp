<template>
  <div class="common-wrap">
    <condition-form
      ref="conditionForm"
      v-model="searchForm"
      :form-data="formData"
      @handleSearch="handleSearch"
    />
    <div class="common-box">
      <m-table
        ref="commonTable"
        :data-source="dataSource"
        :loading="tableLoading"
        :page-vo="pageVo"
        :columns="columns"
        @handleSelectionChange="handleSelectionChange"
        @handlePageChange="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SystemLogManageLoginLog',
  components: {},
  data() {
    return {
      searchForm: {},
      multipleSelection: [],
      // 查询字段设置
      formData: [
        {
          label: '操作ip',
          type: 'label_input',
          placeholder: '请输入',
          prop: 'remoteAddr'
        },
        {
          prop: 'createTimeBegin',
          type: 'label_date_picker',
          dateType: 'datetimerange',
          label: '创建时间',
          placeholder: '请输入',
          xl: 8,
          sm: 12
        }
      ],
      // 表格初始化
      pageVo: {
        total: 0,
        pageSize: 50,
        currentPage: 1
      },
      // 表格参数配置
      tableLoading: false,
      // 表格展示的列
      columns: [
        {
          title: '序号',
          type: 'seq',
          width: 60,
          fixed: 'left'
        },
        {
          field: 'title',
          title: '日志标题'
        },
        {
          field: 'createBy',
          title: '创建人'
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: '150px',
          formatter: ({ cellValue }) => {
            return this.$Utils.formatterTimeZones(cellValue)
          }
        },
        {
          field: 'updateTime',
          title: '更新时间',
          width: '150px',
          formatter: ({ cellValue }) => {
            return this.$Utils.formatterTimeZones(cellValue)
          }
        },
        {
          field: 'remoteAddr',
          title: '操作ip'
        },
        {
          field: 'userAgent',
          title: '用户代理'
        },
        {
          field: 'requestUri',
          title: '请求uri'
        },
        {
          field: 'method',
          title: '操作方式'
        },
        {
          field: 'exception',
          title: '异常信息'
        }
      ],
      // 表格值集
      dataSource: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 获取数据
    async getData() {
      if (!this.$Utils.hasPermi(['system:loginLog:query'])) {
        this.message.warning('您没有查看列表的权限！')
        return
      }
      this.tableLoading = true
      const params = {
        ...this.searchForm,
        pageNum: this.pageVo.currentPage,
        pageSize: this.pageVo.pageSize
      }
      if (this.searchForm.createTimeBegin) {
        [
          params.createTimeBegin,
          params.createTimeEnd] =
        this.searchForm.createTimeBegin
      }
      try {
        const { rows, total } = await this.$api.system.log.loginList(params)
        this.tableLoading = false
        this.dataSource = rows
        this.pageVo.total = total
      } catch {
        this.tableLoading = false
      }
    },
    // 查询按钮
    handleSearch() {
      this.getData()
    },
    // 分页
    handlePageChange(val) {
      const { currentPage, pageSize } = val
      this.pageVo.currentPage = currentPage
      this.pageVo.pageSize = pageSize
      this.getData()
    },
    handleSelectionChange(val) {
      console.log(val)
    }
  }
}
</script>

<style lang="scss" scoped>
.main-box {
  background: #fff;
}
</style>
