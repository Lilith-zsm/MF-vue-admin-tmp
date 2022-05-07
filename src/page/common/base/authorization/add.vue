<template>
  <div>
    <base-dialog
      :title="orderList ? $t('修改品牌授权') : $t('新增品牌授权')"
      :visible.sync="innerVisible"
      width="800px"
      :is-minus-full="true"
      :close-on-click-modal="false"
    >
      <el-row>
        <el-col style="text-align: left;">
          <my_form
            :form-data="formData"
            :column="column"
            :options="options"
            :go-back="false"
            :rule="rule"
            :close-hide="true"
            label-width="80px"
            @handleCancel="innerVisible = false"
            @handleSave="saveFormdata"
          />
        </el-col>
      </el-row>
    </base-dialog>
    <customer-select
      v-if="cusVisible"
      :visible.sync="cusVisible"
      @submit="cusSubmit"
    />
  </div>
</template>
<script>
import customerSelect from '@/components/customerSelect'
import { putAuthorization, addAuthorization } from '@/api/common/base/authorization'
import { mapGetters } from 'vuex'
export default {
  components: {
    customerSelect
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
      cusVisible: false,
      statusIden: '1',
      formData: {},
      rule: {
        cusName: {
          required: true,
          message: '请选择客户名称',
          trigger: 'blur'
        },
        brandName: {
          required: true,
          message: '请输入授权品牌(中)',
          trigger: 'blur'
        }
      },
      options: {
        xl: 8,
        lg: 8,
        md: 8,
        sm: 8
      },
      column: [
        {
          title: '',
          content: [
            // {
            //   label: '客户代号',
            //   type: 'label_input',
            //   disabled: false,
            //   placeholder: '请输入客户代号',
            //   prop: 'flightCode'
            // },
            {
              label: '客户名称',
              type: 'label_input_clearable',
              disabled: false,
              placeholder: '请选择客户名称',
              prop: 'cusName',
              handleClick: () => {
                this.cusVisible = true
              },
              handleClear: () => {
                this.$set(this.formData, 'cusCode', null)
              }
            },
            {
              label: '授权品牌(中)',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入授权品牌(中)',
              prop: 'brandName'
            },
            {
              label: '授权品牌(英)',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入授权品牌(英)',
              prop: 'brandNameEn'
            },
            {
              label: '授权品牌(泰)',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入授权品牌(泰)',
              prop: 'brandNameTh'
            },
            {
              label: '授权时间',
              disabled: false,
              prop: 'authStartTime',
              type: 'label_date_picker',
              dateType: 'datetimerange',
              xl: 15,
              lg: 15,
              md: 15,
              sm: 15
            },
            {
              label: '备注',
              type: 'label_input',
              genre: 'textarea',
              disabled: false,
              placeholder: '请输入备注',
              prop: 'remark',
              xl: 20,
              lg: 20,
              md: 20,
              sm: 20
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
    // 客户名称
    cusSubmit(val) {
      this.$set(this.formData, 'cusName', val.customerName)
      this.$set(this.formData, 'cusName', val.customerCode)
      this.cusVisible = false
    },
    // 保存
    async saveFormdata () {
      this.$emit('save', this.formData)
      console.log(this.formData)
      if (!this.$props.orderList) {
        const res = await addAuthorization(this.formData)
        if (res.code === 200) {
          this.$message({
            message: this.$i18n.tc(res.msg),
            type: 'success'
          })
          this.innerVisible = false
          this.$emit('onSubmit')
        }
      } else {
        const res = await putAuthorization(this.formData)
        if (res.code === 200) {
          this.$message({
            message: this.$i18n.tc(res.msg),
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
