<template>
  <div id="websiteContent">
    <base-dialog
      title="选择库位"
      :visible.sync="dialogVisible"
      width="700px"
      center
    >
      <condition-form
        ref="conditionForm"
        v-model="searchForm"
        label-width="100px"
        :form-data="formData"
      />
      <el-row style="margin-bottom: 10px">
        <el-col :span="20" style="text-align: left;margin-left: 20px;">
          <el-button type="primary" @click="getData(searchForm)"><i class="el-icon-search" /> {{ $t('查询') }}</el-button>
          <el-button type="danger" @click="onClear"><i class="el-icon-close" /> {{ $t('清空') }}</el-button>
        </el-col>
      </el-row>
      <!-- <my_filter
        ref="comFilter"
        :filter-title="filterTitle"
        :form-data="formData"
        @_FormQuery="onFormQuery"
      /> -->
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
import { getLocationList } from '@/api/dms/bas/warehouse'

export default {
  name: 'CuneSelect',
  props: {
    visible: {
      type: Boolean
    }
  },
  data() {
    return {
      searchForm: {},
      // 查询设置
      filterTitle: {
        title: '',
        form_width: '90px'
      },
      // 查询字段设置
      formData: [
        {
          label: '库位编码：',
          type: 'label_input',
          placeholder: '请输入',
          prop: 'warehouseName',
          Val: ''
        },
        {
          label: '库位名称：',
          type: 'label_input',
          placeholder: '请输入',
          prop: 'warehouseCode',
          Val: ''
        }
      ],
      // 表格初始化
      pageVo: {
        total: 0,
        status: true,
        pageSize: 50,
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
          prop: 'warehouseCode',
          label: '库位编号',
          align: 'center',
          width: '150px'
        },
        {
          prop: 'warehouseName',
          label: '库位名称',
          align: 'center'
        }
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
    this.getData()
  },
  methods: {
    // 查询数据
    async getData() {
      const params = {
        ...this.searchForm,
        pageNum: this.pageVo.currentPage,
        pageSize: this.pageVo.pageSize
      }
      const res = await getLocationList(params)
      this.dataSource = res.rows
      this.pageVo.total = res.total
    },
    onClear() {
      for (const i in this.formData) {
        this.formData[i].Val = ''
      }
      this.searchForm = {}
      this.pageVo.currentPage = 1
      this.getData()
    },
    // // 筛选
    // onFormQuery(formData, status) {
    //   if (status === 'submit') {
    //     // 查询按钮
    //     this.searchForm = formData
    //     this.getData()
    //   } else {
    //     // 清空按钮
    //     for (const i in this.formData) {
    //       this.formData[i].Val = ''
    //     }
    //     this.searchForm = {}
    //     this.pageVo.currentPage = 1
    //     this.getData()
    //   }
    // },
    // 页码改变事件
    handleCurrentChange(val) {
      this.pageVo.currentPage = val
      this.$refs.comFilter.submitForm('submit')
    },
    // 页数改变事件
    handleSizeChange(val) {
      this.pageVo.pageSize = val
      console.log(val)
      this.$refs.comFilter.submitForm('submit')
    },
    // 多选框触发事件
    handleSelectionChange(val) {
      console.log('val:', val)
    },
    rowClick(row) {
      this.$emit('submit', row)
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
