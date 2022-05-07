<template>
  <div id="websiteContent">
    <base-dialog :title="$t('仓库信息')" :visible.sync="dialogVisible" width="800px" center>
      <condition-form ref="conditionForm" v-model="searchForm" label-width="100px" :form-data="formData" />
      <div class="con-margin-l con-margin-b">
        <el-button type="primary" @click="getData(searchForm)"><i class="el-icon-search" /> {{ $t('查询') }}</el-button>
        <el-button type="danger" @click="onClear"><i class="el-icon-close" /> {{ $t('清空') }}</el-button>
        <el-button v-if="mutiSelect" :disabled="!multipleSelection.length" type="success" @click="onSubmit"><i class="el-icon-check" /> {{ $t('确定') }}</el-button>
      </div>
      <my_table ref="comTable" :data-source="dataSource" :options="tableOptions" :page-vo="pageVo" :columns="tableColumns" @handleRowClick="rowClick" @handleSelectionChange="handleSelectionChange" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" />
    </base-dialog>
  </div>
</template>

<script>
// import { getBasWarehouseList } from '@/api/wms/common/base/warehouseInformation'
export default {
  name: 'WarehouseSelect',
  components: {
  },
  props: {
    visible: {
      type: Boolean
    },
    mutiSelect: { // 是否支持多选
      type: Boolean,
      default: () => {
        return false
      }
    },
    // 查询所有数据
    allData: {
      type: Boolean,
      default: function () {
        return false
      }
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
          label: '仓库编号： ',
          type: 'label_input',
          placeholder: '请输入',
          prop: 'warehouseCode',
          xl: 8,
          lg: 8,
          md: 8,
          sm: 8
        },
        {
          label: '仓库名称： ',
          type: 'label_input',
          placeholder: '请输入',
          prop: 'warehouseName',
          xl: 8,
          lg: 8,
          md: 8,
          sm: 8
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
          label: '仓库编码',
          prop: 'warehouseCode'
        },
        {
          label: '仓库名称(中)',
          prop: 'warehouseName'
        },
        {
          label: '仓库名称(英)',
          prop: 'warehouseNameEn'
        },
        {
          label: '仓库名称(泰)',
          prop: 'warehouseNameThai'
        },
        {
          label: '联系方式',
          prop: 'contactPhone'
        },
        {
          label: '仓库地址',
          prop: 'address'
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
    this.$nextTick(() => {
      this.tableOptions.mutiSelect = this.mutiSelect
    })
    this.getData(this.searchForm)
  },
  methods: {
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
        current: this.pageVo.currentPage,
        size: this.pageVo.pageSize
      }
      const data = await getBasWarehouseList(params)
      this.dataSource = data.rows
      this.pageVo.total = data.total
      this.tableOptions.loading = false
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
    },
    // 多选框触发事件
    handleSelectionChange(val) {
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
