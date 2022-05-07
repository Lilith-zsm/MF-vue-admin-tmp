<template>
  <div class="form">
    <el-button type="success" style="margin: 20px" @click="onAdd"><i class="el-icon-plus" /> 新增</el-button>
    <base-dialog title="逐票录单" :visible.sync="innerVisible" :is-minus-full="true">
      <m-form
        :form-data="formData"
        :column="column"
        :rule="rule"
        :options="options"
        :save-btn-loading="saveBtnLoading"
        :reset-btn-visible="true"
        @handleBlur="handleBlur"
        @handleChange="handleChange"
        @handleCancel="handleCancel"
        @handleReset="handleReset"
        @handleSave="handleSave"
      >
        <!-- 级联slot -->
        <template v-slot:form-cascader="{data, node}">
          <span>{{ data.category_name }}</span>
          <span v-if="!node.isLeaf"> ({{ data.childList.length }}) </span>
        </template>
      </m-form>
    </base-dialog>
  </div>
</template>
<script>
import formDto from './dto'
export default {
  name: 'DialogForm',
  data() {
    return {
      // 表单弹窗显示
      innerVisible: true,
      // 表单数据
      formData: formDto,
      // 表单参数
      options: {
        isScroller: true
      },
      // 表单保存loading
      saveBtnLoading: false,
      // 表单列
      column: [
        {
          title: '基本信息',
          content: [
            {
              label: 'input',
              type: 'label_input',
              disabled: false,
              prop: 'input',
              blur: true
            },
            {
              label: 'input_clearable',
              type: 'label_input_clearable',
              disabled: false,
              prop: 'inputSelect',
              handleClear: () => {
              },
              handleClick: () => {
              }
            },
            {
              label: 'select',
              type: 'label_select',
              disabled: false,
              prop: 'status',
              labelName: 'subName',
              labelVal: 'subCode',
              change: true,
              options: [
                {
                  subName: '未使用',
                  subCode: '0'
                },
                {
                  subName: '已使用',
                  subCode: '1'
                }
              ]
            },
            {
              label: 'cascader',
              type: 'label_cascader',
              disabled: false,
              prop: 'cascader',
              change: true,
              props: { label: 'category_name', value: 'category_code', children: 'childList' },
              options: [
                {
                  category_name: '一级',
                  category_code: '1',
                  childList: [
                    {
                      category_name: '一级-1',
                      category_code: '1-1'
                    }
                  ]
                },
                {
                  category_name: '二级',
                  category_code: '2'
                }
              ],
              slot: true
            },
            {
              label: 'date_picker(date)',
              type: 'label_date_picker',
              disabled: false,
              prop: 'date1'
            },
            {
              label: 'date_picker(daterange)',
              type: 'label_date_picker',
              dateType: 'daterange',
              disabled: false,
              prop: 'date2',
              format: 'yyyy-MM-dd',
              pickerOptions: {
                shortcuts: [{
                  text: '最近一周',
                  onClick(picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                    picker.$emit('pick', [start, end])
                  }
                }, {
                  text: '最近一个月',
                  onClick(picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                    picker.$emit('pick', [start, end])
                  }
                }, {
                  text: '最近三个月',
                  onClick(picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                    picker.$emit('pick', [start, end])
                  }
                }]
              }
            },
            {
              label: 'date_picker(datetimerange)',
              type: 'label_date_picker',
              dateType: 'datetimerange',
              disabled: false,
              placeholder: '请选择',
              prop: 'date2',
              format: 'yyyy-MM-dd hh:ss:mm',
              pickerOptions: {
                shortcuts: [{
                  text: '最近一周',
                  onClick(picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                    picker.$emit('pick', [start, end])
                  }
                }, {
                  text: '最近一个月',
                  onClick(picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                    picker.$emit('pick', [start, end])
                  }
                }, {
                  text: '最近三个月',
                  onClick(picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                    picker.$emit('pick', [start, end])
                  }
                }]
              }
            },
            {
              label: 'input_number',
              type: 'label_input_number',
              disabled: false,
              placeholder: '请输入',
              prop: 'num1'
            },
            {
              label: 'number',
              type: 'label_number',
              disabled: false,
              placeholder: '请输入',
              prop: 'num2'
            },
            {
              label: 'checkbox',
              type: 'label_checkbox',
              disabled: false,
              prop: 'check',
              text: 'check'
            },
            {
              label: 'checkbox_group',
              type: 'label_checkbox_group',
              disabled: false,
              prop: 'checkbox_group',
              labelName: 'subName',
              labelVal: 'subCode',
              change: true,
              options: [
                {
                  subName: '未使用',
                  subCode: '0'
                },
                {
                  subName: '已使用',
                  subCode: '1'
                }
              ]
            },
            {
              label: 'radio_group',
              type: 'label_radio_group',
              disabled: false,
              prop: 'radio_group',
              change: true,
              options: [
                { value: '0', label: '未使用' },
                { value: '1', label: '已使用' }
              ]
            },
            {
              label: 'switch',
              type: 'label_switch',
              disabled: false,
              change: true,
              prop: 'switch',
              activeText: '是',
              inactiveText: '否',
              activeValue: 'Y',
              inactiveValue: 'N'
            },
            {
              label: 'label_input_suffix',
              type: 'label_input',
              disabled: false,
              prop: 'label_input_suffix',
              suffixIcon: 'el-icon-refresh-left',
              handleIconClick: (key) => {
                console.log(key)
              }
            },
            {
              label: 'input_textarea',
              type: 'label_input',
              genre: 'textarea',
              xl: 24,
              lg: 24,
              md: 24,
              sm: 24,
              disabled: false,
              height: 'auto',
              autosize: true,
              prop: 'textarea'
            }
          ]
        },
        {
          title: '货品信息',
          tableOption: {
            tableKey: 'goodsList',
            addBtnVisible: true,
            onAddTableLine: this.onAddTableLine
          },
          tableColumn: [
            {
              label: '货号',
              type: 'label_input',
              disabled: false,
              prop: 'code'
            },
            {
              label: '货品类别编号',
              type: 'label_input_clearable',
              disabled: false,
              prop: 'goodsCategoryCode',
              handleClick: () => {

              },
              handleClear: () => {

              }
            },
            {
              label: '货品类别名称',
              type: 'label_select',
              disabled: false,
              prop: 'goodsCategoryName',
              options: [
                {
                  label: '选项一',
                  value: '1'
                },
                {
                  label: '选项二',
                  value: '2'
                }
              ]
            },
            {
              label: '子品名名称（中）',
              type: 'label_select',
              disabled: false,
              prop: 'goodsCategorySubZh'
            },
            {
              label: '货品描述',
              disabled: false,
              prop: 'goodsDesc'
            },
            {
              label: '货品明细',
              disabled: false,
              prop: 'goodsDetail'
            },
            {
              label: '预收数量',
              type: 'label_input_number',
              disabled: false,
              prop: 'expectReceiveMoney'
            },
            {
              label: '实收备注',
              disabled: false,
              prop: 'expectReceiveRemark'
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
                    <el-button icon='el-icon-delete' circle title='删除' type='danger' plain onClick={() => this.onDelTableLine(params.row, params.rowIndex)}></el-button>
                  </div>
                )
              }
            }
          ]
        }
      ],
      // 表单校验规则
      rule: {
        orderDate: {
          required: true,
          message: '请选择下单日期',
          trigger: 'blur'
        },
        sender: {
          required: true,
          message: '请选择寄件人',
          trigger: 'blur'
        }
      }
    }
  },
  mounted() {
  },
  methods: {
    // 表单表格添加行
    onAddTableLine() {
      this.formData.goodsList.push({})
    },
    // 表单表格删除行
    onDelTableLine(row, index) {
      this.formData.goodsList.splice(index, 1)
    },
    // form失去焦点事件
    handleBlur(prop, val) {
      console.log(`${prop}：${val}`)
    },
    // form修改事件
    handleChange(prop, val) {
      console.log(`${prop}：${val}`)
    },
    // 取消
    handleCancel() {
      this.innerVisible = false
    },
    // 重置
    handleReset() {
      this.formData.goodsList = []
    },
    // 保存
    handleSave() {
      console.log('保存')
      this.saveBtnLoading = true
      setTimeout(() => {
        this.saveBtnLoading = false
      }, 1000)
    },
    // 弹窗
    onAdd() {
      this.$store.dispatch('openMiunsDialog', '逐票录单')
      this.innerVisible = true
    }
  }
}
</script>
