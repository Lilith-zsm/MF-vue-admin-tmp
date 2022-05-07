<!--
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-02-28 17:10:08
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-04-16 14:03:02
-->
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
  name: 'SmsList',
  data() {
    return {
      dataSource: [],
      searchForm: {},
      formData: [
        {
          type: 'label_date_picker',
          label: '发送时间',
          prop: 'createTime'
        },
        {
          type: 'label_input',
          label: '接收手机号',
          prop: 'iphone'
        },
        {
          type: 'label_input',
          label: '发送网点',
          prop: 'createSite'
        },
        {
          type: 'label_input',
          label: '发送人',
          prop: 'createBy'
        }
      ],
      tableLoading: false,
      pageVo: {
        total: 0,
        pageSize: 50,
        currentPage: 1
      },
      // 初始化表格
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
          field: 'iphone',
          title: '接收手机号'
        },
        {
          field: 'message',
          title: '短信内容'
        },
        {
          field: 'createBy',
          title: '维护人'
        },
        {
          field: 'waybillNo',
          title: '运单编号'
        },
        {
          field: 'sendIden',
          title: '发送标识',
          filters: [
            { label: this.$i18n.tc('未发送'), value: '0' },
            { label: this.$i18n.tc('已发送'), value: '1' }
          ],
          slots: { default: 'status_default' },
          params: {
            color: {
              '0': 'yellow',
              '1': 'green'
            }
          }
        },
        {
          field: 'messageType',
          title: '短信类型'
        },
        {
          field: 'createBy',
          title: '发送人'
        },
        {
          field: 'createTime',
          title: '发送时间'
        },
        {
          field: 'createSite',
          title: '发送网点'
        }
      ],
      multipleSelection: [],
      addVisible: false,
      editVisible: false,
      editRow: {}
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
        this.dataSource = data.records
        this.pageVo.total = data.total
      } finally {
        this.tableLoading = false
      }
    },
    // 查询
    handleSearch() {
      this.pageVo.currentPage = 1
      this.getTableList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 新增
    handleAdd() {
      this.addVisible = true
    },
    // 分页
    handlePageChange(val) {
      const { currentPage, pageSize } = val
      this.pageVo.currentPage = currentPage
      this.pageVo.pageSize = pageSize
      this.getTableList()
    },
    // 编辑
    handleEdit(row) {
      this.editRow = { ...row }
      this.editVisible = true
    },
    // 删除
    handleDelete(row, it) {
      this.$confirm(this.$i18n.tc('是否确定删除该数据?'), this.$i18n.tc('提示'), {
        confirmButtonText: this.$i18n.tc('确定'),
        cancelButtonText: this.$i18n.tc('取消')
      }).then(async () => {
        await this.$api.system.tenant.remove(row.tenantId)
        this.handleSearch()
      }).catch(() => {})
    }
  }
}
</script>
