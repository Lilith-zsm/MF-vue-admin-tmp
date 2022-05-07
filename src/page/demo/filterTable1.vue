
<template>
  <div class="common-wrap">
    <div class="common-box">
      <m-table2
        ref="commonTable"
        :header-filter="true"
        :filter-config="{
          showIcon: false
        }"
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
import mTable2 from '@/components/table/index2'
export default {
  components: {
    mTable2
  },
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
          field: 'tenantId',
          title: 'SASS ID'
        },
        {
          field: 'code',
          title: '客户编号',
          filterType: 'label_input'
        },
        {
          field: 'name',
          title: '客户名称',
          filterType: 'label_input'
        },
        {
          field: 'registerTime',
          title: '注册时间',
          sortable: true,
          width: 240,
          filterType: 'label_date'
        },
        {
          field: 'startTime',
          title: '有效时间(起)',
          sortable: true,
          width: 240,
          filterType: 'label_date',
          formatter: ({ cellValue }) => {
            return this.$Utils.formatterTimeZones(cellValue)
          }
        },
        {
          field: 'endTime',
          title: '有效时间(止)',
          sortable: true,
          width: 240,
          filterType: 'label_date',
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
          options: [
            { label: '正常', value: '0', color: 'green' },
            { label: '冻结', value: '9', color: 'gray' }
          ],
          filterType: 'label_select'
        },
        {
          field: 'ownDb',
          title: '是否独立db',
          formatter: ({ cellValue }) => {
            return cellValue ? this.$i18n.tc('是') : this.$i18n.tc('否')
          },
          options: [
            { label: '是', value: true },
            { label: '否', value: false }
          ],
          filterType: 'label_select'
        },
        {
          title: '操作',
          field: 'operation',
          width: 100,
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
