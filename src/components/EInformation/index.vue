<template>
  <div id="websiteContent">
    <base-dialog :title="$t('员工信息')" :visible.sync="dialogVisible" width="800px" center>
      <condition-form ref="conditionForm" v-model="searchForm" label-width="100px" :form-data="formData" />
      <el-row style="margin-bottom: 10px">
        <el-col :span="20" style="text-align: left;margin-left: 20px;">
          <el-button type="primary" @click="getData(searchForm)"><i class="el-icon-search" /> {{ $t('查询') }}</el-button>
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
    <!-- 网点表格 -->
    <website-table v-if="websiteTableVisible" :visible.sync="websiteTableVisible" @submit="websiteTableSubmit" />
  </div>
</template>

<script>
import websiteTable from '@/components/websiteTable'
import * as _api from '@/api/common/base/empInfo'
import store from '@/store'
export default {
  name: 'EInformation',
  components: {
    websiteTable
  },
  props: {
    visible: {
      type: Boolean
    },
    // blongCode: { // 传入网点编码
    //   type: String,
    //   default: function () {
    //     return store.state.user.userInfo.site.siteCode
    //   }
    // },
    mutiSelect: { // 是否支持多选
      type: Boolean,
      default: () => {
        return false
      }
    },
    // 支持网点编码选择
    websiteSelect: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    // 查询所有数据
    allData: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    documentaryType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 多选数据
      multipleSelection: [],
      searchForm: {},
      // 查询设置
      filterTitle: {
        title: '',
        form_width: '90px'
      },
      // 查询字段设置
      formData: [
        {
          label: '员工姓名：',
          type: 'label_input',
          placeholder: '请输入',
          prop: 'empName',
          xl: 8,
          lg: 8,
          md: 8,
          sm: 8
        },
        {
          label: '员工编号： ',
          type: 'label_input',
          placeholder: '请输入',
          prop: 'empCode',
          xl: 8,
          lg: 8,
          md: 8,
          sm: 8
        }
        // {
        //   label: '网点编码：',
        //   type: 'label_input_clearable',
        //   placeholder: '请输入',
        //   prop: 'blongCode',
        //   disabled: true,
        //   onClick: (val) => {
        //     console.log(val)
        //     this.websiteTableVisible = true
        //   },
        //   xl: 8,
        //   lg: 8,
        //   md: 8,
        //   sm: 8
        // }
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
        height: '300px',
        stripe: true, // 是否为斑马纹 table
        loading: false, // 是否添加表格loading加载动画
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        serial: true, // 是否支持序号
        mutiSelect: false // 是否支持列表项选中功能
      },
      // 表格展示的列
      tableColumns: [
        {
          label: '序号',
          prop: 'ids',
          align: 'center'
        },
        {
          prop: 'empCode',
          label: '员工编号',
          align: 'center',
          width: '150px'
        },
        {
          prop: 'empName',
          label: '员工姓名',
          align: 'center'
        }
      ],
      // 表格值集
      dataSource: [],
      // 网点弹框
      websiteTableVisible: false
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
    // 编码默认为当前登录的编码
    // this.$set(this.searchForm, 'blongCode', this.allData ? '' : this.blongCode)
    // this.formData.forEach(item => {
    //   if (item.key === 'blongCode') {
    //     item.Val = this.blongCode
    //   }
    // })
    console.log(store.state.user.userInfo.site.siteCode)
    if (store.state.user.userInfo.site.siteCode === '0000' || this.websiteSelect) {
      this.formData.forEach(item => {
        if (item.prop === 'blongCode') {
          item.disabled = false
        }
      })
      console.log(this.formData)
    }

    this.getData(this.searchForm)
  },
  methods: {
    // 网点弹框
    websiteTableSubmit(val) {
      this.$set(this.searchForm, 'blongCode', val.siteCode)
      this.websiteTableVisible = false
    },
    // 清空按钮
    onClear() {
      for (const i in this.searchForm) {
        this.searchForm[i] = ''
      }
      this.pageVo.currentPage = 1
      this.pageVo.pageSize = 15
      this.getData(this.searchForm)
    },
    // 提交按钮
    onSubmit() {
      this.$emit('submit', this.multipleSelection)
    },
    // 查询数据
    async getData(searchForm) {
      this.tableOptions.loading = true
      const params = {
        ...searchForm,
        documentaryType: this.documentaryType,
        pageNum: this.pageVo.currentPage,
        pageSize: this.pageVo.pageSize
      }
      console.log(params)
      const { rows, total } = await _api.getEmpInfoList(params)
      this.dataSource = rows
      this.pageVo.total = total
      this.tableOptions.loading = false
    },
    // 筛选
    async onFormQuery(formData, status) {
      if (status === 'submit') {
        // 查询按钮
        this.searchForm = formData
        // this.searchForm.parm = 3
        this.getData(this.searchForm)
      } else {
        // 清空
        for (const i in this.formData) {
          this.formData[i].Val = ''
        }
        // this.searchForm = { parm: 3 }
        this.pageVo.currentPage = 1
        const params = {
          pageNum: this.pageVo.currentPage,
          pageSize: this.pageVo.pageSize
        }
        console.log(params)
        const { rows, total } = await _api.getEmpInfoList(params)
        this.dataSource = rows
        this.pageVo.total = total

        // console.log('清空')
        // this.getData(this.searchForm)
      }
    },
    // 页码改变事件
    handleCurrentChange(val) {
      this.pageVo.currentPage = val
      this.getData(this.searchForm)
      // this.$refs.comFilter.submitForm('submit')
    },
    // 页数改变事件
    handleSizeChange(val) {
      this.pageVo.pageSize = val
      this.getData(this.searchForm)
      // this.$refs.comFilter.submitForm('submit')
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
</style>
