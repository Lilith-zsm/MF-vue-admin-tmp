<!--
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-03-10 16:48:58
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-05-07 10:14:10
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
        :filter-config="{
          showIcon: false
        }"
        :header-filter="true"
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
import XEUtils from 'xe-utils'
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
          fixed: 'left',
          resizable: false
        },
        {
          title: '序号',
          type: 'seq',
          width: 60,
          fixed: 'left',
          slots: { header: 'seq_header' },
          resizable: false
        },
        {
          field: 'tenantId',
          title: 'SASS ID',
          slots: { header: 'filter_header' },
          filters: [{ data: '' }],
          params: {
            filterType: 'label_input'
          },
          filterMethod: ({ option, row, column }) => {
            if (option.data) {
              return XEUtils.toValueString(row[column.property]).toLowerCase().indexOf(option.data) > -1
            }
            return true
          }
        },
        {
          field: 'code',
          title: '客户编号',
          slots: { header: 'filter_header' },
          filters: [{ data: '' }],
          params: {
            filterType: 'label_input'
          },
          filterMethod: ({ option, row, column }) => {
            if (option.data) {
              return XEUtils.toValueString(row[column.property]).toLowerCase().indexOf(option.data) > -1
            }
            return true
          }
        },
        {
          field: 'name',
          title: '客户名称',
          slots: { header: 'filter_header' },
          filters: [{ data: '' }],
          params: {
            filterType: 'label_input'
          },
          filterMethod: ({ option, row, column }) => {
            if (option.data) {
              return XEUtils.toValueString(row[column.property]).toLowerCase().indexOf(option.data) > -1
            }
            return true
          }
        },
        {
          field: 'registerTime',
          title: '注册时间',
          sortable: true,
          width: 240,
          slots: { header: 'filter_header' },
          filters: [{ data: [] }],
          params: {
            filterType: 'label_date'
          }
        },
        {
          field: 'startTime',
          title: '有效时间(起)',
          sortable: true,
          width: 240,
          slots: { header: 'filter_header' },
          filters: [{ data: [] }],
          params: {
            filterType: 'label_date'
          }
        },
        {
          field: 'endTime',
          title: '有效时间(止)',
          sortable: true,
          width: 240,
          slots: { header: 'filter_header' },
          filters: [{ data: [] }],
          params: {
            filterType: 'label_date'
          }
        },
        {
          field: 'number',
          title: '金额',
          slots: { header: 'filter_header' },
          filters: [{ data: '' }],
          params: {
            filterType: 'label_input'
          }
        },
        {
          field: 'status',
          title: '状态',
          filters: [{ data: '' }],
          slots: { header: 'filter_header' },
          params: {
            filterType: 'label_select',
            options: [
              { label: this.$i18n.tc('正常'), value: '0' },
              { label: this.$i18n.tc('冻结'), value: '9' }
            ]
          }
        },
        {
          field: 'ownDb',
          title: '是否独立db',
          formatter: ({ cellValue }) => {
            return cellValue ? this.$i18n.tc('是') : this.$i18n.tc('否')
          },
          filters: [{ data: '' }],
          slots: { header: 'filter_header' },
          params: {
            filterType: 'label_select',
            options: [
              { label: this.$i18n.tc('是'), value: true },
              { label: this.$i18n.tc('否'), value: false }
            ]
          }
        },
        {
          title: '操作',
          field: 'operation',
          slots: { default: 'operation_default' },
          resizable: false,
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
