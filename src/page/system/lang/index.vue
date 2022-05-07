<!--
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-02-28 17:10:08
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-03-10 16:56:38
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
        <el-button type="danger" icon="el-icon-delete" :disabled="multipleSelection.length < 1" :loading="deleteLoading" @click="handleDelete()">{{ $t('批量删除') }}</el-button>
        <el-button type="warning" icon="el-icon-download" :loading="downTempLoading" @click="handleDownloadTemplate">{{ $t('下载模板') }}</el-button>
        <upload-excel-button
          api-module="system.lang.import"
          @handleFinish="handleSearch"
        />
        <el-button type="primary" icon="el-icon-download" :loading="exportLoading" @click="handleExport">{{ $t('导出') }}</el-button>
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
    <add
      v-if="langVisible"
      :visible.sync="langVisible"
      :form="editRow"
      @onSubmit="getTableList()"
    />
  </div>
</template>
<script>
import add from './components/add'
import uploadExcelButton from '@/components/uploadExcel'
export default {
  name: 'SystemLang',
  components: {
    add,
    uploadExcelButton
  },
  data() {
    return {
      dataSource: [],
      searchForm: {},
      formData: [
        {
          type: 'label_input',
          label: '编号',
          prop: 'id'
        },
        {
          type: 'label_radio_input',
          prop: 'langName',
          selectType: 'strid',
          options: [
            {
              value: 'strid',
              label: '中文'
            },
            {
              value: 'lan1',
              label: '英文'
            },
            {
              value: 'lan2',
              label: '印尼文'
            },
            {
              value: 'lan3',
              label: '马来文'
            }
          ],
          xl: 8,
          lg: 8,
          md: 8,
          sm: 16
        },
        {
          type: 'label_select',
          label: '分组类型',
          prop: 'grouptype',
          options: [
            {
              label: '菜单',
              value: 1
            },
            {
              label: '表格',
              value: 2
            },
            {
              label: '按钮',
              value: 3
            },
            {
              label: '其它',
              value: 4
            }
          ]
        },
        {
          type: 'label_checkbox',
          label: 'APP标识',
          checkboxLabel: '',
          prop: 'app',
          trueLabel: '1',
          falseLabel: ''
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
          title: '编号',
          field: 'id'
        },
        {
          title: '简体中文',
          field: 'strid'
        },
        {
          title: '英文',
          field: 'lan1'
        },
        {
          title: '印尼文',
          field: 'lan2'
        },
        {
          title: '马来文',
          field: 'lan3'
        },
        {
          title: 'APP标识',
          field: 'app',
          formatter: ({ cellValue }) => {
            if (cellValue === '1') {
              return 'APP'
            } else {
              return ''
            }
          }
        },
        {
          title: '分组类型',
          field: 'grouptype',
          filters: [
            { label: this.$i18n.tc('菜单'), value: 1 },
            { label: this.$i18n.tc('表格'), value: 2 },
            { label: this.$i18n.tc('按钮'), value: 3 },
            { label: this.$i18n.tc('其它'), value: 4 }
          ],
          slots: { default: 'status_default' }
        },
        {
          field: 'visible',
          title: '是否可见',
          slots: { default: 'switch_default' },
          params: {
            openValue: 1,
            closeValue: 0,
            change: ({ value }, row) => {
              this.handleChangeStatus(row, value)
            }
          }
        },
        {
          title: '操作',
          field: 'operation',
          slots: { default: 'operation_default' },
          width: 100,
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
      multipleSelection: [],
      editRow: {},
      langVisible: false,
      deleteLoading: false,
      downTempLoading: false,
      innerVisible: true,
      percentage: 0,
      exportLoading: false
    }
  },
  mounted() {
    this.getTableList()
  },
  methods: {
    // 获取表格数据
    async getTableList() {
      const { currentPage, pageSize } = this.pageVo
      const selectLang = this.formData.find(item => item.prop === 'langName').selectType
      this.searchForm[selectLang] = this.searchForm.langName
      this.tableLoading = true
      try {
        const { rows, total } = await this.$api.system.lang.list({
          ...this.searchForm,
          pageNum: currentPage,
          pageSize: pageSize
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
      this.editRow = null
      this.langVisible = true
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
      this.langVisible = true
    },
    // 删除
    handleDelete(row) {
      this.$confirm(this.$i18n.tc('是否确定删除选中数据?'), this.$i18n.tc('提示'), {
        confirmButtonText: this.$i18n.tc('确定'),
        cancelButtonText: this.$i18n.tc('取消')
      }).then(async () => {
        this.deleteLoading = true
        const ids = row ? [row.id] : this.multipleSelection.map(item => item.id)
        try {
          await this.$api.system.lang.remove(ids)
          this.handleSearch()
        } finally {
          this.deleteLoading = false
        }
      }).catch(() => {})
    },
    // 下载模板
    async handleDownloadTemplate() {
      this.downTempLoading = true
      try {
        const res = await this.$api.system.lang.downloadTemp()
        this.$Utils.handleDownloadFile(res)
        this.downTempLoading = false
      } catch {
        this.downTempLoading = false
      }
    },
    // 导出
    async handleExport() {
      this.exportLoading = true
      try {
        const res = await this.$api.system.lang.export()
        this.$Utils.handleDownloadFile(res)
      } finally {
        this.exportLoading = false
      }
    }
  }
}
</script>
