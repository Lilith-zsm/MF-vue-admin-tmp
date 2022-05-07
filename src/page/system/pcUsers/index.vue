<!--
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-03-10 13:57:18
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-04-13 14:52:24
-->
<template>
  <div class="common-wrap">
    <el-row :gutter="5">
      <el-col :span="6">
        <website-tree @handleNodeClick="handleNodeClick" />
      </el-col>
      <el-col :span="18">
        <condition-form
          ref="conditionForm"
          v-model="searchForm"
          :form-data="formData"
          @handleSearch="handleSearch"
        />
        <div class="common-box">
          <div class="con-button-rows" />
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
      </el-col>
    </el-row>
    <!-- 绑定角色弹窗 -->
    <bind-dialog
      v-if="bindOptions.visible"
      :visible.sync="bindOptions.visible"
      :bind-type="bindOptions.bindType"
      :t-type="bindOptions.tType"
      :current-user="bindOptions.currentUser"
      @submit="getTableList"
    />
  </div>
</template>
<script>
import websiteTree from '@/components/websiteTree'
import bindDialog from './bindDialog'
export default {
  name: 'SystemPcUsers',
  components: {
    websiteTree,
    bindDialog
  },
  data() {
    return {
      searchForm: {},
      formData: [
        {
          label: '用户账号',
          type: 'label_input',
          placeholder: '请输入',
          prop: 'userName'
        },
        {
          label: '手机号',
          type: 'label_input',
          placeholder: '请输入',
          prop: 'phonenumber'
        }
      ],
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
          field: 'userName',
          title: '用户账号'
        },
        {
          field: 'nickName',
          title: '用户昵称'
        },
        {
          field: 'site.siteCode',
          title: '网点编号'
        },
        {
          field: 'site.siteNameChinese',
          title: '网点名称'
        },
        {
          field: 'phonenumber',
          title: '手机号'
        },
        {
          field: 'pcRoleName',
          title: 'PC角色',
          width: '140px',
          formatter: ({ row }) => {
            return row.roles && row.roles.filter(item => item.type === 1).map(item => item.roleName).join(',')
          }
        },
        {
          field: 'appRoleName',
          title: 'APP角色',
          width: '140px',
          formatter: ({ row }) => {
            return row.roles && row.roles.filter(item => item.type === 2).map(item => item.roleName).join(',')
          }
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: '140px',
          formatter: ({ cellValue }) => {
            return this.$Utils.formatterTimeZones(cellValue)
          }
        },
        {
          field: 'status',
          title: '状态',
          width: '100px'
        },
        {
          title: '操作',
          field: 'operation',
          width: 100,
          slots: { default: 'operation_default' },
          params: [
            {
              title: 'PC',
              type: 'success',
              icon: 'el-icon-monitor',
              click: (row) => {
                this.bindOptions.currentUser = row
                // 绑定PC角色
                this.bindOptions.bindType = 'pc'
                this.bindOptions.visible = true
                this.bindOptions.tType = 1
              }
            },
            {
              title: 'APP',
              type: 'primary',
              icon: 'el-icon-mobile',
              loading: false,
              click: (row) => {
                this.bindOptions.currentUser = row
                // 绑定APP角色
                this.bindOptions.bindType = 'app'
                this.bindOptions.visible = true
                this.bindOptions.tType = 2
              }
            }
          ]
        }
      ],
      currentSite: {},
      // 绑定角色弹窗
      bindOptions: {
        visible: false,
        currentUser: {},
        tType: 1, // 类型：1-PC，2-APP,3-VIP
        bindType: 'pc'
      }
    }
  },
  mounted() {
    this.getTableList()
  },
  methods: {
    // 获取表格数据
    async getTableList() {
      this.tableLoading = true
      try {
        const { rows, total } = await this.$api.system.user.list({
          siteCode: this.currentSite.code,
          userType: this.$store.getters.userType,
          ...this.searchForm,
          pageNum: this.pageVo.currentPage,
          pageSize: this.pageVo.pageSize
        })
        this.dataSource = rows
        this.pageVo.total = total
      } finally {
        this.tableLoading = false
      }
    },
    handleSearch() {
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
    },
    handleNodeClick(val) {
      this.currentSite = { ...val }
      this.handleSearch()
    }
  }
}
</script>
