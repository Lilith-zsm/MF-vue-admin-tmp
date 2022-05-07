<!--
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-03-10 16:48:58
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-04-13 14:46:52
-->
<template>
  <div class="common-wrap">
    <div class="common-box">
      <div class="con-button-rows">
        <el-button type="success">普通表格</el-button>
      </div>
      <m-table
        ref="commonTable"
        :data-source="dataSource"
        :loading="tableLoading"
        :page-vo="pageVo"
        :columns="columns"
        :show-footer="true"
        :footer-method="getSummaries"
        @handleSelectionChange="handleSelectionChange"
        @handlePageChange="handlePageChange"
      />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dataSource: [],
      tableLoading: false,
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
        },
        {
          title: '操作',
          field: 'operation',
          slots: { default: 'operation_default' },
          params: [
            {
              title: '修改',
              type: 'success',
              icon: 'el-icon-edit',
              hasPermi: 'system:tenant:edit',
              click: (row) => {
                console.log('修改')
              }
            },
            {
              title: '删除',
              type: 'danger',
              icon: 'el-icon-delete',
              hasPermi: 'system:tenant:remove',
              click: (row, item) => {
                console.log('删除')
              }
            }
          ]
        }
      ],
      searchForm: {}
    }
  },
  mounted() {
    this.getTableList()
  },
  methods: {
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSearch() {
      this.pageVo.currentPage = 1
      this.getTableList()
    },
    // 分页
    handlePageChange(val) {
      const { currentPage, pageSize } = val
      this.pageVo.currentPage = currentPage
      this.pageVo.pageSize = pageSize
      this.getTableList()
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      const keys = ['number']
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (keys.includes(column.property)) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return this.$Utils.argAdd(prev, curr)
            } else {
              return prev
            }
          }, 0)
          sums[index]
        }
      })
      return [sums]
    }
  }
}
</script>
