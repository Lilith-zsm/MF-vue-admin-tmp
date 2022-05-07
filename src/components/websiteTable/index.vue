<template>
  <div id="websiteContent">
    <base-dialog
      :title="$t('组织架构列表')"
      :visible.sync="dialogVisible"
      width="800px"
      center
    >
      <condition-form
        ref="conditionForm"
        v-model="searchForm"
        label-width="100px"
        :form-data="formData"
        :form-property="formProperty"
      />
      <el-row style="margin-bottom: 10px">
        <el-col :span="20" style="text-align: left;margin-left: 20px;">
          <el-button type="primary" @click="onSearch"><i class="el-icon-search" /> {{ $t('查询') }}</el-button>
          <el-button type="danger" @click="onClear"><i class="el-icon-close" /> {{ $t('清空') }}</el-button>
          <el-button v-if="mutiSelect" :disabled="!multipleSelection.length" type="success" @click="onSubmit"><i class="el-icon-check" /> {{ $t('确定') }}</el-button>
        </el-col>
      </el-row>
      <my_table
        ref="comTable"
        :data-source="dataSource"
        :options="tableOptions"
        :page-vo="pageVo"
        :columns="tableColumns"
        @handleRowClick="rowClick"
        @handleSelectionChange="handleSelectionChange"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      />
    </base-dialog>
  </div>
</template>

<script>
// import * as _api from '@/api/system/organization'
// import { getSubName } from '@/api/system/other'

export default {
  name: 'WebsiteTable',
  props: {
    visible: {
      type: Boolean
    },
    finCenterFlag: { // 财务中心标识
      type: Number,
      default: () => {
        return null
      }
    },
    allocateCenterFlag: { // 分拨中心标识
      type: Number,
      default: () => {
        return null
      }
    },
    allSiteFlag: { // 值为true则默认查询全部网点
      type: Boolean,
      default: () => {
        return false
      }
    },
    parentSiteFlag: { // 值为true则默认查询结果包含父网点
      type: Boolean,
      default: () => {
        return false
      }
    },
    parentId: { // 父级网点id
      type: String,
      default: () => {
        return ''
      }
    },
    siteCode: { // 网点编号
      type: String,
      default: () => {
        return ''
      }
    },
    typeCode: { // 类型
      type: String,
      default: () => {
        return ''
      }
    },
    mutiSelect: { // 是否支持多选
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data() {
    return {
      multipleSelection: [],
      typeArr: [],
      searchForm: {
        parentId: '',
        siteCode: '',
        siteNameChinese: '',
        typeCode: '',
        allocateCenterFlag: '',
        allocateCenterFlagName: '',
        finCenterFlag: '',
        finCenterFlagName: '',
        remark: ''
      },
      filterData: [],
      formProperty: {
        xl: 12,
        lg: 12,
        md: 12,
        sm: 12
      },
      // 查询字段设置
      formData: [
        {
          label: '网点编号',
          type: 'label_input',
          placeholder: '请输入',
          prop: 'siteCode'
        },
        {
          label: '网点名称',
          type: 'label_input',
          placeholder: '请输入',
          prop: 'siteNameChinese'
        },
        {
          label: '类型',
          type: 'label_select',
          placeholder: '请选择',
          prop: 'typeCode',
          disabled: false,
          options: []
        }
      ],
      // 表格初始化
      pageVo: {
        total: 0,
        status: true,
        pageSize: 15,
        currentPage: 1
      },
      // 表格参数配置
      tableOptions: {
        stripe: true, // 是否为斑马纹 table
        loading: false, // 是否添加表格loading加载动画
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        serial: true, // 是否支持序号
        mutiSelect: false, // 是否支持列表项选中功能
        height: '300'
      },
      // 表格展示的列
      tableColumns: [
        {
          prop: 'ids',
          label: '序号',
          align: 'center'
        },
        {
          prop: 'siteCode',
          label: '组织架构编号',
          align: 'center'
        },
        {
          prop: 'siteNameChinese',
          label: '组织架构名称',
          align: 'center'
        },
        {
          prop: 'typeName',
          label: '类型',
          align: 'center'
        }
        // {
        //   prop: 'allocateCenterFlag',
        //   label: '分拨中心标识',
        //   align: 'center',
        //   render: (h, params) => {
        //     return (
        //       <span>
        //         {params.row.allocateCenterFlag === '1' ? (<el-tag type='success'>是</el-tag>) : (<el-tag type='warning'>否</el-tag>)}
        //       </span>
        //     )
        //   }
        // },
        // {
        //   prop: 'finCenterFlag',
        //   label: '财务中心标识',
        //   align: 'center',
        //   render: (h, params) => {
        //     return (
        //       <span>
        //         {params.row.finCenterFlag === '1' ? (<el-tag type='success'>是</el-tag>) : (<el-tag type='warning'>否</el-tag>)}
        //       </span>
        //     )
        //   }
        // }
      ],
      // 表格值集
      dataSource: []
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.tableOptions.mutiSelect = this.mutiSelect
    })
    const userInfo = this.$store.getters.userInfo
    if (this.allSiteFlag) {
      // 直接查询全部网点
      this.searchForm.parentId = ''
    } else {
      if (userInfo.site.typeCode === '001001') {
        // 当前用户是中心时候
        this.searchForm.parentId = userInfo.site.id
      } else {
        this.searchForm.parentId = this.parentId || ''
      }
    }
    this.searchForm.remark = this.parentSiteFlag ? 'include' : ''
    this.searchForm.siteCode = this.siteCode
    if (this.typeCode) {
      this.searchForm.typeCode = this.typeCode
      this.$set(this.formData[2], 'disabled', true)
    }
    if (this.allocateCenterFlag) {
      this.searchForm.allocateCenterFlag = this.allocateCenterFlag
      this.searchForm.allocateCenterFlagName = this.allocateCenterFlag === '1' ? '是' : '否'
    }
    if (this.finCenterFlag) {
      this.searchForm.finCenterFlag = this.finCenterFlag
      this.searchForm.finCenterFlagName = this.finCenterFlag === '1' ? '是' : '否'
    }
    this.getData()
    this.getDataDict()
  },
  methods: {
    // 获取数据字典
    async getDataDict() {
      const str = '001'
      const { data } = await getSubName({
        name: str,
        code: str
      })
      this.typeArr = data['001']
      this.formData[2].options = data['001'].map(it => ({
        value: it.subCode,
        label: it.subName
      }))
    },
    // 查询数据
    async getData() {
      this.tableOptions.loading = true
      const params = {
        ...this.searchForm,
        pageNum: this.pageVo.currentPage,
        pageSize: this.pageVo.pageSize
      }
      const { rows, total } = await _api.alertList(params)
      this.tableOptions.loading = false
      this.dataSource = rows
      this.pageVo.total = total
    },
    // 查询按钮
    onSearch() {
      this.getData()
    },
    // 清空按钮
    onClear() {
      for (const i in this.searchForm) {
        this.searchForm[i] = ''
      }
      this.pageVo.currentPage = 1
      this.getData()
    },
    // 提交按钮
    onSubmit() {
      this.$emit('submit', this.multipleSelection)
    },
    // 页码改变事件
    handleCurrentChange(val) {
      this.pageVo.currentPage = val
      this.getData()
    },
    // 页数改变事件
    handleSizeChange(val) {
      this.pageVo.pageSize = val
      this.getData()
    },
    // 多选框触发事件
    handleSelectionChange(val) {
      console.log('val:', val)
      this.multipleSelection = val
    },
    rowClick(row) {
      if (!this.mutiSelect) {
        // 单选
        this.$emit('submit', row)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding: 0px 0px 20px !important;
}
/deep/ .el-table__body-wrapper {
  max-height: 300px;
  overflow-y: auto;
}
#filter {
  padding: 0px;
  margin-bottom: 0px;
}
.table {
  margin: 0 15px;
}
.search-form{
  padding-right:20px!important;
}
</style>
