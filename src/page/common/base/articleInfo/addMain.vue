<template>
  <div>
    <base-dialog
      :title="orderList? '修改主品名' : '新增主品名'"
      :visible.sync="innerVisible"
      width="85%"
      :is-minus-full="true"
      :close-on-click-modal="false"
    >
      <el-row>
        <el-col style="text-align: left;">
          <my_form
            :form-data="formData"
            :column="column"
            :go-back="false"
            :is-scroller="true"
            :rule="rule"
            :close-hide="true"
            label-width="80px"
            @handleSave="saveFormdata"
            @handleCancel="innerVisible = false"
          />
        </el-col>
      </el-row>
    </base-dialog>
  </div>
</template>
<script>
import { addArticle, putArticle } from '@/api/common/base/article'
import { mapGetters } from 'vuex'
export default {
  components: {
  },
  props: {
    orderList: {
      type: Object,
      default: null
    },
    visible: {
      type: Boolean
    }
  },
  data () {
    return {
      websiteTableVisible: false,
      businessVisible: false,
      statusIden: '1',
      formData: {},
      rule: {
        code: {
          required: true,
          message: '请输入主品名编号',
          trigger: 'blur'
        },
        transportType1: {
          required: true,
          message: '请选择运输方式',
          trigger: 'change'
        },
        transportType2: {
          required: true,
          message: '请选择运输方式',
          trigger: 'change'
        },
        name: {
          required: true,
          message: '请输入主品名名称',
          trigger: 'blur'
        }
      },
      column: [
        {
          title: '主品名信息',
          content: [
            {
              label: '主品名编号',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入主品名编号',
              prop: 'code'
            },
            {
              label: '运输方式',
              type: 'label_select',
              disabled: false,
              options: [
                {
                  label: '海运',
                  value: '01'
                },
                {
                  label: '汽运',
                  value: '02'
                }
              ],
              handleChange: (val, item) => {
                if (val) {
                  console.log(item.options)
                  item.options.forEach(item => {
                    if (val === item.value) {
                      this.$set(this.formData, 'transportTypeName1', item.label)
                    }
                  })
                }
              },
              placeholder: '请选择运输方式(BY KY(每立方计))',
              prop: 'transportType1'
            },
            {
              label: '运输方式',
              type: 'label_select',
              disabled: false,
              options: [
                {
                  label: '海运',
                  value: '01'
                },
                {
                  label: '汽运',
                  value: '02'
                }
              ],
              handleChange: (val, item) => {
                if (val) {
                  console.log(item.options)
                  item.options.forEach(item => {
                    if (val === item.value) {
                      this.$set(this.formData, 'transportTypeName2', item.label)
                    }
                  })
                }
              },
              placeholder: '请选择运输方式(BY SEA(每立方计))',
              prop: 'transportType2'
            },
            {
              label: '主品名名称(中)',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入主品名名称(中)',
              prop: 'name'
            },
            {
              label: '最低公斤数',
              type: 'label_input_number',
              disabled: false,
              placeholder: '请输入最低公斤数',
              prop: 'minKg1'
            },
            {
              label: '最低公斤数',
              type: 'label_input_number',
              disabled: false,
              placeholder: '请输入最低公斤数',
              prop: 'minKg2'
            },
            {
              label: '主品名名称(英)',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入主品名名称(英)',
              prop: 'nameEn'
            },
            {
              label: '最高公斤数',
              type: 'label_input_number',
              disabled: false,
              placeholder: '请输入最高公斤数',
              prop: 'maxKg1'
            },
            {
              label: '最高公斤数',
              type: 'label_input_number',
              disabled: false,
              placeholder: '请输入最高公斤数',
              prop: 'maxKg2'
            },
            {
              label: '主品名名称(泰)',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入主品名名称(泰)',
              prop: 'nameTh'
            },
            {
              label: '最低泰铢',
              type: 'label_input_number',
              disabled: false,
              placeholder: '请输入最低泰铢',
              prop: 'minThb1'
            },
            {
              label: '最低泰铢',
              type: 'label_input_number',
              disabled: false,
              placeholder: '请输入最低泰铢',
              prop: 'minThb2'
            },
            {
              label: '是否单一品名',
              type: 'label_select',
              disabled: false,
              options: [
                {
                  label: '是',
                  value: 'Y'
                },
                {
                  label: '否',
                  value: 'N'
                }
              ],
              placeholder: '请选择是否单一品名',
              prop: 'singleProduct'
            },
            {
              label: '最低人民币',
              type: 'label_input_number',
              disabled: false,
              placeholder: '请输入最低人民币',
              prop: 'minRmb1'
            },
            {
              label: '最低人民币',
              type: 'label_input_number',
              disabled: false,
              placeholder: '请输入最低人民币',
              prop: 'minRmb2'
            }
          ]
        }
      ],
      mainParams: {}
    }
  },
  computed: {
    innerVisible: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('update:visible', val)
      }
    },
    ...mapGetters(['userInfo'])
  },
  mounted () {
    console.log(this.formData, '加载')
    if (this.$props.orderList) {
      this.formData = {
        ...this.$props.orderList
      }
    }
  },
  methods: {
    // 保存
    async saveFormdata () {
      this.$emit('save', this.formData)
      this.column[0].content.map(item => {
        if (item.prop === 'transportType1') {
          return this.$set(this.formData, 'transportTypeName1', this.$Utils.matchValue(item.options, this.formData.transportType1, 'value', 'label'))
        }
        if (item.prop === 'transportType2') {
          return this.$set(this.formData, 'transportTypeName2', this.$Utils.matchValue(item.options, this.formData.transportType2, 'value', 'label'))
        }
      })
      if (!this.$props.orderList) {
        const res = await addArticle(this.formData)
        if (res.code === 200) {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.innerVisible = false
          this.$emit('onSubmit')
        }
      } else {
        const res = await putArticle(this.formData)
        if (res.code === 200) {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.innerVisible = false
          this.$emit('onSubmit')
        }
      }
    }
  }
}
</script>
