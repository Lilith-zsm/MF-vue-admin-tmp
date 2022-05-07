<!--
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-02-28 17:10:08
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-04-08 13:38:58
-->
<template>
  <div class="common-wrap">
    <template v-if="roleVisible">
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
    </template>
    <!-- 权限设置弹框 -->
    <permissionRoles
      v-if="permissionVisible"
      :params="dilogParams"
      :permission-visible.sync="permissionVisible"
      @roleFuncSubmit="handleRoleFuncSubmit"
    />
  </div>
</template>
<script>
import editRole from './components/editRole'
import addEdit from './components/edit'
import permissionRoles from './components/permissionRoles.vue'
export default {
  name: 'SystemPcRoles',
  components: {
    editRole,
    addEdit,
    permissionRoles
  },
  data() {
    return {
      tType: 1, // 类型：1-PC，2-APP,3-VIP
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
          title: '状态',
          filters: [
            { label: this.$i18n.tc('启用'), value: '0' },
            { label: this.$i18n.tc('停用'), value: '1' }
          ],
          slots: { default: 'status_default' },
          params: {
            color: {
              '0': 'green',
              '1': 'gray'
            }
          }
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
              click: (row) => {
                this.handleDelete(row)
              }
            },
            {
              title: '权限',
              type: 'warning',
              icon: 'el-icon-lock',
              click: (row) => {
                // this.editRoleId = row.roleId
                // this.editRoleVisible = true
                // 权限
                this.dilogParams = {
                  roleId: row.roleId,
                  type: this.tType
                }
                this.permissionVisible = true
                this.roleVisible = false
              }
            }
          ]
        }
      ],
      multipleSelection: [],
      editRoleVisible: false,
      editRoleId: {},
      addEditVisible: false,
      editData: {},
      permissionVisible: false,
      dilogParams: {},
      roleVisible: true
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
    handleRoleFuncSubmit() {
      this.permissionVisible = false
      this.roleVisible = true
    },
    // 获取表格数据
    async getTableList() {
      this.tableLoading = true
      try {
        const { rows, total } = await this.$api.system.role.list({
          type: this.tType,
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
    handleDelete(row) {
      this.$confirm(this.$i18n.tc('是否确定删除该数据?'), this.$i18n.tc('提示'), {
        confirmButtonText: this.$i18n.tc('确定'),
        cancelButtonText: this.$i18n.tc('取消')
      }).then(async () => {
        await this.$api.system.role.remove([row.roleId])
        this.handleSearch()
      }).catch(() => {})
    }
  }
}
</script>
