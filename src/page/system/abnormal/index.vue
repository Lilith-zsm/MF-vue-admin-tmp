<template>
  <div class="common-wrap">
    <div class="common-box">
      <div class="con-button-rows">
        <el-button type="success" @click="handleAdd"><i class="el-icon-plus" /> {{ $t('新增') }}</el-button>
      </div>
      <m-table
        ref="commonTable"
        :data-source="dataSource"
        :loading="tableLoading"
        :columns="columns"
        :filter-config="{
          remote: false
        }"
        @handleSelectionChange="handleSelectionChange"
        @handlePageChange="handlePageChange"
      />
    </div>
    <!-- 新增 -->
    <add v-if="addVisible" :visible.sync="addVisible" @handleSuccessSave="handleSearch" />
    <!-- 修改 -->
    <edit v-if="editVisible" :visible.sync="editVisible" :init-data="editRow" @handleSuccessSave="handleSearch" />
  </div>
</template>

<script>
import add from './addEdit'
import edit from './addEdit'
export default {
  name: 'SystemAbnormal',
  components: {
    add,
    edit
  },
  data() {
    return {
      searchForm: {},
      multipleSelection: [],
      // 查询字段设置
      formData: [
        {
          label: '编号key',
          type: 'label_input',
          placeholder: '请输入',
          prop: 'key'
        }
      ],
      // 表格初始化
      pageVo: {
        total: 0,
        pageSize: 50,
        currentPage: 1
      },
      // 表格参数配置
      tableLoading: false,
      // 表格展示的列
      columns: [
        {
          title: '序号',
          type: 'seq',
          width: 60,
          fixed: 'left'
        },
        {
          field: 'key',
          title: '编号key',
          width: '150px',
          filters: [{ data: '' }],
          filterRender: {
            name: 'input'
          }
        },
        {
          field: 'module',
          title: '模块名称'
        },
        {
          field: 'valueZh',
          title: '异常信息(中文)',
          width: '250px',
          filters: [{ data: '' }],
          filterRender: {
            name: 'input'
          }
        },
        {
          field: 'valueEn',
          title: '异常信息(英文)',
          width: '250px',
          filters: [{ data: '' }],
          filterRender: {
            name: 'input'
          }
        },
        {
          field: 'valueAr',
          title: '异常信息(印尼文)',
          width: '250px',
          filters: [{ data: '' }],
          filterRender: {
            name: 'input'
          }
        },
        {
          field: 'valueTw',
          title: '异常信息(繁体中文)',
          width: '250px',
          filters: [{ data: '' }],
          filterRender: {
            name: 'input'
          }
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: '150px',
          formatter: ({ cellValue }) => {
            return this.$Utils.formatterTimeZones(cellValue)
          }
        },
        {
          field: 'updateByName',
          title: '更新人'
        },
        {
          field: 'updateTime',
          title: '更新时间',
          width: '150px',
          formatter: ({ cellValue }) => {
            return this.$Utils.formatterTimeZones(cellValue)
          }
        },
        {
          title: '操作',
          field: 'operation',
          slots: { default: 'operation_default' },
          fixed: 'right',
          params: [
            {
              title: '修改',
              type: 'success',
              icon: 'el-icon-edit',
              click: (row) => {
                this.handleEdit(row)
              }
            },
            {
              title: '删除',
              type: 'danger',
              icon: 'el-icon-delete',
              click: (row) => {
                this.handleDelete(row)
              }
            }
          ]
        }
      ],
      // 表格值集
      dataSource: [],
      addVisible: false,
      editVisible: false,
      editRow: {}
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 获取数据
    async getData() {
      this.tableLoading = true
      const params = {
        ...this.searchForm,
        pageNum: this.pageVo.currentPage,
        pageSize: this.pageVo.pageSize
      }
      try {
        const { data } = await this.$api.system.abnormal.list(params)
        this.tableLoading = false
        this.dataSource = data
      } catch {
        this.tableLoading = false
      }
    },
    // 查询按钮
    handleSearch() {
      this.getData()
    },
    // 分页
    handlePageChange(val) {
      const { currentPage, pageSize } = val
      this.pageVo.currentPage = currentPage
      this.pageVo.pageSize = pageSize
      this.getData()
    },
    handleSelectionChange(val) {
    },
    handleAdd() {
      this.editRow = {}
      this.addVisible = true
    },
    handleDelete(row) {
      this.$confirm(this.$i18n.tc('是否确定删除该数据?'), this.$i18n.tc('提示'), {
        confirmButtonText: this.$i18n.tc('确定'),
        cancelButtonText: this.$i18n.tc('取消')
      }).then(async () => {
        await this.$api.system.abnormal.remove({ key: row.key })
        this.handleSearch()
      }).catch(() => {})
    },
    handleEdit(row) {
      this.editRow = { ...row, edit: true }
      this.editVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.main-box {
  background: #fff;
}
</style>
