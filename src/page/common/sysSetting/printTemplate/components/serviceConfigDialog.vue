<template>
  <base-dialog
    :title="$t('服务配置')"
    :visible.sync="innerVisible"
    width="60%"
    center
    :is-minus-full="false"
    @close="onCancel"
  >
    <my_form1
      ref="baseForm"
      :form-data="formData"
      :column="column"
      :rule="rule"
      :disabled="currentRow && currentRow.opType === 'view'"
      :btn-group-visible="false"
      @handleChange="handleChange"
    />

    <span slot="footer" class="dialog-footer">
      <el-button @click="onCancel">{{ $t('取消') }}</el-button>
      <el-button v-if="!(currentRow && currentRow.opType === 'view')" type="primary" :loading="loading" @click="submitForm">{{ $t('保存') }}</el-button>
    </span>
  </base-dialog>
</template>
<script>
// import * as _api from '@/api/system/printTemplate'
export default {
  components: {
  },
  props: {
    visible: Boolean,
    currentRow: {
      type: Object,
      default: () => {
        return null
      }
    }
  },
  data() {
    return {
      formData: {
        dataType: '',
        componentName: '',
        serviceName: ''
      },
      column: [
        {
          title: '',
          content: [
            {
              label: '数据类型',
              type: 'label_select',
              prop: 'dataType',
              options: [
                { label: 'JSON', value: '1' },
                { label: '打印接口实现', value: '2' }
              ]
            },
            {
              label: '服务名称',
              type: 'label_input',
              prop: 'serviceName',
              maxlength: 50
            },
            {
              label: '组件名称',
              type: 'label_input',
              prop: 'componentName',
              maxlength: 50
            }
          ]
        }
      ],
      rule: {
        dataType: [
          { required: true, message: '请选择', trigger: ['blur', 'change'] }
        ],
        componentName: [
          { required: true, message: '请输入', trigger: ['blur', 'change'] }
        ],
        serviceName: [
          { required: true, message: '请输入', trigger: ['blur', 'change'] }
        ]
      },
      loading: false
    }
  },
  computed: {
    innerVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  mounted() {
    if (this.currentRow && this.currentRow.id) {
      this.formData = { ...this.currentRow }
    }
  },
  methods: {
    // form change事件
    handleChange(prop, value, options) {

    },
    // 提交
    submitForm() {
      this.$refs.baseForm.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const params = {
            ...this.formData
          }
          if (this.currentRow && this.currentRow.id) {
            _api.serviceConfigApi(params).then(res => {
              this.$message.success(this.$i18n.tc('保存成功'))
              this.$emit('onSubmit')
              this.loading = false
              this.innerVisible = false
            }).catch(() => {
              this.loading = false
            })
          }
        }
      })
    },
    // 取消按钮
    onCancel() {
      this.innerVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
