<template>
  <div class="common-wrap">
    <!-- 查询 -->
    <condition-form
      ref="conditionForm"
      v-model="searchForm"
      label-width="90px"
      :form-data="formData"
      @handleSearch="onSearch"
      @handleReset="onSearch"
    />
    <div class="common-box">
      <div id="common-operation-btns">
        <el-button v-hasPermi="['system:appRole:add']" type="success" icon="el-icon-plus" @click="onAdd"> {{ $t('新增') }}</el-button>
      </div>
      <my_table
        :page-vo="pageVo"
        :options="tableOptions"
        :columns="tableColumns"
        :data-source="tableOptions.dataList"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      />
    </div>
    <edit v-if="editOptions.visible" :visible.sync="editOptions.visible" :edit-data="editOptions.editData" @onSubmit="subEdit" />
    <edit-role v-if="editRoleOptions.visible" :visible.sync="editRoleOptions.visible" :edit-data="editRoleOptions.editData" @onSubmit="subEditRole" />
  </div>
</template>

<script>
import { getDictionary } from '@/api/common'
import edit from './components/edit'
import editRole from './components/editRole'
export default {
  name: 'SystemAppRoles',
  components: {
    edit,
    editRole
  },
  data() {
    return {
      searchForm: {},
      statusOptions: [
        { value: '0', label: this.$i18n.tc('启用') },
        { value: '1', label: this.$i18n.tc('停用') }
      ],
      // 查询字段设置
      formData: [
        {
          label: '角色名称',
          type: 'label_input',
          placeholder: '请输入',
          prop: 'roleName'
        },
        {
          label: '机构级别',
          type: 'label_select',
          placeholder: '请选择',
          prop: 'siteRankCode',
          options: []
        }
      ],
      // 表格初始化
      pageVo: {
        total: 0,
        status: true,
        pageSize: 15,
        pageNum: 1
      },
      // 表格参数配置
      tableOptions: {
        dataList: [], // 数据源
        stripe: true, // 是否为斑马纹 table
        loading: false, // 是否添加表格loading加载动画
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        serial: true, // 是否支持序号
        mutiSelect: false, // 是否支持列表项选中功能
        height: ''
      },
      // 表格展示的列
      tableColumns: [
        {
          prop: 'ids',
          label: '序号'
        },
        {
          prop: 'roleSort',
          label: '排序编码'
        },
        {
          prop: 'roleName',
          label: '角色名称'
        },
        {
          prop: 'siteRankName',
          label: '机构级别'
        },
        {
          label: '状态',
          prop: 'status',
          width: '100px',
          render: (h, params) => {
            return (
              <div>
                <el-switch
                  active-value='0'
                  inactive-value='1'
                  active-color='#13ce66'
                  inactive-color='#ff4949'
                  v-model={params.row.status}
                  onChange={() => this.changeStatus(params.row)}
                >
                </el-switch>
              </div>
            )
          }
        },
        {
          prop: 'controlBtn',
          label: '操作',
          width: 130,
          fixed: 'right',
          render: (h, params) => {
            return (
              <div>
                <el-button circle plain type='success' icon='el-icon-edit' title={this.$i18n.tc('修改')} onClick={() => this.onEdit(params.row)}></el-button>
                <el-button circle plain type='danger' icon='el-icon-delete' title={this.$i18n.tc('删除')} onClick={() => this.onDelete(params.row)}></el-button>
                <el-button icon='el-icon-lock' circle title={this.$i18n.tc('权限')} type='warning' plain onClick={() => this.onEditRole(params.row)}></el-button>
              </div>
            )
          }
        }
      ],
      // 表格值集
      editOptions: {
        editData: {},
        visible: false
      },
      editRoleOptions: {
        editData: null,
        visible: false
      }
    }
  },
  mounted() {
    // this.setOptions()
    this.getData()
  },
  methods: {
    // 获取数据字典
    async setOptions() {
      getDictionary({ code: '002' }).then(res => {
        this.formData.find(item => item.prop === 'siteRankCode').options = res.data['002']
      })
    },
    // 获取数据
    async getData() {
      this.tableOptions.loading = true
      const params = {
        type: '2',
        ...this.searchForm,
        pageNum: this.pageVo.pageNum,
        pageSize: this.pageVo.pageSize
      }
      try {
        const res = await this.$api.system.role.list(params)
        this.tableOptions.dataList = res.rows
        this.pageVo.total = res.total
      } finally {
        this.tableOptions.loading = false
      }
    },
    // 查询按钮
    onSearch() {
      this.getData()
    },
    // 新增
    onAdd() {
      this.editOptions.editData = { status: '0', roleSort: 1 }
      this.editOptions.visible = true
    },
    // 编辑
    onEdit(row) {
      this.editOptions.editData = { ...row }
      this.editOptions.visible = true
    },
    subEdit() {
      this.editOptions.visible = false
      this.getData()
    },
    // 更改状态
    async changeStatus(row) {
      this.tableOptions.loading = true
      try {
        await this.$api.system.role.addEdit({ ...row })
        this.message.success('操作成功')
        this.getData()
      } finally {
        this.tableOptions.loading = false
      }
    },
    // 删除
    onDelete(row) {
      this.$confirm(`即将删除“${row.roleName}”角色, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async () => {
        this.tableOptions.loading = true
        try {
          await this.$api.system.role.remove([row.roleId])
          this.message.success('操作成功')
          this.getData()
        } finally {
          this.tableOptions.loading = false
        }
      })
    },
    // 设置权限
    onEditRole(row) {
      this.editRoleOptions.editData = row.roleId
      this.editRoleOptions.visible = true
    },
    subEditRole() {
      this.editRoleOptions.visible = false
      this.getData()
    },
    // 页码改变事件
    handleCurrentChange(val) {
      this.pageVo.pageNum = val
      this.getData()
    },
    // 页数改变事件
    handleSizeChange(val) {
      this.pageVo.pageSize = val
      this.pageVo.pageNum = 1
      this.getData()
    }
  }
}
</script>
