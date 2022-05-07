<!--
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-04-01 11:16:59
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-04-02 16:29:19
-->
<template>
  <div class="common-wrap">
    <div class="common-box">
      <div class="con-button-rows">
        <el-button type="success" icon="el-icon-plus" @click="handleInsertTable()">新增</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="getSubList()">刷新</el-button>
      </div>
      <m-table
        ref="commonTable"
        :data-source="dataSource"
        :loading="tableLoading"
        :edit-config="{
          trigger: 'manual',
          mode: 'row',
          showStatus: true,
        }"
        :edit-rules="editRules"
        :page-vo="pageVo"
        :columns="columns"
        @handleSelectionChange="handleSelectionChange"
        @handlePageChange="handlePageChange"
      />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dataSource: [],
      tableLoading: false,
      pageVo: {
        total: 0,
        pageSize: 50,
        currentPage: 1
      },
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
          field: 'subCode',
          title: '子类别编号',
          filters: [{ data: { type: 'text' }}],
          filterRender: {
            name: 'FilterInput'
          },
          params: {
            handleSearch: (data) => {
              this.searchForm.subCode = data
              this.handleSearch()
            }
          },
          width: 120
        },
        {
          field: 'subName',
          title: '子类别名称（中）',
          editRender: { attrs: { placeholder: '请输入名称' }},
          slots: { edit: 'input_edit' },
          filters: [{ data: { type: 'text' }}],
          filterRender: {
            name: 'FilterInput'
          },
          params: {
            handleSearch: (data) => {
              this.searchForm.subName = data
              this.handleSearch()
            }
          },
          width: 240
        },
        {
          field: 'subNameEn',
          title: '子类别名称（英）',
          editRender: {},
          slots: { edit: 'input_edit' },
          filters: [{ data: { type: 'text' }}],
          filterRender: {
            name: 'FilterInput'
          },
          params: {
            handleSearch: (data) => {
              this.searchForm.subNameEn = data
              this.handleSearch()
            }
          },
          width: 240
        },
        {
          field: 'subNameTh',
          title: '子类别名称（印尼）',
          editRender: {},
          slots: { edit: 'input_edit' },
          filters: [{ data: { type: 'text' }}],
          filterRender: {
            name: 'FilterInput'
          },
          params: {
            handleSearch: (data) => {
              this.searchForm.subNameEn = data
              this.handleSearch()
            }
          },
          width: 240
        },
        {
          field: 'subValue',
          title: '值',
          editRender: {},
          slots: { edit: 'select_edit' },
          params: {
            options: [
              {
                value: '1',
                label: '值1'
              },
              {
                value: '2',
                label: '值2'
              },
              {
                value: '3',
                label: '值3'
              }
            ],
            key: 'value',
            value: 'value',
            label: 'label'
          }
        },
        {
          field: 'remark',
          title: '备注',
          editRender: {},
          slots: { edit: 'input_edit' }
        },
        {
          field: 'createTime',
          title: '时间',
          editRender: {},
          slots: { edit: 'input_edit' },
          params: {
            type: 'datetime'
          }
        },
        {
          field: 'count',
          title: '数量',
          editRender: {},
          slots: { edit: 'input_edit' },
          params: {
            type: 'number'
          }
        },
        {
          field: 'status',
          title: '启用标识',
          slots: { default: 'switch_default' },
          params: {
            openValue: '0',
            closeValue: '1',
            change: ({ value }, row) => {
              this.handleChangeStatus(row, value)
            }
          }
        },
        {
          title: '操作',
          field: 'operation',
          width: 50,
          fixed: 'right',
          slots: { default: 'operation_default' },
          params: [
            {
              title: '编辑',
              saveTitle: '保存',
              type: 'success',
              icon: 'el-icon-edit',
              saveIcon: 'el-icon-document-checked',
              click: async (row, status) => {
                if (!status) {
                  this.$refs.commonTable.editRowEvent(row)
                } else {
                  const errMap = await this.$refs.commonTable.$refs.xGrid.validate(row).catch(errMap => errMap)
                  if (errMap) {
                    this.message.error('校验不通过')
                  } else {
                    this.handleSaveEdit(row)
                  }
                }
              }
            }
          ]
        }
      ],
      multipleSelection: []
    }
  },
  computed: {
    editRules() {
      return {
        subName: [
          { required: true, message: '子类别名称必须填写' }
        ]
      }
    }
  },
  mounted() {
    this.getSubList()
  },
  methods: {
    // 根据主类获取子类
    async getSubList() {
      const postForm = {
        ...this.searchForm,
        pageNum: this.pageVo.currentPage,
        pageSize: this.pageVo.pageSize
      }
      this.tableLoading = true
      try {
        const res = await this.$api.common.dictionary.getSubByMain({ mainCode: '002', ...postForm })
        this.dataSource = res.rows
        this.pageVo.total = res.total
      } finally {
        this.tableLoading = false
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 分页
    handlePageChange(val) {
      const { currentPage, pageSize } = val
      this.pageVo.currentPage = currentPage
      this.pageVo.pageSize = pageSize
      this.getSubList()
    },
    async handleSaveEdit(row) {
      this.message.success('保存成功')
      this.getSubList()
    },
    async handleInsertTable(row) {
      const $grid = this.$refs.commonTable.$refs.xGrid
      const record = {
        status: '0'
      }
      const { row: newRow } = await $grid.insertAt(record, row)
      await $grid.setActiveCell(newRow, 'subName')
    }
  }
}
</script>
