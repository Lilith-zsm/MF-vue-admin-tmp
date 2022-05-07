<!--
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-04-15 17:39:05
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-04-15 17:50:02
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
          type: 'checkbox',
          width: 50,
          fixed: 'left'
        },
        {
          title: '序号',
          type: 'seq',
          width: 60,
          fixed: 'left'
        },
        {
          field: 'tenantId',
          title: 'SASS ID'
        },
        {
          field: 'code',
          title: '客户编号',
          filters: [{ data: { type: 'text' }}],
          filterRender: {
            name: 'FilterInput'
          },
          params: {
            handleSearch: (data) => {
              this.searchForm.code = data
              this.handleSearch()
            }
          }
        },
        {
          field: 'name',
          title: '客户名称',
          filters: [{ data: {}}],
          filterRender: {
            name: 'FilterComplex'
          },
          params: {
            handleSearch: (data) => {
              this.searchForm.name = data.name
              this.handleSearch()
            }
          }
        },
        {
          field: 'registerTime',
          title: '注册时间',
          sortable: true,
          width: 150,
          filters: [{ data: {}}],
          filterRender: {
            name: 'FilterTimeRange'
          },
          params: {
            handleSearch: (data) => {
              this.searchForm.startTime = data.startTime
              this.searchForm.endTime = data.endTime
              this.handleSearch()
            }
          },
          formatter: ({ cellValue }) => {
            return this.$Utils.formatterTimeZones(cellValue)
          }
        },
        {
          field: 'startTime',
          title: '有效时间(起)',
          sortable: true,
          width: 150,
          formatter: ({ cellValue }) => {
            return this.$Utils.formatterTimeZones(cellValue)
          }
        },
        {
          field: 'endTime',
          title: '有效时间(止)',
          sortable: true,
          width: 150,
          formatter: ({ cellValue }) => {
            return this.$Utils.formatterTimeZones(cellValue)
          }
        },
        {
          field: 'number',
          title: '金额'
        },
        {
          field: 'status',
          title: '状态',
          filters: [
            { label: this.$i18n.tc('正常'), value: '0' },
            { label: this.$i18n.tc('冻结'), value: '9' }
          ],
          filterMethod: ({ cellValue }) => {
            console.log(cellValue)
            this.searchForm.status = cellValue
            this.handleSearch()
            return false
          },
          slots: { default: 'status_default' },
          params: {
            color: {
              '0': 'green',
              '9': 'gray'
            }
          }
        },
        {
          field: 'ownDb',
          title: '是否独立db',
          formatter: ({ cellValue }) => {
            return cellValue ? this.$i18n.tc('是') : this.$i18n.tc('否')
          }
        }
      ],
      multipleSelection: []
    }
  },
  mounted() {
    this.getTableList()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 获取表格数据
    async getTableList() {
      const { currentPage, pageSize } = this.pageVo
      this.tableLoading = true
      try {
        const { data } = await this.$api.system.tenant.list({
          ...this.searchForm,
          current: currentPage,
          size: pageSize
        })
        this.dataSource = data.records.map((item, index) => {
          return {
            ...item,
            number: index + 1
          }
        })
        this.pageVo.total = data.total
      } finally {
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
