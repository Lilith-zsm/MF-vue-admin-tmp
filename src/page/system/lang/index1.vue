<template>
  <div class="common-wrap">
    <condition-form
      ref="conditionForm"
      v-model="searchForm"
      :form-data="formData"
      @handleSearch="onSearch"
      @handleReset="onSearch"
    />
    <div class="common-box">
      <div class="con-button-rows">
        <el-button type="success" icon="el-icon-plus" @click="addTable">{{ $t('新增') }} </el-button>
        <el-button type="success" icon="el-icon-edit-outline" :disabled="currentSelection.length < 1 || currentSelection.length > 1" @click="updateTable">{{ $t('修改') }}</el-button>
        <el-button type="danger" icon="el-icon-delete" :disabled="currentSelection.length < 1" :loading="deleteLoading" @click="deleteTable">{{ $t('批量删除') }}</el-button>
        <el-button type="info" @click="onExport"> <i class="el-icon-download" /> {{ $t('导出') }} </el-button>
        <el-upload
          class="upload"
          :action="importParams.url"
          :show-file-list="false"
          :file-list="importParams.fileList"
          :multiple="false"
          :before-upload="beforeUpload"
          :on-success="onUploadSuccess"
          :on-error="onUploadError"
        >
          <el-button type="info" icon="el-icon-upload2">{{ $t('导入') }}</el-button>
        </el-upload>
        <el-button type="warning" @click="downloadTemplate"> <i class="el-icon-download" /> {{ $t('下载模板') }} </el-button>
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
      v-if="lang.visible"
      :visible.sync="lang.visible"
      :form="form"
      @onSubmit="onSubmit"
    />
  </div>
</template>
<script>
import add from './components/add'
import { putLangers, exportLanger, importLang, downloadImportTemplate } from '@/api/system/lang'
export default {
  components: {
    add
  },
  data () {
    return {
      importParams: {
        url: importLang,
        fileList: []
      },
      lang: {
        visible: false
      },
      form: {},
      deleteLoading: false,
      saveLoading: false,
      options: {
        stripe: true, // 是否为斑马纹 table
        loading: false, // 是否添加表格loading加载动画
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        serial: true, // 是否支持序号
        mutiSelect: true,
        height: 0
      },
      formData: [
        {
          type: 'label_input',
          label: '编号',
          prop: 'code'
        },
        {
          type: 'label_radio_input',
          prop: 'parm2',
          selectType: '1',
          options: [
            {
              value: '1',
              label: '中文'
            },
            {
              value: '2',
              label: '英文'
            },
            {
              value: '3',
              label: '泰文'
            }
          ],
          xl: 8,
          lg: 8,
          md: 8,
          sm: 8,
          handleChange: (item) => {
            console.log(item)
            this.$set(this.searchForm, 'parm1', item.selectType)
          }
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
      list: [],
      // tab的分页控制
      pageVo: {
        total: 0,
        pageSize: 50,
        currentPage: 1
      },
      labelForm: false,
      loading: false,
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
          field: 'code'
        },
        {
          title: '中文',
          field: 'strid'
        },
        {
          title: '英文',
          field: 'lan1'
        },
        {
          title: '泰文',
          field: 'lan2'
        },
        {
          title: 'APP标识',
          field: 'app',
          formatter: row => {
            if (row.app === '1') {
              return 'APP'
            } else {
              return ''
            }
          }
        },
        {
          title: '分组类型',
          field: 'grouptype',
          formatter: (row) => {
            if (row.grouptype === 1) {
              return '菜单'
            } else if (row.grouptype === 2) {
              return '表格'
            } else if (row.grouptype === 3) {
              return '按钮'
            } else if (row.grouptype === 4) {
              return '其它'
            }
          }
        },
        {
          title: '是否可见',
          field: 'visible',
          type: 'label_switch',
          form: true,
          handleChange: async (params, val) => {
            const res = await putLangers({ visible: val, id: params.row.id })
            if (res.code === 200) {
              this.$message({
                message: this.$i18n.tc(`${res.msg}`),
                type: 'success'
              })
            }
          }
        },
        {
          prop: 'controlBtn',
          label: '操作',
          width: 160,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            return (
              <div>
                <el-button icon='el-icon-edit' circle title={this.$i18n.tc('修改')} type='success' plain onClick={() => this.onEdit(params.row)}></el-button>
                <el-button icon='el-icon-delete' circle title={this.$i18n.tc('删除')} type='danger' plain onClick={() => this.onDelete(params.row)}></el-button>
              </div>
            )
          }
        }
      ],
      searchForm: {
        parm1: '1'
      },
      currentSelection: []
    }
  },
  mounted () {
    this.getLangerList()
    this.computedTableHeight()
  },
  methods: {
    /**
         * 导入文件前的操作
         */
    beforeUpload(file) {
      // 上传前配置
      const excelfileExtend = '.xls,.xlsx'// 设置文件格式
      const fileExtend = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
      if (excelfileExtend.indexOf(fileExtend) <= -1) {
        this.$message.error(this.$i18n.tc('文件格式错误'))
        return false
      }
      this.processing = true
      this.importParams.fileList = [file]
    },
    /**
      * 导入文件成功后的回调
      */
    onUploadSuccess(response) {
      this.processing = false
      console.log(response)
      if (response.code === 200) {
        // this.data = response.data
        this.getLangerList(this.searchForm)
      }
    },
    /**
         * 导入文件失败后的回调
         */
    onUploadError() {
      this.processing = false
      this.$message.error(this.$i18n.tc('导入失败'))
    },
    // 导出
    onExport () {
      const ids = []
      if (this.currentSelection) {
        this.currentSelection.map((item) => {
          if (item.id) {
            ids.push(item.id)
          }
          return ids
        })
      }
      const id = ids.join(',')
      exportLanger({ id }).then((res) => {
        this.$Utils.exportFile(this.$i18n.tc('语言设置导出'), res.request.responseURL)
      })
    },
    downloadTemplate() {
      downloadImportTemplate().then((res) => {
        this.$Utils.exportFile(this.$i18n.tc('语言模板'), res.request.responseURL)
      })
    },
    // END
    onSubmit() {
      this.getLangerList()
    },
    // END
    // 基于某行删除
    onDelete (row) {
      const ids = []
      ids.push(row.id)
      this.$confirm(this.$i18n.tc('此操作将永久删除该数据, 是否继续?', '提示'), {
        confirmButtonText: this.$i18n.tc('确定'),
        cancelButtonText: this.$i18n.tc('取消'),
        type: 'warning'
      }).then(async () => {
        try {
          await this.$api.system.lang.remove(ids)
          this.message.success(this.$i18n.tc('删除成功'))
          this.getLangerList()
        } finally {
          this.deleteTreeLoading = false
        }
      }).catch()
    },
    // END
    // 新增
    addTable () {
      this.form = null
      this.lang.visible = true
    },
    // END
    // 修改
    updateTable () {
      [this.form] = this.currentSelection
      this.lang.visible = true
    },
    onEdit(row) {
      this.form = row
      this.lang.visible = true
    },
    // END
    // 删除
    async deleteTable () {
      const id = []
      // 将每行的id存入数组
      if (this.currentSelection) {
        this.currentSelection.map((item) => {
          if (item.id) {
            id.push(item.id)
          }
          return id
        })
      }
      this.$confirm(this.$i18n.tc('此操作将永久删除该数据, 是否继续?', '提示'), {
        confirmButtonText: this.$i18n.tc('确定'),
        cancelButtonText: this.$i18n.tc('取消'),
        type: 'warning'
      }).then(async () => {
        // 删除loading
        this.deleteLoading = true
        try {
          await this.$api.system.lang.remove(id)
          this.message.success(this.$i18n.tc('删除成功'))
          this.getLangerList()
        } finally {
          this.deleteLoading = false
        }
      }).catch()
    },
    // END
    // 查询
    async getLangerList (searchForm = this.searchForm) {
      this.options.loading = true
      try {
        const res = await this.$api.system.lang.list({
          ...searchForm,
          pageNum: this.pageVo.currentPage,
          pageSize: this.pageVo.pageSize
        })
        this.list = res.rows
        this.pageVo.total = res.total
      } finally {
        this.options.loading = false
      }
    },
    // 条件筛选
    onSearch () {
      this.pageVo.currentPage = 1
      this.getLangerList(this.searchForm)
    },
    // END
    // 清空
    onClear () {
      for (const i in this.searchForm) {
        this.searchForm[i] = null
      }
      this.pageVo.currentPage = 1
      this.getLangerList(this.searchForm)
    },
    // END
    // 页码改变
    handleCurrentChange (val) {
      this.pageVo.currentPage = val
      this.getLangerList()
    },
    handleSizeChange (val) {
      this.pageVo.pageSize = val
      this.getLangerList()
    },
    handleSelectionChange (val) {
      this.currentSelection = val
    },
    // END
    // 计算表格高度
    computedTableHeight () {
      this.$nextTick(() => {
        this.$set(this.options, 'height', this.$Utils.setTableHeight(this))
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.condition-search-form {
  text-align: left;
}
.receiptManagement {
  padding: 10px;
  box-sizing: border-box;
  .receiptManagement-container {
    padding: 10px;
    margin: 6px 0 0;
    background: #fff;
  }
}
.toolbar {
    margin-top: 0;
}
.upload {
    display: inline-block;
    margin: 0 10px;
}
.dialog {
  /deep/ .el-dialog__body {
    padding: 0 10px 10px;
  }
}
</style>
