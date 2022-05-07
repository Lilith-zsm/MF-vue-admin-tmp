<!--
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-02-28 17:10:08
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-03-09 16:28:05
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
    <!-- 修改角色 -->
    <edit-role
      v-if="editRoleVisible"
      :visible.sync="editRoleVisible"
      :edit-data="editRoleId"
      @onSubmit="getTableList"
    />
    <!-- 新增/编辑 -->
    <addEdit
      v-if="addEditVisible"
      :visible.sync="addEditVisible"
      :edit-data="editData"
      @onSubmit="getTableList"
    />
  </div>
</template>
<script>
import editRole from './components/editRole'
import addEdit from './components/edit'
export default {
  name: 'SystemPcRoles',
  components: {
    editRole,
    addEdit
  },
  data() {
    return {
      dataSource: [],
      searchForm: {},
      formData: [
        {
          label: '角色名称',
          prop: 'roleName',
          type: 'label_input',
          placeholder: '请输入'
        },
        {
          label: '机构级别',
          prop: 'siteRankCode',
          type: 'label_select',
          placeholder: '请选择',
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
          field: 'roleSort',
          title: '排序编码'
        },
        {
          field: 'roleName',
          title: '角色名称'
        },
        {
          field: 'siteRankName',
          title: '机构级别'
        },
        {
          field: 'status',
          title: '状态'
        },
        {
          title: '操作',
          field: 'operation',
          width: 150,
          slots: { default: 'operation_default' },
          params: [
            {
              title: '修改',
              type: 'success',
              icon: 'el-icon-edit',
              click: (row) => {
                this.editData = row
                this.addEditVisible = true
              }
            },
            {
              title: '删除',
              type: 'danger',
              icon: 'el-icon-delete',
              loading: false,
              click: (row, item) => {
                this.handleDelete(row, item)
              }
            },
            {
              title: '权限',
              type: 'warning',
              icon: 'el-icon-lock',
              click: (row) => {
                this.editRoleId = row.roleId
                this.editRoleVisible = true
              }
            }
          ]
        }
      ],
      multipleSelection: [],
      editRoleVisible: false,
      editRoleId: {},
      addEditVisible: false,
      editData: {}
    }
  },
  mounted() {
    this.getTableList()
    this.setOptions()
  },
  methods: {
    async setOptions() {
      const res = await this.$api.common.dictionary.getSub({ code: '002' })
      this.formData.find(item => item.prop === 'siteRankCode').options = res.data['002']
    },
    // 获取表格数据
    async getTableList() {
      this.tableLoading = true
      try {
        const { rows, total } = await this.$api.system.role.list({
          type: '2',
          ...this.searchForm,
          pageNum: this.pageVo.pageNum,
          pageSize: this.pageVo.pageSize
        })
        this.dataSource = rows
        this.pageVo.total = total
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
      this.editData = {}
      this.addEditVisible = true
    },
    // 分页
    handlePageChange(val) {
      const { currentPage, pageSize } = val
      this.pageVo.currentPage = currentPage
      this.pageVo.pageSize = pageSize
      this.getTableList()
    },
    // 删除
    handleDelete(row, it) {
      this.$confirm(this.$i18n.tc('是否确定删除该数据?'), this.$i18n.tc('提示'), {
        confirmButtonText: this.$i18n.tc('确定'),
        cancelButtonText: this.$i18n.tc('取消')
      }).then(async () => {
        it.loading = true
        try {
          await this.$api.system.role.remove([row.roleId])
          this.handleSearch()
        } finally {
          it.loading = false
        }
      }).catch(() => {})
    }
  }
}
</script>
