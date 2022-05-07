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
    <fieldDialog
      v-if="fieldDialogVisible"
      :visible.sync="fieldDialogVisible"
      :field-list="curFieldList"
      @onSubmit="handleSetTableLine"
    />
  </base-dialog>
</template>
<script>
import fieldDialog from './fieldDialog.vue'
export default {
  components: {
    fieldDialog
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
    const isEdit = !!(this.currentRow && (this.currentRow.opType === 'edit'))
    return {
      formData: {
        systemName: '',
        moduleName: '',
        functionName: '',
        code: '',
        name: '',
        remark: '',
        fieldList: []
      },
      column: [
        {
          title: '基础信息',
          content: [
            {
              label: '模块编码',
              type: 'label_input',
              prop: 'code',
              disabled: isEdit,
              maxlength: 50
            },
            {
              label: '模块名称',
              type: 'label_input',
              prop: 'name',
              maxlength: 50
            },
            {
              label: '功能名称',
              type: 'label_input',
              prop: 'functionName',
              maxlength: 50
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
        },
        {
          title: '字段详细',
          tableOption: {
            tableMaxHeight: 500,
            tableKey: 'fieldList',
            addBtnVisible: true,
            onAddTableLine: this.onAddTableLine
          },
          tableColumn: [
            {
              label: '字段名称',
              type: 'label_input',
              prop: 'fieldName'
            },
            {
              label: '字段编码',
              type: 'label_input',
              prop: 'fieldCode'
            },
            {
              label: '字段类型',
              type: 'label_select',
              prop: 'type',
              options: [
                { label: '字段', value: '1' },
                { label: '集合', value: '2' }
              ]
            },
            {
              label: '备注',
              type: 'label_input',
              prop: 'remark'
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
                    {
                      params.row.type === '2'
                        ? <el-button
                          icon='el-icon-setting'
                          circle
                          title={this.$i18n.tc('字段详细配置')}
                          type='warning'
                          plain
                          onClick={() => this.onSetTableLine(params.row, params.rowIndex)}
                        ></el-button>
                        : ''
                    }
                    <el-button
                      icon='el-icon-delete'
                      circle
                      title={this.$i18n.tc('删除')}
                      type='danger'
                      plain
                      onClick={() => this.onDelTableLine(params.row, params.rowIndex)}
                    ></el-button>
                  </div>
                )
              }
            }
          ]
        }
      ],
      rule: {
        systemName: [
          { required: true, message: '请输入', trigger: ['blur', 'change'] }
        ],
        moduleName: [
          { required: true, message: '请输入', trigger: ['blur', 'change'] }
        ],
        functionName: [
          { required: true, message: '请输入', trigger: ['blur', 'change'] }
        ],
        name: [
          { required: true, message: '请输入', trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: '请输入', trigger: ['blur', 'change'] }
        ]
      },
      loading: false,
      fieldDialogVisible: false,
      curFieldIndex: -1,
      curFieldList: []
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
      this.getInfo()
    }
  },
  methods: {
    async getInfo() {
      const res = await this.$api.common.sysSetting.printModule.getInfo(this.currentRow.code)
      this.formData = { ...res.data, fieldList: res.data.fieldList || [] }
    },
    // form change事件
    handleChange(prop, value) {

    },
    // 表单表格添加行
    onAddTableLine() {
      this.formData.fieldList.push({
        fieldName: '',
        fieldCode: '',
        type: '',
        remark: '',
        fieldList: []
      })
    },
    // 表单表格删除行
    onDelTableLine(row, index) {
      this.formData.fieldList.splice(index, 1)
    },
    // 表单设置字段
    onSetTableLine(row, index) {
      this.curFieldList = row.fieldList
      this.curFieldIndex = index
      this.fieldDialogVisible = true
    },
    handleSetTableLine(fieldList) {
      this.formData.fieldList[this.curFieldIndex].fieldList = fieldList
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
