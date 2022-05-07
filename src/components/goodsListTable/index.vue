<template>
  <base-dialog
    :title="$t('货位信息')"
    :visible.sync="dialogVisible"
    width="800px"
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
</template>

<script>

export default {
  name: 'GoodsListTable',
  props: {
    visible: {
      type: Boolean
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
      searchForm: {},
      filterData: [],
      // 查询字段设置
      formData: [
        {
          type: 'label_input',
          label: '仓库名称',
          prop: 'warehouseName',
          xl: 8,
          lg: 8,
          md: 8,
          sm: 8
        },
        {
          type: 'label_input',
          label: '仓库编号',
          prop: 'warehouseCode',
          xl: 8,
          sm: 8
        },
        {
          type: 'label_input',
          label: '货位编号',
          prop: 'goodsLocationCode',
          xl: 8,
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
        stripe: true, // 是否为斑马纹 table
        loading: false, // 是否添加表格loading加载动画
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        serial: true, // 是否支持序号
        mutiSelect: false, // 是否支持列表项选中功能
        height: '500px', // 表格自定义高度
        cusHeight: 0 // 表格计算高度减去多余的高度值
      },
      // 表格展示的列
      tableColumns: [
        {
          label: '序号',
          prop: 'ids'
        },
        {
          label: '仓库名称',
          prop: 'warehouseName'
        },
        {
          label: '库区编号',
          prop: 'reservoirAreaCode'
        },
        {
          label: '库区名称',
          prop: 'reservoirAreaName'
        },
        {
          label: '货列编号',
          prop: 'goodsListCode'
        },
        {
          label: '货架编号',
          prop: 'shelfNumber'
        },
        {
          label: '货位编号',
          prop: 'goodsLocationCode'
        },
        {
          label: '货位规格',
          prop: 'goodsLocationSpecification'
        },
        {
          label: '货位类型',
          prop: 'goodsLocationType'
        },
        {
          label: '容量上限',
          prop: 'capcityLimit'
        },
        {
          label: '是否允许批次混放',
          prop: 'allowMixedFlag',
          formatter: (row) =>
            row.status === '1' ? '是' : '否'
        },
        {
          label: '长/宽/高',
          prop: 'lengthWidthHeight'
        },
        {
          label: '作业顺序',
          prop: 'jobSeq'
        },
        {
          label: '创建人',
          prop: 'createByName'
        },
        {
          label: '创建时间',
          prop: 'createTime'
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
    this.getData()
  },
  methods: {
    // 查询数据
    async getData() {
      this.tableOptions.loading = true
      const params = {
        ...this.searchForm,
        customerName: '1',
        pageNum: this.pageVo.currentPage,
        pageSize: this.pageVo.pageSize
      }
      const { rows, total } = await this.$axios.wms.locationInformation.getBasGoodsLocationList(params)
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
      this.$refs.comFilter.submitForm('submit')
    },
    // 页数改变事件
    handleSizeChange(val) {
      this.pageVo.pageSize = val
      this.$refs.comFilter.submitForm('submit')
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
</style>
