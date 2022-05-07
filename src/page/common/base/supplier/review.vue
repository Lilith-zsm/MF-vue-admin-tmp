<template>
  <div>
    <base-dialog
      :title="$t('审核供应商')"
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
            :go-back="false"
            :options="options"
            :rule="rule"
            :close-hide="true"
            label-width="80px"
            @handleChange="handleChange"
            @handleSave="saveFormdata"
            @handleCancel="innerVisible = false"
          >
            <div slot="form-hide" />
            <div slot="form-title" />
            <!-- 审核状态 -->
            <div slot="form-reviewStatus">
              <div>
                <span>{{ $t('当前状态：') }}</span>
                <span style="margin-left:30px;">{{ $t(formData.statusName) }}</span>
              </div>
            </div>
            <div slot="form-reviewDeal">
              <span>{{ $t('审核处理') }}</span>
            </div>
            <!-- 保存按钮 -->
            <div slot="form-btn">
              <el-button
                type="primary"
              > {{ $t('保存') }}</el-button>
            </div>
            <!-- 处理结果 -->
            <div slot="form-process">
              <div>
                <span>{{ $t('处理时间：') }}</span>
                <span style="margin-left:20px;">{{ $t(formData.updateTime) }}</span>
                <span style="margin-left:30px;">{{ $t('处理人：') }}</span>
                <span style="margin-left:20px;">{{ $t(formData.updateByName) }}</span>
                <span style="margin-left:30px;">{{ $t('处理结果：') }}</span>
                <span style="margin-left:20px;">{{ $t(formData.statusName) }}</span>
              </div>
            </div>
          </my_form>
        </el-col>
      </el-row>
    </base-dialog>
  </div>
</template>
<script>
import { addSupplierReview } from '@/api/common/base/supplier'
export default {
  components: {
  },
  props: {
    form: {
      type: Object,
      default: null
    },
    visible: {
      type: Boolean
    }
  },
  data () {
    return {
      title: '审核供应商资料',
      options: {
        isScroller: true,
        scrollMaxHeight: 'calc(100vh - 350px)'
      },
      subNameVisible: false,
      websiteTableVisible: false,
      businessVisible: false,
      statusIden: '1',
      formData: {},
      rule: {
        statusCode: {
          required: true,
          message: '请选择审核状态',
          trigger: 'blur'
        }
      },
      column: [
        {
          title: '审核处理',
          content: [
            {
              label: '',
              type: 'slot',
              prop: 'reviewStatus',
              xl: 24,
              lg: 24,
              md: 24,
              sm: 24
            },
            {
              label: '',
              type: 'slot',
              prop: 'reviewDeal',
              xl: 3,
              lg: 3,
              md: 3,
              sm: 3
            },
            {
              label: '',
              type: 'label_radio_group',
              disabled: false,
              change: true,
              options: [
                {
                  value: '3',
                  label: '审核通过'
                },
                {
                  value: '4',
                  label: '拒绝通过'
                }
              ],
              placeholder: '',
              prop: 'statusCode',
              xl: 8,
              lg: 8,
              md: 8,
              sm: 8
            },
            {
              label: '',
              type: 'label_input',
              disabled: true,
              placeholder: '请输入拒绝原因',
              prop: 'refuseReason'
            },
            {
              label: '',
              type: 'slot',
              prop: 'process',
              xl: 24,
              lg: 24,
              md: 24,
              sm: 24
            }
          ]
        }
      ]
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
    }
  },
  mounted () {
    if (this.form) {
      this.formData = {
        ...this.form
      }
      if (this.formData.statusCode === '3') {
        this.column[0].content.forEach(item => {
          item.disabled = true
        })
      } else {
        this.column[0].content.forEach(item => {
          item.disabled = false
        })
      }
    }
  },
  methods: {
    // 表单改变
    handleChange(prop, val) {
      if (prop === 'statusCode') {
        if (val === '3') {
          this.column[0].content.forEach(item => {
            if (item.prop === 'refuseReason') {
              item.disabled = true
            }
          })
          this.$set(this.formData, 'refuseReason', '')
        } else {
          this.column[0].content.forEach(item => {
            if (item.prop === 'refuseReason') {
              item.disabled = false
            }
          })
        }
      }
    },
    // 保存
    async saveFormdata () {
      this.$emit('save', this.formData)
      if (this.formData.statusCode === '3') {
        this.$set(this.formData, 'statusName', '认证通过')
        this.$set(this.formData, 'reviewProcessing', '1')
      } else if (this.formData.statusCode === '4') {
        this.$set(this.formData, 'statusName', '认证拒绝')
        this.$set(this.formData, 'reviewProcessing', '0')
      }
      const res = await addSupplierReview(this.formData)
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
</script>
