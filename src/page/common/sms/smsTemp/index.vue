<!--
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-02-28 17:10:08
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-04-16 13:58:21
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
      <div class="con-button-rows">
        <el-button type="success" @click="handleAdd"><i class="el-icon-plus" /> {{ $t('新增') }}</el-button>
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
    <!-- 新增 -->
    <add v-if="addVisible" :visible.sync="addVisible" @handleSuccessSave="getTableList" />
    <!-- 修改 -->
    <edit v-if="editVisible" :visible.sync="editVisible" :init-data="editRow" @handleSuccessSave="getTableList" />
  </div>
</template>
<script>
import add from './addEdit'
import edit from './addEdit'
export default {
  name: 'SmsTemp',
  components: {
    add,
    edit
  },
  data() {
    return {
      dataSource: [],
      searchForm: {},
      formData: [
        {
          type: 'label_select',
          label: '模板类型',
          prop: 'templateTypeCode',
          labelName: 'subName',
          labelVal: 'subCode',
          options: []
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
          field: 'templateType',
          title: '模板类型'
        },
        {
          field: 'templateContent',
          title: '模板内容'
        },
        {
          field: 'createBy',
          title: '维护人'
        },
        {
          field: 'createTime',
          title: '维护日期'
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
                this.handleEdit(row)
              }
            },
            {
              title: '删除',
              type: 'danger',
              icon: 'el-icon-delete',
              hasPermi: 'system:tenant:remove',
              click: (row) => {
                this.handleDelete(row)
              }
            }
          ]
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
