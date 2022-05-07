<!--
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-04-15 17:39:05
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-04-15 18:11:55
-->
<template>
  <m-table
    ref="commonTable"
    :data-source="dataSource"
    :loading="tableLoading"
    :page-vo="pageVo"
    :columns="columns"
    @handleSelectionChange="handleSelectionChange"
    @handlePageChange="handlePageChange"
  />
</template>
<script>
export default {
  data() {
    return {
      tableLoading: false,
      dataSource: [],
      pageVo: {
        total: 0,
        pageSize: 50,
        currentPage: 1
      },
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
      multipleSelection: [],
      searchForm: {
        createTimeBegin: []
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async getData() {
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
    handlePageChange(val) {
      const { currentPage, pageSize } = val
      this.pageVo.currentPage = currentPage
      this.pageVo.pageSize = pageSize
    }
  }
}
</script>
