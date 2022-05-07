<template>
  <div class="container">
    <condition-form
      ref="conditionForm"
      v-model="searchForm"
      :form-data="formData"
    />
    <div class="receiptManagement-container margin-t-10">
      <div class="margin-b-10 con-button-rows">
        <el-button icon="el-icon-search" type="primary" @click="onSearch"> {{ $t('查询') }}</el-button>
        <el-button icon="el-icon-plus" type="success" @click="onAdd"> {{ $t('新增') }}</el-button>
        <el-button icon="el-icon-delete" type="danger" @click="onDel"> {{ $t('删除') }}</el-button>
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
    <serviceConfigDialog
      v-if="serviceDialogVisible"
      :visible.sync="serviceDialogVisible"
      :current-row="currentRow"
      @onSubmit="onSearch"
    />
  </div>
</template>

<script>
import baseDialog from './components/baseDialog'
import serviceConfigDialog from './components/serviceConfigDialog'
import { mapGetters } from 'vuex'
export default {
  name: 'PrintModule',
  components: {
    serviceConfigDialog,
    baseDialog
  },
  data() {
    return {
      loading: true,
      serviceDialogVisible: false,
      dialogVisible: false,
      searchForm: {
      },
      // 查询字段设置
      formData: [
        {
          label: '模板名称',
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
      tableLoading: false,
      // 表格展示的列
      tableColumns: [
        {
          prop: 'ids',
          label: '序号'
        },
        {
          prop: 'moduleCode',
          label: '模块编码'
        },
        {
          prop: 'moduleName',
          label: '模块名称',
          width: 200
        },
        {
          prop: 'functionName',
          label: '功能名称'
        },
        {
          prop: 'code',
          label: '模板编码'
        },
        {
          prop: 'name',
          label: '模板名称'
        },
        {
          prop: 'state',
          label: '状态',
          render: (h, { row }) => {
            return (
              <div>
                <el-switch
                  value={row.state}
                  active-value={true}
                  inactive-value={false}
                  onChange={(val) => this.onChangeState(row, val)}
                ></el-switch>
              </div>
            )
          }
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
          width: 170,
          fixed: 'right',
          render: (h, params) => {
            return (
              <div>
                <el-button
                  class={!this.$Utils.hasPermi(['common:sysManagement:printTemplate:edit']) ? 'hidden' : ''}
                  icon='el-icon-edit'
                  circle
                  title={this.$i18n.tc('修改')}
                  type='warning'
                  plain
                  onClick={() => this.onEdit(params.row)}
                ></el-button>
                <el-button
                  class={!this.$Utils.hasPermi(['common:sysManagement:printTemplate:setting']) ? 'hidden' : ''}
                  icon='el-icon-setting'
                  circle
                  title={this.$i18n.tc('服务配置')}
                  type='primary'
                  plain
                  onClick={() => this.onService(params.row)}
                ></el-button>
                <el-button
                  class={!this.$Utils.hasPermi(['common:sysManagement:printTemplate:design']) ? 'hidden' : ''}
                  icon='el-icon-attract'
                  circle
                  title={this.$i18n.tc('设计')}
                  type='danger'
                  plain
                  onClick={() => this.onDesign(params.row)}
                ></el-button>
                <el-button
                  class={(!this.$Utils.hasPermi(['common:sysManagement:printTemplate:preview']) || !params.row.content) ? 'hidden' : ''}
                  icon='el-icon-view'
                  circle
                  title={this.$i18n.tc('预览')}
                  type='success'
                  plain
                  onClick={() => this.onPreview(params.row)}
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
      currentRow: null
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
        const res = await this.$api.common.sysSetting.printTemplate.list(params)
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
        await this.$api.common.sysSetting.printTemplate.remove(ids)
        this.message.success(this.$i18n.tc('删除成功'))
        this.onSearch()
      }).catch(() => {})
    },
    // 修改状态
    async onChangeState(row, val) {
      await this.$api.common.sysSetting.printTemplate.updateState({
        id: row.id,
        state: val
      })
      this.message.success(this.$i18n.tc('操作成功'))
      this.onSearch()
    },
    // 服务配置
    onService(row) {
      this.currentRow = { ...row }
      this.serviceDialogVisible = true
    },
    // 设计
    onDesign(row) {
      this.$router.push({
        name: 'PrintTemplateDesign',
        query: { id: row.id }
      })
    },
    // 预览
    onPreview(row) {
      this.$router.push({
        name: 'PrintTemplatePreview',
        query: { code: row.code }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
