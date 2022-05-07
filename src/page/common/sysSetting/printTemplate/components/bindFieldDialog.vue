<template>
  <base-dialog
    :title="$t('绑定字段')"
    :visible.sync="innerVisible"
    width="50%"
    center
    :is-minus-full="false"
    @close="onCancel"
  >
    <m-form
      ref="baseForm"
      :form-data="formData"
      :column="column"
      :rule="rule"
      :btn-group-visible="false"
      @handleChange="handleChange"
    />
    <span slot="footer" class="dialog-footer">
      <el-button @click="onCancel">{{ $t('取消') }}</el-button>
      <el-button type="primary" :loading="loading" @click="submitForm">{{ $t('确定') }}</el-button>
    </span>
  </base-dialog>
</template>
<script>
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
    },
    fieldList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      formData: {
        fieldList: []
      },
      column: [
        {
          title: '',
          tableOption: {
            tableKey: 'fieldList',
            addBtnVisible: true,
            onAddTableLine: this.onAddTableLine
          },
          tableColumn: [
            {
              label: '列名',
              type: 'label_select',
              prop: 'fieldCode',
              options: this.fieldList,
              labelVal: 'fieldCode',
              labelName: 'fieldName',
              handleChange: (val, { row }) => {
                if (val) {
                  row.fieldName = this.fieldList.find(it => it.fieldCode === val).fieldName
                } else {
                  row.fieldName = ''
                }
              }
            },
            {
              label: '字段代码',
              prop: 'fieldCode'
            },
            {
              label: '宽度(%)',
              prop: 'width',
              type: 'label_input_number',
              precision: 0
            },
            {
              prop: 'controlBtn',
              type: 'controlBtn',
              label: '操作',
              width: 140,
              align: 'center',
              fixed: 'right',
              btnList: [
                {
                  isDel: true,
                  type: 'success',
                  btnName: '上移',
                  icon: 'el-icon-top',
                  btnFun: this.onUpTableLine
                },
                {
                  isDel: true,
                  type: 'warning',
                  btnName: '下移',
                  icon: 'el-icon-bottom',
                  btnFun: this.onDownTableLine
                },
                {
                  isDel: true,
                  type: 'danger',
                  btnName: '删除',
                  icon: 'el-icon-delete',
                  btnFun: this.onDelTableLine
                }
              ]
            }
          ]
        }
      ],
      rule: {
        node: [
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
    if (this.currentRow) {
      this.formData = { ...this.currentRow }
    }
  },
  methods: {
    // form change事件
    handleChange(prop, value) {

    },
    // 表单表格添加行
    onAddTableLine() {
      this.formData.fieldList.push({})
    },
    // 表单表格删除行
    onDelTableLine(row, index) {
      this.formData.fieldList.splice(index, 1)
    },
    // 上移
    onUpTableLine(row, index) {
      if (index === 0) {
        this.$message.warning('已经是第一行')
        return
      }
      this.formData.fieldList.splice(index, 1)
      this.formData.fieldList.splice(index - 1, 0, row)
    },
    // 下移
    onDownTableLine(row, index) {
      if (index === this.formData.fieldList.length - 1) {
        this.$message.warning('已经是最后一行')
        return
      }
      this.formData.fieldList.splice(index, 1)
      this.formData.fieldList.splice(index + 1, 0, row)
    },
    // 提交
    submitForm() {
      this.$refs.baseForm.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('handleBindField', this.formData)
          this.innerVisible = false
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
