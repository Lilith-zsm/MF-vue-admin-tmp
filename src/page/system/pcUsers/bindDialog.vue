<template>
  <base-dialog
    :title="bindType === 'pc' ? $t('绑定PC角色') : $t('绑定APP角色')"
    :visible.sync="dialogVisible"
    width="800px"
    :is-minus-full="false"
    @close="dialogVisible = false"
  >
    <!-- 查询 -->
    <condition-form
      ref="conditionForm"
      v-model="searchForm"
      :form-data="formData"
      @handleSearch="onSearch"
    />
    <!-- 表格 -->
    <m-table
      ref="commonTable"
      table-type="dialogTable"
      :data-source="dataSource"
      :loading="tableLoading"
      :page-vo="pageVo"
      :columns="columns"
      @handleSelectionChange="handleSelectionChange"
      @handlePageChange="handlePageChange"
    />
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" :loading="subLoading" @click="onSubmit">{{ $t('确定') }}</el-button>
    </div>
  </base-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean
    },
    bindType: {
      type: String,
      default: function() {
        return 'pc'
      }
    },
    currentUser: {
      type: Object,
      default: () => {
        return {}
      }
    },
    tType: {
      type: Number,
      default: () => {
        return 1
      }
    }
  },
  data() {
    return {
      subLoading: false,
      multipleSelection: [],
      searchForm: {},
      formData: [
        {
          label: '角色名称',
          type: 'label_input',
          placeholder: '请输入',
          prop: 'roleName',
          xl: 8,
          lg: 8,
          md: 8,
          sm: 8
        }
      ],
      // 表格值集
      dataSource: [],
      // 表格初始化
      pageVo: {
        total: 0,
        pageSize: 50,
        currentPage: 1
      },
      // 表格参数配置
      tableOptions: {
        stripe: true, // 是否为斑马纹 table
        loading: false, // 是否添加表格loading加载动画
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        serial: true, // 是否支持序号
        mutiSelect: true // 是否支持列表项选中功能
      },
      // 表格展示的列
      columns: [
        {
          type: 'checkbox',
          width: 50,
          fixed: 'left'
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
            { label: this.$i18n.tc('禁用'), value: '1' }
          ],
          slots: { default: 'status_default' },
          params: {
            color: {
              '0': 'green',
              '1': 'gray'
            }
          }
        }
      ],
      tableLoading: false
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  mounted() {
    this.getTableList()
  },
  methods: {
    // 获取PC和APP角色数据
    async getTableList(val) {
      this.tableLoading = true
      const params = {
        ...this.searchForm,
        type: this.tType,
        status: 0,
        pageNum: this.pageVo.currentPage,
        pageSize: this.pageVo.pageSize
      }
      try {
        const { rows, total } = await this.$api.system.role.list(params)
        this.dataSource = rows
        this.pageVo.total = total
        this.tableLoading = false
      } catch {
        this.tableLoading = false
      }
      const currentRolesArr = this.currentUser.roles.map(it => it.roleId)
      const checkRows = this.dataSource.filter(it => currentRolesArr.includes(it.roleId))
      this.$refs.commonTable.clearCheckboxRow() // 先清空选中行
      this.$nextTick(() => {
        checkRows.forEach(row => {
          this.$refs.commonTable.setCheckboxRow(row, true)
        })
      })
    },
    // 保存用户选中的角色
    async onSubmit() {
      this.subLoading = true
      const roleIds = this.multipleSelection.map(it => it.roleId)
      const res = {
        ...this.currentUser,
        roleIds
      }
      if (this.bindType === 'pc') {
        try {
          await this.$api.system.user.editPC(res)
          this.message.success(this.$i18n.tc('绑定角色成功'))
          this.$emit('submit')
          this.dialogVisible = false
          this.subLoading = false
        } catch {
          this.subLoading = false
        }
      } else {
        try {
          await this.$api.system.user.editAPP(res)
          this.message.success(this.$i18n.tc('绑定角色成功'))
          this.$emit('submit')
          this.dialogVisible = false
          this.subLoading = false
        } catch {
          this.subLoading = false
        }
      }
    },
    // 查询按钮
    onSearch() {
      this.pageVo.currentPage = 1
      this.getTableList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 分页
    handlePageChange(val) {
      const { currentPage, pageSize } = val
      this.pageVo.currentPage = currentPage
      this.pageVo.pageSize = pageSize
      this.getTableList()
    }
  }
}
</script>
