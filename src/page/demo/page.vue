<template>
  <div class="common-wrap">
    <!-- 查询 -->
    <condition-form
      ref="conditionForm"
      v-model="searchForm"
      :form-data="formData"
    />
    <div class="common-box">
      <!-- 按钮 -->
      <div id="common-operation-btns">
        <el-button type="primary" @click="onSearch"><i class="el-icon-search" /> {{ $t('查询') }}</el-button>
        <el-button type="danger" @click="onClear"><i class="el-icon-close" /> {{ $t('清空') }}</el-button>
      </div>
      <!-- 表格 -->
      <my_table
        ref="comTable"
        :data-source="dataSource"
        :options="tableOptions"
        :page-vo="pageVo"
        :columns="tableColumns"
        @handleSelectionChange="handleSelectionChange"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      />
    </div>
    <!-- 网点组件 -->
    <website-table
      v-if="websiteTableVisible"
      :visible.sync="websiteTableVisible"
      @submit="websiteTableSubmit"
    />
  </div>
</template>

<script>
import moment from 'moment'
import websiteTable from '@/components/websiteTable'
export default {
  name: '', // 必须与route的name相等
  components: {
    websiteTable
  },
  data() {
    return {
      websiteTableVisible: false,
      // 查询条件值集
      searchForm: {},
      // 查询字段设置
      formData: [
        {
          type: 'label_input',
          label: '运单号',
          prop: 'prop_1',
          inputType: 'textarea',
          collapseRows: 4
        },
        {
          type: 'label_input_clearable',
          label: '网点',
          prop: 'prop_2',
          handleClear: () => {
            this.searchForm.websiteNo = null
          },
          handleClick: () => {
            this.websiteTableVisible = true
          }
        },
        {
          type: 'label_select',
          label: '下拉框',
          prop: 'prop_3',
          labelVal: '', // 下拉的value字段名（默认是label）
          labelName: '', // 下拉的value字段名（默认是value）
          options: [
            {
              label: this.$i18n.tc('未审核'),
              value: '0'
            },
            {
              label: this.$i18n.tc('已审核'),
              value: '1'
            }
          ],
          handleChange: (res) => {
            console.log('下拉切换值', res)
          }
        },
        {
          type: 'label_input',
          label: '快递公司',
          prop: 'prop_4'
        },
        {
          type: 'label_date_picker',
          label: '登记时间',
          prop: 'prop_5',
          dateType: 'datetimerange',
          format: 'yyyy-MM-dd HH:mm:ss',
          pickerOptions: {
            shortcuts: [{
              text: '最近15天',
              onClick(picker) {
                const start = moment().subtract(15, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss')
                const end = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
                picker.$emit('pick', [start, end])
              }
            }]
          }
        }
      ],
      // 表格值集
      dataSource: [],
      // 表格初始化
      pageVo: {
        total: 0, // 总条目数
        status: true, // 是否开启分页
        pageSize: 15, // 页数
        currentPage: 1 // 页码
      },
      // 表格参数配置
      tableOptions: {
        stripe: true, // 是否为斑马纹 table
        loading: false, // 是否添加表格loading加载动画
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        serial: true, // 是否支持序号
        mutiSelect: true, // 是否支持列表项选中功能
        height: '', // 表格自定义高度
        cusHeight: 0, // 表格计算高度减去多余的高度值
        showSummary: false // 合计
      },
      // 表格展示的列
      tableColumns: [
        {
          prop: 'order',
          label: '订单编号',
          align: 'center'
        },
        {
          prop: 'number',
          label: '数量',
          align: 'center'
        },
        {
          prop: 'price',
          label: '价格',
          align: 'center',
          render: (h, params) => {
            return (
              <span>￥{params.row.price}</span>
            )
          }
        },
        {
          prop: 'controlBtn',
          label: '操作',
          width: 100,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            return (
              <div>
                <el-button icon='el-icon-view' circle title={this.$i18n.tc('详情')} type='danger' plain onClick={() => this.onDetail(params.row)}></el-button>
                <el-button icon='el-icon-edit' circle title={this.$i18n.tc('编辑')} type='success' plain onClick={() => this.onEdit(params.row)}></el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  mounted() {
    // 时间默认最近7天
    const start = moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss')
    const end = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
    this.searchForm.prop_5 = [start, end]
    this.getData()
  },
  methods: {
    // 获取数据
    async getData() {
      this.tableOptions.loading = true
      const params = {
        ...this.searchForm,
        pageNum: this.pageVo.currentPage,
        pageSize: this.pageVo.pageSize
      }
      const { rows, total } = await _api.list(params).catch(() => {
        this.tableOptions.loading = false
      })
      this.dataSource = rows
      this.pageVo.total = total
      this.tableOptions.loading = false
    },
    // 查询按钮
    onSearch() {
      this.getData()
    },
    // 清空按钮
    onClear() {
      for (const i in this.searchForm) {
        this.searchForm[i] = null
      }
      this.pageVo.currentPage = 1
      this.getData()
    },
    // 页码改变事件
    handleCurrentChange(val) {
      this.pageVo.currentPage = val
      this.getData()
    },
    // 页数改变事件
    handleSizeChange(val) {
      this.pageVo.pageSize = val
      this.pageVo.currentPage = 1
      this.getData()
    },
    // 多选框触发事件
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 网点组件
    websiteTableSubmit(val) {
      this.searchForm.websitesNo = val.websitesNo
      this.searchForm.websitesName = val.websitesName
      this.websiteTableVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
