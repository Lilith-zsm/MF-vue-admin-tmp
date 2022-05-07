<template>
  <div class="common-wrap">
    <condition-form
      ref="conditionForm"
      v-model="searchForm"
      :form-data="formData"
    />
    <div class="common-box">
      <el-row>
        <el-col :span="5">
          <div class="title">主类别维护</div>
          <el-input
            v-model="filterText"
            size="mini"
            style="width: 90%;"
            placeholder="输入关键字进行过滤"
          />
          <el-tree
            ref="tree"
            height="100px"
            style="width: 90%; margin-top:10px;"
            class="filter-tree"
            :data="data"
            :props="defaultProps"
            default-expand-all
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
          />
        </el-col>
        <el-col :span="19">
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
              @click="addMain"
            ><i class="el-icon-plus" /> {{ $t('新增主类别') }}</el-button>
            <el-button
              type="success"
              @click="addSub"
            ><i class="el-icon-plus" /> {{ $t('新增子类别') }}</el-button>
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
        </el-col>
      </el-row>
    </div>
    <add-main
      v-if="mainVisible"
      :visible.sync="mainVisible"
      :order-list="mainForm"
      @onSubmit="onSubmitMain"
    />
    <add-sub
      v-if="subVisible"
      :form="subForm"
      :main-name="searchForm.mainName"
      :main-code="searchForm.mainCode"
      :visible.sync="subVisible"
      @onSubmit="onSubmit"
    />
  </div>
</template>
<script>
import addMain from './addMain'
import addSub from './addSub'
import { getLookUpTree, getLookUpSub, deleteEmpInfo } from '@/api/common/base/lookUp'
import conditionForm from '@/components/conditionForm'

export default {
  name: 'LookUp',
  components: {
    addMain,
    addSub,
    conditionForm
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      data: [], // 树形数据
      filterText: '',
      roleBindvisible: false,
      deleteLoading: false,
      websiteTableVisible: false,
      formData: [
        {
          type: '',
          label: '',
          prop: 'phone',
          xl: 5,
          lg: 5,
          md: 5,
          sm: 5
        },
        {
          type: 'label_input',
          label: '子类别编号',
          prop: 'subCode'
        },
        {
          type: 'label_input',
          label: '子类别名称',
          prop: 'subName'
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
        // {
        //   label: '主类别编号',
        //   prop: 'empCode'
        // },
        // {
        //   label: '主类别名称（中）',
        //   prop: 'loginAccount'
        // },
        // {
        //   label: '主类别名称（英）',
        //   prop: 'empName'
        // },
        // {
        //   label: '主类别名称（泰）',
        //   prop: 'empNameEn'
        // },
        {
          label: '子类别编号',
          prop: 'subCode',
          width: '150'
        },
        {
          label: '子类别名称（中）',
          prop: 'subName',
          width: '150'
        },
        {
          label: '子类别名称（英）',
          prop: 'subNameEn',
          width: '150'
        },
        {
          label: '子类别名称（泰）',
          prop: 'subNameTh',
          width: '150'
        },
        {
          label: '值',
          prop: 'subValue',
          width: '150'
        },
        {
          label: '备注',
          prop: 'remark',
          width: '150'
        },
        {
          label: '启用标识',
          prop: 'status',
          width: '150',
          render: (h, params) => {
            return (
              <div>
                { params.row.status === '1' ? <el-tag type='success'>Y</el-tag>
                  : <el-tag type='info'>N</el-tag>}
              </div>
            )
          }
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
                <el-button icon='el-icon-delete' circle title={this.$i18n.tc('删除')} type='danger' plain onClick={() => this.onDelete(params.row)}></el-button>
              </div>
            )
          }
        }
      ],
      currentSelection: [],
      loading: false,
      searchForm: {},
      mainForm: {},
      subForm: {}
    }
  },
  watch: {
    filterText(val) {
      console.log(val)
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
    this.getLookUpTree()
    // this.getContractingList(this.searchForm)
  },
  methods: {
    // 树形选中
    handleNodeClick(data) {
      console.log(data, 'data')
      this.$set(this.searchForm, 'mainName', data.mainName)
      this.$set(this.searchForm, 'mainCode', data.mainCode)
      this.getContractingList(this.searchForm)
    },
    // 初始化树形
    async getLookUpTree() {
      const res = await getLookUpTree()
      if (res.code === 200) {
        // this.data = res.rows
        res.rows.forEach(item => {
          this.data.push({ id: item.id, mainName: item.mainName, mainCode: item.mainCode, label: item.mainName + '　' + item.mainCode, children: [] })
        })
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
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
    // 新增主类别
    addMain() {
      this.mainForm = null
      this.mainVisible = true
    },
    addSub() {
      this.subForm = null
      this.subVisible = true
    },
    // END
    // 编辑
    onEdit(row) {
      this.subForm = row
      this.subVisible = true
    },
    onSubmitMain() {
      this.getLookUpTree()
    },
    // END
    onSubmit() {
      this.getContractingList(this.searchForm)
    },
    // 查询方法
    getContractingList(searchForm = this.searchForm) {
      this.options.loading = true
      getLookUpSub({
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
/deep/ .el-tree{
  height: calc(100vh - (268px));
  overflow: auto;
}
.title {
  margin-bottom: 10px;
 // margin-top: 10px;
  margin-left: 10px;
  color: #606266;
  font-weight: 700;
}
</style>
