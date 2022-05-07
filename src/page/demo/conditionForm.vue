<template>
  <div class="common-wrap">
    <h3>筛选条件</h3>
    <condition-form ref="conditionForm" v-model="searchForm" :form-data="formData" />
    <div class="con-padding con-margin-t">
      <p>1.大屏一行放6项,小屏一行放4项</p>
      <p>2.时间选择范围组件需占两格</p>
      <p>3.默认展示两行,如超出两行需有"展开"和"收起"按钮</p>
      <p>4.type类型: </p>
      <ul>
        <li>label_input  复合型input</li>
        <li>label_date_picker 日期控件</li>
        <li>label_input_clearable 用于公共组件输入框</li>
        <li>label_select 下拉框</li>
        <li>label_checkbox 勾选框</li>
        <li>label_radio 单选按钮组</li>
        <li>label_radio_input 复合型输入框按钮组</li>
        <li>label_radio_date_picker 日期按钮组</li>
        <li>label_radio_input_clearable 弹窗组件按钮组</li>
      </ul>
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
import conditionForm from '@/components/conditionForm/index'
import websiteTable from '@/components/websiteTable'
export default {
  name: 'ConditionForm',
  components: {
    conditionForm,
    websiteTable
  },
  data() {
    return {
      websiteTableVisible: false,
      searchForm: {},
      formData: [
        {
          type: 'label_radio_input',
          prop: 'prop_17',
          inputType: 'textarea',
          rowSpan: 2,
          collapseRows: 4,
          options: [
            {
              value: 'startShippingDate',
              label: '订单号'
            },
            {
              value: 'startRecordTime',
              label: '运单号'
            }
          ],
          handleChange: (row) => {
            console.log('ssrow', row)
          },
          xl: 12,
          lg: 12,
          md: 12,
          sm: 12
        },
        {
          type: 'label_radio_date_picker',
          prop: 'prop_10',
          dateType: 'datetimerange',
          options: [
            {
              value: 'startShippingDate',
              label: '寄件日期'
            },
            {
              value: 'startRecordTime',
              label: '录入日期'
            }
          ],
          handleChange: (row) => {
            console.log('ssrow', row)
          },
          xl: 12,
          lg: 12,
          md: 12,
          sm: 12
        },
        {
          type: 'label_radios',
          prop: 'prop_11',
          label: '纯单选框',
          options: [
            {
              value: '1',
              label: '选项-1'
            },
            {
              value: '2',
              label: '选项-2'
            },
            {
              value: '3',
              label: '选项-3'
            }
          ],
          xl: 12,
          lg: 12,
          md: 12,
          sm: 12
        },
        {
          type: 'label_radio_input',
          prop: 'prop_12',
          options: [
            {
              value: '1',
              label: 'input-1'
            },
            {
              value: '2',
              label: 'input-2'
            }
          ],
          xl: 12,
          lg: 12,
          md: 12,
          sm: 12
        },
        {
          type: 'label_radio_input_clearable',
          prop: 'prop_13',
          options: [
            {
              value: '1',
              label: '组件-1'
            },
            {
              value: '2',
              label: '组件-2'
            },
            {
              value: '3',
              label: '组件-3'
            }
          ],
          xl: 12,
          lg: 12,
          md: 12,
          sm: 12
        },
        {
          type: 'label_input_clearable',
          label: 'input（组件）',
          prop: 'prop_1',
          handleClear: () => {
            this.websiteNo = ''
          },
          handleClick: () => {
            this.websiteTableVisible = true
          }
        },
        {
          type: 'label_input',
          label: 'input（普通）',
          prop: 'prop_2'
        },
        {
          type: 'label_input',
          label: 'input（数字）',
          prop: 'prop_3',
          inputType: 'number'
        },
        {
          type: 'label_input',
          label: 'input（前置元素-文字）',
          prop: 'prop_14',
          slotType: 'prepend',
          slotText: 'Http://'
        },
        {
          type: 'label_input',
          label: 'input（后置元素-文字）',
          prop: 'prop_15',
          slotType: 'append',
          slotText: '.com'
        },
        {
          type: 'label_input',
          label: 'input（后置元素-数组）',
          prop: 'prop_16',
          slotType: 'prepend',
          selectd: '0',
          labelVal: 'subCode', // 下拉的value字段名（默认是label）
          labelName: 'subName', // 下拉的value字段名（默认是value）
          options: [
            {
              subName: '未审核',
              subCode: '0'
            },
            {
              subName: '已审核',
              subCode: '1'
            }
          ],
          handleChange: (res) => {
            console.log('下拉切换值', res)
          }
        },
        {
          type: 'label_select',
          label: '下拉框',
          prop: 'prop_4',
          labelVal: '', // 下拉的value字段名（默认是label）
          labelName: '', // 下拉的value字段名（默认是value）
          options: [
            {
              label: '未审核',
              value: '0'
            },
            {
              label: '已审核',
              value: '1'
            }
          ],
          handleChange: (res) => {
            console.log('下拉切换值', res)
          }
        },
        {
          type: 'label_date_picker',
          label: 'date-picker日期选择器',
          prop: 'prop_5',
          dateType: 'datetimerange',
          format: 'yyyy-MM-dd HH:mm:ss',
          xl: 8,
          sm: 12,
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
        },
        {
          type: 'label_input',
          label: '文本域',
          prop: 'prop_16',
          inputType: 'textarea',
          rowSpan: 2,
          collapseRows: 4
        },
        {
          type: 'label_checkbox',
          label: 'checkbox勾选框',
          text: '全省',
          prop: 'prop_6',
          trueLabel: '1',
          falseLabel: '0',
          handleChange: () => {
          }
        },
        {
          type: 'label_input_number',
          label: 'label_input_number',
          prop: 'prop_17'
        }
      ]
    }
  },
  methods: {
    onCollapse(val) {
      console.log(val)
    },
    websiteTableSubmit(val) {
      console.log('网点', val)
      this.searchForm.websitesNo = val.websitesNo
      this.searchForm.websitesName = val.websitesName
      this.websiteTableVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
