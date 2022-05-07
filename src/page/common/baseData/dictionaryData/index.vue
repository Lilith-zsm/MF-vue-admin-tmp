<!--
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-03-10 13:57:18
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-03-28 11:17:56
-->
<template>
  <div class="common-wrap">
    <el-row :gutter="5">
      <el-col :span="6">
        <website-tree
          :tree-cus-data="treeData"
          :cus-loading="loading"
          :operation="treeOperation"
          @handleNodeClick="handleNodeClick"
        >
          <el-button slot="tree-add-button" type="success" icon="el-icon-plus" @click="handleAddMain">新增</el-button>
        </website-tree>
      </el-col>
      <el-col :span="18">
        <div class="common-box">
          <div class="con-button-rows">
            <el-button type="primary" :disabled="!subOptions.mainCode" :loading="tableLoading" icon="el-icon-refresh" @click="getSubList()">刷新</el-button>
            <el-button type="success" :disabled="!subOptions.mainCode" icon="el-icon-plus" @click="handleInsertTable()">新增</el-button>
            <el-button type="danger" :disabled="!subOptions.mainCode && multipleSelection.length > 0" icon="el-icon-delete">删除</el-button>
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
      </el-col>
    </el-row>
    <!-- 主类别 -->
    <editMain v-if="editMainOptions.visible" :visible.sync="editMainOptions.visible" :edit-data="editMainOptions.editData" @handleSuccess="getMainData" />
  </div>
</template>
<script>
import websiteTree from '@/components/websiteTree'
import editMain from './editMain'
export default {
  name: 'DictionaryData',
  components: {
    websiteTree,
    editMain
  },
  data() {
    return {
      searchForm: {},
      treeOperation: {
        data: [
          {
            title: '编辑',
            icon: 'el-icon-edit',
            handleClick: (row) => {
              this.editMainOptions.editData = { ...row }
              this.editMainOptions.visible = true
            }
          },
          {
            title: '删除',
            icon: 'el-icon-delete',
            handleClick: (row) => {
              this.$confirm(`即将删除“${row.mainName}”主类, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(async () => {
                await this.$api.common.dictionary.deleteMain([row.id])
                this.message.success('删除成功')
                this.getMainData()
              })
            }
          }
        ],
        width: 80,
        showTreeBtn: true
      },
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
          slots: { edit: 'input_edit' }
        },
        {
          field: 'remark',
          title: '备注',
          editRender: {},
          slots: { edit: 'input_edit' }
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
      subOptions: {},
      loading: false,
      treeData: [],
      editRules: {
        subName: [
          { required: true, message: '子类别名称必须填写' }
        ]
      },
      multipleSelection: [],
      editMainOptions: {
        visible: false,
        editData: {}
      }
    }
  },
  mounted() {
    this.getMainData()
  },
  methods: {
    // 获取主类（树形）列表
    async getMainData() {
      this.loading = true
      try {
        const res = await this.$api.common.dictionary.mainList()
        this.treeData = res.rows.map(item => ({
          ...item,
          label: `${item.mainName} （${item.mainCode}）`
        }))
      } finally {
        this.loading = false
      }
    },
    // 根据主类获取子类
    async getSubList() {
      const postForm = {
        ...this.searchForm,
        pageNum: this.pageVo.currentPage,
        pageSize: this.pageVo.pageSize
      }
      this.tableLoading = true
      try {
        const res = await this.$api.common.dictionary.getSubByMain({ mainCode: this.subOptions.mainCode, ...postForm })
        this.dataSource = res.rows
        this.pageVo.total = res.total
      } finally {
        this.tableLoading = false
      }
    },
    handleSearch() {
      this.pageVo.currentPage = 1
      this.getSubList()
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
    handleNodeClick(val) {
      this.subOptions = { ...val }
      this.handleSearch()
    },
    async handleChangeStatus(row) {
      await this.$api.common.dictionary.addEditMain(row)
      this.message.success('修改成功')
    },
    async handleSaveEdit(row) {
      this.tableLoading = true
      try {
        await this.$api.common.dictionary.addEditMain(row)
        this.message.success('保存成功')
        this.getSubList()
      } catch {
        this.tableLoading = false
      }
    },
    async handleInsertTable(row) {
      const $grid = this.$refs.commonTable.$refs.xGrid
      const record = {
        status: '0'
      }
      const { row: newRow } = await $grid.insertAt(record, row)
      await $grid.setActiveCell(newRow, 'subName')
    },
    handleAddMain() {
      this.editMainOptions.editData = {}
      this.editMainOptions.visible = true
    }
  }
}
</script>
