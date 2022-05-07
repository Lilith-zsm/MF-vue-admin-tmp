<template>
  <div class="common-wrap">
    <condition-form
      ref="conditionForm"
      v-model="searchForm"
      :form-data="formData"
    />
    <div class="common-box">
      <div id="common-operation-btns">
        <el-button
          type="primary"
          @click="onSearch"
        ><i class="el-icon-search" /> {{ $t('查询') }}</el-button>
        <el-button
          type="danger"
          @click="onClear"
        ><i class="el-icon-close" /> {{ $t('清空') }}</el-button>
        <el-button
          type="success"
          @click="addTable"
        ><i class="el-icon-plus" /> {{ $t('新增') }}</el-button>
        <el-button
          type="warning"
          @click="onRoleBind"
        ><i class="el-icon-folder-checked" /> {{ $t('角色绑定') }}</el-button>
      </div>
      <my_table
        ref="comTable"
        :data-source="dataSource"
        :options="options"
        :operates="operates"
        :page-vo="pageVo"
        :columns="columns"
        @handleSelectionChange="handleSelectionChange"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      />
    </div>
    <add
      v-if="order.visible"
      :visible.sync="order.visible"
      :order-list="form"
      @onSubmit="onSubmit"
    />
    <role-bind
      v-if="roleBindvisible"
      :visible.sync="roleBindvisible"
      @onSubmit="onSubmit"
    />
  </div>
</template>
<script>
import add from './add'
import roleBind from './roleBind'
import { getEmpInfoList, deleteEmpInfo, updatePassword, updateEmpInfo } from '@/api/common/base/empInfo'
import conditionForm from '@/components/conditionForm'

export default {
  name: 'EmpInfo',
  components: {
    add,
    roleBind,
    conditionForm
  },
  data() {
    return {
      roleBindvisible: false,
      deleteLoading: false,
      websiteTableVisible: false,
      formData: [
        {
          type: 'label_input',
          label: '账号',
          prop: 'loginAccount'
        },
        {
          type: 'label_input',
          label: '姓名',
          prop: 'empName'
        },
        {
          type: 'label_input',
          label: '手机号码',
          prop: 'phone'
        },
        {
          type: 'label_select',
          label: '所属部门',
          options: [
            {
              label: '项目部',
              value: '01'
            },
            {
              label: '研发部',
              value: '02'
            }
          ],
          prop: 'belongDeptCode'
        }
      ],
      order: {
        visible: false
      },
      options: {
        stripe: true, // 是否为斑马纹 table
        loading: false, // 是否添加表格loading加载动画
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        serial: true, // 是否支持序号
        mutiSelect: true // 是否支持列表项选中功能
      }, // table 的参数
      dataSource: [],
      // tab的分页控制
      pageVo: {
        pageSize: 15,
        total: 0,
        currentPage: 1,
        status: true
      },
      operates: {
        type: 'success',
        width: '100',
        fixed: 'right',
        show: true
      },
      columns: [
        {
          label: '序号',
          prop: 'ids'
        },
        {
          label: '员工编号',
          prop: 'empCode'
        },
        {
          label: '账号',
          prop: 'loginAccount'
        },
        {
          label: '中文姓名',
          prop: 'empName'
        },
        {
          label: '英文姓名',
          prop: 'empNameEn'
        },
        {
          label: '泰文姓名',
          prop: 'empNameTh'
        },
        {
          label: '昵称',
          prop: 'nickName'
        },
        {
          label: '用户状态',
          prop: 'userStatus',
          render: (h, params) => {
            return (
              <div>
                <el-switch
                  v-model={params.row.userStatus}
                  active-color='#13ce66'
                  active-value='1'
                  inactive-value='0'
                  onChange={() => this.onChangeSwitch(params.row)}
                  inactive-color='#ff4949'>
                </el-switch>
              </div>
            )
          }
        },
        {
          label: '所属网点',
          prop: 'belongSiteName'
        },
        {
          label: '岗位',
          prop: 'postName'
        },
        {
          label: '手机号码',
          prop: 'phone'
        },
        {
          label: '邮箱地址',
          prop: 'email'
        },
        {
          label: '角色权限',
          prop: 'roleName'
        },
        // {
        //   label: '员工类型',
        //   prop: 'documentaryType',
        //   formatter: (row) => {
        //     if (row.documentaryType === '1') {
        //       return this.$i18n.tc('中国跟单')
        //     } else if (row.documentaryType === '2') {
        //       return this.$i18n.tc('物流跟单')
        //     } else if (row.documentaryType === '3') {
        //       return this.$i18n.tc('泰国客服')
        //     }
        //   }
        // },
        {
          label: '创建时间',
          prop: 'createTime'
        },
        {
          prop: 'controlBtn',
          label: '操作',
          align: 'center',
          fixed: 'right',
          width: '160',
          render: (h, params) => {
            return (
              <div>
                <el-button icon='el-icon-edit' circle title={this.$i18n.tc('修改')} type='success' plain onClick={() => this.onEdit(params.row)}></el-button>
                <el-button icon='el-icon-refresh-right' circle title={this.$i18n.tc('重置密码')} type='warning' plain onClick={() => this.onEditPassword(params.row)}></el-button>
                <el-button icon='el-icon-delete' circle title={this.$i18n.tc('删除')} type='danger' plain onClick={() => this.onDelete(params.row)}></el-button>
              </div>
            )
          }
        }
      ],
      currentSelection: [],
      loading: false,
      searchForm: {},
      form: {}
    }
  },
  mounted() {
    this.getContractingList(this.searchForm)
    this.computedTableHeight()
  },
  methods: {
    async onChangeSwitch(row) {
      const res = await updateEmpInfo({ id: row.id, userStatus: row.userStatus })
      if (res.code) {
        this.$message({
          message: this.$i18n.tc(res.msg),
          type: 'success'
        })
        this.getContractingList(this.searchForm)
      }
    },
    // 角色绑定
    onRoleBind() {
      this.roleBindvisible = true
    },
    // 重置密码
    async onEditPassword(row) {
      this.$confirm(this.$i18n.tc('此操作将重置密码, 是否继续?', '提示'), {
        confirmButtonText: this.$i18n.tc('确定'),
        cancelButtonText: this.$i18n.tc('取消'),
        type: 'warning'
      }).then(async() => {
        const res = await updatePassword({ id: row.id, userId: row.userId, loginAccount: row.loginAccount })
        if (res.code) {
          this.$message({
            message: this.$i18n.tc(res.msg),
            type: 'success'
          })
          this.getContractingList(this.searchForm)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$i18n.tc('已取消重置')
        })
      })
    },
    // 删除
    onDelete(row) {
      this.$confirm(this.$i18n.tc('此操作将永久删除该数据, 是否继续?', '提示'), {
        confirmButtonText: this.$i18n.tc('确定'),
        cancelButtonText: this.$i18n.tc('取消'),
        type: 'warning'
      }).then(async() => {
        // ids = id;
        const id = []
        id.push(row.id)
        const res = await deleteEmpInfo(id)
        if (res.code === 200) {
          this.$message({
            message: this.$i18n.tc(res.msg),
            type: 'success'
          })
          this.getContractingList(this.searchForm)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$i18n.tc('已取消删除')
        })
      })
    },
    // END
    // 新增
    addTable() {
      this.form = null
      this.order.visible = true
    },
    // END
    // 编辑
    onEdit(row) {
      this.form = row
      this.order.visible = true
    },
    // END
    onSubmit() {
      this.getContractingList(this.searchForm)
    },
    // 查询方法
    getContractingList(searchForm = this.searchForm) {
      this.options.loading = true
      getEmpInfoList({
        ...searchForm,
        pageNum: this.pageVo.currentPage,
        pageSize: this.pageVo.pageSize
      }).then((res) => {
        if (res.code === 200) {
          this.dataSource = res.rows
          this.pageVo.total = res.total
          this.options.loading = false
        }
      })
    },
    // END
    // 筛选查询
    onSearch() {
      this.pageVo.currentPage = 1
      this.getContractingList(this.searchForm)
    },
    // 点击清空
    onClear() {
      for (const i in this.searchForm) {
        this.searchForm[i] = null
      }
      this.pageVo.currentPage = 1
      this.getContractingList(this.searchForm)
    },
    // END
    // 页码改变
    handleCurrentChange(val) {
      this.pageVo.currentPage = val
      this.getContractingList(this.searchForm)
    },
    handleSizeChange(val) {
      this.pageVo.pageSize = val
      this.getContractingList(this.searchForm)
    },
    handleSelectionChange(val) {
      this.currentSelection = val
    },
    // END
    // 计算表格高度
    computedTableHeight() {
      this.$nextTick(() => {
        this.$set(this.options, 'height', this.$Utils.setTableHeight(this))
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.condition-search-form {
  text-align: left;
}
.order-page {
  padding: 20px 15px;
  .my_Table {
    background: white;
    padding: 25px;
    min-height: 56vh;
  }
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
</style>
