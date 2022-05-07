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
          type="danger"
          :disabled="currentSelection.length < 1"
          :loading="deleteLoading"
          @click="deleteTable"
        >
          <i class="el-icon-delete" /> {{ $t('批量删除') }}
        </el-button>
      </div>
      <my_table
        ref="table_liust"
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
    <website-table
      v-if="websiteTableVisible"
      :visible.sync="websiteTableVisible"
      @submit="websiteTableSubmit"
    />
  </div>
</template>
<script>
import websiteTable from '@/components/websiteTable'
import { getAuthorizationList, deleteAuthorization } from '@/api/common/base/authorization'
import add from './add'
import conditionForm from '@/components/conditionForm'

export default {
  name: 'Authorization',
  components: {
    add,
    conditionForm,
    websiteTable
  },
  data() {
    return {
      deleteLoading: false,
      websiteTableVisible: false,
      selectDateType: 'queryDates',
      formData: [
        {
          type: 'label_select',
          label: '查询类型',
          prop: 'flightCode',
          options: []
        },
        {
          type: 'label_select',
          label: '查询值',
          prop: 'flightCode'
        },
        {
          type: 'label_input_clearable',
          label: '所属网点',
          prop: 'flightCode',
          handleClear: () => {

          },
          handleClick: () => {
            this.websiteTableVisible = true
          }
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
          label: '授权品牌编号',
          prop: 'brandCode'
        },
        {
          label: '授权品牌(中)',
          prop: 'brandName'
        },
        {
          label: '授权品牌(英)',
          prop: 'brandNameEn'
        },
        {
          label: '授权品牌(泰)',
          prop: 'brandNameTh'
        },
        {
          label: '授权开始时间',
          prop: 'authStartTime'
        },
        {
          label: '授权结束时间',
          prop: 'authEndTime'
        },
        {
          label: '客户代号',
          prop: 'cusCode'
        },
        {
          label: '客户名称',
          prop: 'cusName'
        },
        {
          label: '备注',
          prop: 'remark',
          width: '180'
        },
        {
          label: '有效状态',
          prop: 'status'
        },
        {
          prop: 'controlBtn',
          label: '操作',
          align: 'center',
          fixed: 'right',
          width: '120',
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
    websiteTableSubmit(val) {
      console.log(val)
      this.websiteTableVisible = false
    },
    // 删除
    deleteTable () {
      // 删除loading
      this.deleteLoading = true
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
        const res = await deleteAuthorization(id)
        if (res.code === 200) {
          this.$message({
            message: this.$i18n.tc(`${res.msg}`),
            type: 'success'
          })
          this.getContractingList(this.searchForm)
          this.deleteLoading = false
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$i18n.tc('已取消删除')
        })
        this.deleteLoading = false
      })
    },
    // END
    // 编辑
    onUpdate() {
      [this.form] = this.currentSelection
      this.order.visible = true
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
        const res = await deleteAuthorization(id)
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
      getAuthorizationList({
        ...searchForm,
        pageNum: this.pageVo.currentPage,
        pageSize: this.pageVo.pageSize
      }).then((res) => {
        if (res.code === 200) {
          this.dataSource = res.rows
          console.log(this.dataSource)
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
