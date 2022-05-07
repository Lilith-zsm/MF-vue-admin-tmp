<template>
  <div class="common-wrap">
    <condition-form
      ref="conditionForm"
      v-model="searchForm"
      :form-data="formData"
    />
    <div class="common-box">
      <div class="con-button-rows">
        <el-button icon="el-icon-search" type="primary" @click="onSearch"> {{ $t('查询') }}</el-button>
        <el-button icon="el-icon-close" type="danger" @click="onClear"> {{ $t('清空') }}</el-button>
        <el-button icon="el-icon-plus" type="success" @click="onAdd"> {{ $t('新增') }}</el-button>
        <el-button icon="el-icon-delete" :loading="deleteLoading" type="danger" @click="onDel"> {{ $t('删除') }}</el-button>
      </div>
      <m-table
        ref="comTable"
        :data-source="dataSource"
        :loading="tableLoading"
        :page-vo="pageVo"
        :columns="tableColumns"
        @handleSelectionChange="handleSelectionChange"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      />
    </div>
    <baseDialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :current-row="currentRow"
      @onSubmit="onSearch"
    />
  </div>
</template>

<script>
import baseDialog from './components/baseDialog'
import { mapGetters } from 'vuex'
export default {
  name: 'PrintModule',
  components: {
    baseDialog
  },
  data() {
    return {
      loading: true,
      dialogVisible: false,
      searchForm: {
      },
      // 查询字段设置
      formData: [
        {
          label: '模块名称',
          type: 'label_input',
          prop: 'name'
        }
      ],
      // 表格分页
      pageVo: {
        total: 0,
        pageSize: 50,
        currentPage: 1
      },
      // 表格展示的列
      tableColumns: [
        {
          prop: 'ids',
          label: '序号'
        },
        {
          prop: 'code',
          label: '模块编码'
        },
        {
          prop: 'name',
          label: '模块名称',
          width: 160
        },
        {
          prop: 'functionName',
          label: '功能名称'
        },
        {
          prop: 'remark',
          label: '备注'
        },
        {
          prop: 'createTime',
          label: '创建时间'
        },
        {
          prop: 'createByName',
          label: '创建人'
        },
        {
          prop: 'updateTime',
          label: '修改时间'
        },
        {
          prop: 'updateByName',
          label: '修改人'
        },
        {
          prop: 'controlBtn',
          label: '操作',
          width: 100,
          fixed: 'right',
          render: (h, params) => {
            return (
              <div>
                <el-button
                  icon='el-icon-edit'
                  circle
                  title={this.$i18n.tc('修改')}
                  type='warning'
                  plain
                  onClick={() => this.onEdit(params.row)}
                ></el-button>
              </div>
            )
          }
        }
      ],
      // 表格数据
      dataSource: [],
      // 勾选行
      multipleSelection: [],
      // 当前操作行
      currentRow: null,
      tableLoading: false,
      deleteLoading: false
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    // 获取数据
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
        const res = await this.$api.common.sysSetting.printModule.list(params)
        this.dataSource = res.rows
        this.pageVo.total = res.total
        this.tableLoading = false
      } catch {
        this.tableLoading = false
      }
    },
    // 查询
    onSearch() {
      this.pageVo.currentPage = 1
      this.getData()
    },
    // 清空
    onClear() {
      for (const i in this.searchForm) {
        this.searchForm[i] = ''
      }
      this.onSearch()
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 分页
    handleCurrentChange(val) {
      this.pageVo.currentPage = val
      this.getData()
    },
    // 分页
    handleSizeChange(val) {
      this.pageVo.pageSize = val
      this.getData()
    },
    // 新增
    onAdd(row) {
      this.currentRow = { ...row, opType: 'add' }
      this.dialogVisible = true
    },
    // 编辑
    onEdit(row) {
      this.currentRow = { ...row, opType: 'edit' }
      this.dialogVisible = true
    },
    // 查看
    onView(row) {
      this.currentRow = { ...row, opType: 'view' }
      this.dialogVisible = true
    },
    // 删除
    onDel() {
      if (!this.multipleSelection.length) {
        this.$message.warning(this.$i18n.tc('请选择数据'))
        return
      }
      this.$confirm(this.$i18n.tc('是否确定删除'), this.$i18n.tc('提示'), {
        confirmButtonText: this.$i18n.tc('确定'),
        cancelButtonText: this.$i18n.tc('取消'),
        type: 'warning'
      }).then(async () => {
        const ids = this.multipleSelection.map(it => it.id)
        this.deleteLoading = true
        try {
          await this.$api.common.sysSetting.printModule.remove(ids)
          this.message.success(this.$i18n.tc('删除成功'))
          this.onSearch()
          this.deleteLoading = false
        } catch {
          this.deleteLoading = false
        }
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
