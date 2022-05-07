<!--
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-02-28 17:10:08
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-04-16 15:29:05
-->
<template>
  <div>
    <condition-form
      ref="conditionForm"
      v-model="searchForm"
      :form-data="formData"
      @handleSearch="handleSearch"
    />
    <div class="common-box">
      <div class="con-button-rows">
        <el-button type="info"><i class="el-icon-download" /> {{ $t('导出') }}</el-button>
      </div>
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
          type: 'label_input_clearable',
          label: '付费网点',
          prop: 'paySite'
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
          field: 'waybillNo',
          title: '运单编号'
        },
        {
          field: 'shippin`gDate',
          title: '寄件日期'
        },
        {
          field: 'shippingSiteName',
          title: '寄件网点'
        },
        {
          field: 'success',
          title: '计费条数'
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
