<template>
  <base-dialog
    :title="$t('打印字段配置')"
    :visible.sync="innerVisible"
    width="60%"
    center
    :is-minus-full="false"
    @close="onCancel"
  >
    <m-form
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
// import { pageApi } from '@/api/system/printModule'
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
        moduleCode: '',
        moduleName: '',
        code: '',
        name: '',
        dataType: '',
        componentName: '',
        serviceName: '',
        remark: ''
      },
      column: [
        {
          title: '基础信息',
          content: [
            {
              label: '模块名称',
              type: 'label_select',
              prop: 'moduleCode',
              options: [],
              labelName: 'name',
              labelVal: 'code',
              change: true
            },
            {
              label: '模板编码',
              type: 'label_input',
              prop: 'code',
              maxlength: 50
            },
            {
              label: '模板名称',
              type: 'label_input',
              prop: 'name',
              maxlength: 50
            },
            {
              label: '数据类型',
              type: 'label_select',
              prop: 'dataType',
              change: true,
              options: [
                { label: 'JSON', value: '1' },
                { label: '服务接口', value: '2' }
              ]
            },
            {
              label: '组件名称',
              type: 'label_input',
              prop: 'componentName',
              maxlength: 50,
              disabled: true,
              rules: []
            },
            {
              label: '服务名称',
              type: 'label_input',
              prop: 'serviceName',
              maxlength: 50,
              disabled: true,
              rules: []
            },
            {
              label: '备注',
              type: 'label_input',
              prop: 'remark',
              genre: 'textarea',
              height: 'auto',
              span: 24
            }
          ]
        }
      ],
      rule: {
        moduleCode: [
          { required: true, message: '请选择', trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: '请输入', trigger: ['blur', 'change'] }
        ],
        name: [
          { required: true, message: '请输入', trigger: ['blur', 'change'] }
        ],
        dataType: [
          { required: true, message: '请选择', trigger: ['blur', 'change'] }
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
    this.getModuleList()
    if (this.currentRow && this.currentRow.id) {
      this.formData = { ...this.currentRow }
    }
  },
  methods: {
    getModuleList() {
      const params = {
        pageNum: 1,
        pageSize: 100
      }
      pageApi(params).then(res => {
        this.column[0].content.find(it => it.prop === 'moduleCode').options = res.rows.map(it => ({
          code: it.code,
          name: `${it.name}(${it.code})`
        }))
      })
    },
    // form change事件
    handleChange(prop, value, options) {
      if (prop === 'moduleCode') {
        let moduleName = ''
        if (value) {
          moduleName = options.find(it => it.code === value).name
        }
        this.formData.moduleName = moduleName
      } else if (prop === 'dataType') {
        let rules = []
        if (value === '2') {
          rules = [{ required: true, message: '请输入', trigger: ['blur', 'change'] }]
          this.column[0].content.find(it => it.prop === 'componentName').disabled = false
          this.column[0].content.find(it => it.prop === 'serviceName').disabled = false
        } else {
          this.column[0].content.find(it => it.prop === 'componentName').disabled = true
          this.column[0].content.find(it => it.prop === 'serviceName').disabled = true
          this.formData.componentName = ''
          this.formData.serviceName = ''
        }
        this.column[0].content.find(it => it.prop === 'componentName').rules = rules
        this.column[0].content.find(it => it.prop === 'serviceName').rules = rules
      }
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
            _api.updateApi(params).then(res => {
              this.$message.success(this.$i18n.tc('保存成功'))
              this.$emit('onSubmit')
              this.loading = false
              this.innerVisible = false
            }).catch(() => {
              this.loading = false
            })
          } else {
            _api.addApi(params).then(res => {
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
