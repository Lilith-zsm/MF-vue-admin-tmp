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
          :disabled="currentSelection.length < 1 || currentSelection.length > 1"
          @click="addReview"
        ><i class="el-icon-plus" /> {{ $t('审核/补充信息') }}</el-button>
        <el-button
          type="success"
          :disabled="currentSelection.length < 1 || currentSelection.length > 1"
          @click="onBackReview"
        ><i class="el-icon-money" /> {{ $t('返审') }}</el-button>
        <el-button type="info" @click="onExport"><i class="el-icon-download" /> {{ $t('导出') }}</el-button>
        <el-button type="info"><i class="el-icon-upload2" /> {{ $t('导入') }}</el-button>
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
    <!-- 查看 -->
    <add
      v-if="customerProfileVisible"
      :form="form"
      :visible.sync="customerProfileVisible"
      @onSubmit="onSubmit"
    />
    <!-- 编辑 -->
    <edit
      v-if="customerProfileEditVisible"
      :form="form"
      :visible.sync="customerProfileEditVisible"
      @onSubmit="onSubmit"
    />
    <!-- 审核 -->
    <review
      v-if="customerProfileReviewVisible"
      :form="form"
      :visible.sync="customerProfileReviewVisible"
      @onSubmit="onSubmit"
    />
  </div>
</template>
<script>
import add from './add'
import edit from './edit'
import review from './review'
import { getSupplierList, deleteSupplier, exportSupplier, putSupplierBackReview } from '@/api/common/base/supplier'
import conditionForm from '@/components/conditionForm'

export default {
  name: 'Supplier',
  components: {
    add,
    edit,
    review,
    conditionForm
  },
  data() {
    return {
      customerProfileReviewVisible: false,
      customerProfileEditVisible: false,
      customerProfileVisible: false,
      formData: [
        {
          type: 'label_input',
          label: '供应商编号',
          prop: 'supplierCode'
        },
        {
          type: 'label_input',
          label: '公司名称',
          prop: 'companyName'
        },
        {
          type: 'label_input',
          label: '姓名名称',
          prop: 'personName'
        },
        {
          type: 'label_select',
          label: '认证状态',
          options: [
            {
              label: '待审核',
              value: '1'
            },
            {
              label: '未提交认证',
              value: '2'
            },
            {
              label: '认证通过',
              value: '3'
            },
            {
              label: '认证拒绝',
              value: '4'
            }
          ],
          prop: 'statusCode'
        },
        {
          type: 'label_select',
          label: '客户类型',
          options: [
            {
              label: '个人用户',
              value: '1'
            },
            {
              label: '企业用户',
              value: '2'
            }
          ],
          prop: 'customerTypeCode'
        }
      ],
      mainVisible: false,
      subVisible: false,
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
          label: ' 供应商编号',
          prop: 'supplierCode',
          width: '150'
        },
        {
          label: '公司名称',
          prop: 'companyName',
          width: '150'
        },
        {
          label: '客户类型',
          prop: 'customerTypeName',
          width: '150'
        },
        {
          label: '姓名（中）',
          prop: 'personName',
          width: '150'
        },
        {
          label: '法人名称（中）',
          prop: 'legalPerson',
          width: '150'
        },
        // {
        //   label: '姓名（泰）',
        //   prop: 'customerNameTha',
        //   width: '150'
        // },
        {
          label: '认证状态',
          prop: 'statusName',
          width: '150'
        },
        {
          label: '登录用户名',
          prop: 'loginUserName',
          width: '150'
        },
        {
          label: '密码',
          prop: 'loginPassword',
          width: '150'
        },
        {
          label: '联系电话',
          prop: 'contactPhone',
          width: '150'
        },
        {
          label: '手机号码',
          prop: 'mobilePhone',
          width: '150'
        },
        {
          label: '行业信息',
          prop: 'industryInformationName',
          width: '150'
        },
        {
          label: '证件类型',
          prop: 'certificateTypeName',
          width: '150'
        },
        {
          label: '证件编号',
          prop: 'certificateNumber',
          width: '150'
        },
        {
          label: '公司地址',
          prop: 'address',
          width: '150'
        },
        {
          label: '注册时间',
          prop: 'createTime',
          width: '150'
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
                <el-button icon='el-icon-view' circle title={this.$i18n.tc('查看')} onClick={() => this.onView(params.row)} type='primary' plain />
                <el-button icon='el-icon-edit' circle title={this.$i18n.tc('修改')} type='success' plain onClick={() => this.onEdit(params.row)}></el-button>
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
  watch: {
    filterText(val) {
      console.log(val)
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
    this.getContractingList(this.searchForm)
  },
  methods: {
    // 返审
    async onBackReview() {
      const [formData] = this.currentSelection
      this.$confirm(this.$i18n.tc('此操作将对该数据返审, 是否继续?', '提示'), {
        confirmButtonText: this.$i18n.tc('确定'),
        cancelButtonText: this.$i18n.tc('取消'),
        type: 'warning'
      }).then(async() => {
        const res = await putSupplierBackReview({
          id: formData.id,
          statusName: formData.statusName,
          statusCode: formData.statusCode
        })
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
          message: this.$i18n.tc('已取消返审')
        })
      })
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
      exportSupplier({ id }).then((res) => {
        this.$Utils.exportFile(this.$i18n.tc('供应商资料导出'), res.request.responseURL)
      })
    },
    // END
    // 审核
    addReview() {
      [this.form] = this.currentSelection
      this.customerProfileReviewVisible = true
    },
    // 查看
    onView(row) {
      this.form = row
      this.customerProfileVisible = true
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
        const res = await deleteSupplier(id)
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
    addTable() {
      this.form = null
      this.customerProfileVisible = true
    },
    // END
    // 编辑
    onEdit(row) {
      this.form = row
      this.customerProfileEditVisible = true
    },
    // END
    onSubmit() {
      this.getContractingList(this.searchForm)
    },
    // 查询方法
    getContractingList(searchForm = this.searchForm) {
      this.options.loading = true
      getSupplierList({
        ...searchForm,
        current: this.pageVo.currentPage,
        size: this.pageVo.pageSize
      }).then((res) => {
        if (res.code === 200) {
          this.dataSource = res.data.records
          this.pageVo.total = res.data.total
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
    }
    // END
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
.title {
  margin-bottom: 10px;
 // margin-top: 10px;
  margin-left: 10px;
  color: #606266;
  font-weight: 700;
}
</style>
