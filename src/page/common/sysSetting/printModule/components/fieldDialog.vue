<template>
  <base-dialog
    :title="$t('字段详细配置')"
    :visible.sync="innerVisible"
    width="55%"
    center
    :is-minus-full="false"
    @close="onCancel"
  >
    <m-form
      ref="baseForm"
      :form-data="formData"
      :column="column"
      :rule="rule"
      :disabled="opType === 'view'"
      :btn-group-visible="false"
      @handleChange="handleChange"
    />

    <span slot="footer" class="dialog-footer">
      <el-button @click="onCancel">{{ $t('取消') }}</el-button>
      <el-button v-if="!(opType === 'view')" type="primary" :loading="loading" @click="submitForm">{{ $t('确定') }}</el-button>
    </span>
  </base-dialog>
</template>
<script>
export default {
  components: {
  },
  props: {
    visible: Boolean,
    fieldList: {
      type: Array,
      default: () => {
        return []
      }
    },
    opType: {
      type: String,
      default: () => {
        return 'add'
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
    this.formData.fieldList = [...this.fieldList]
  },
  methods: {
    // form change事件
    handleChange(prop, value) {

    },
    // 表单表格添加行
    onAddTableLine() {
      this.formData.fieldList.push({
        fieldName: '',
        fieldCode: '',
        remark: '',
        type: '1'
      })
    },
    // 表单表格删除行
    onDelTableLine(row, index) {
      this.formData.fieldList.splice(index, 1)
    },
    // 提交
    submitForm() {
      this.$emit('onSubmit', this.formData.fieldList)
      this.innerVisible = false
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
