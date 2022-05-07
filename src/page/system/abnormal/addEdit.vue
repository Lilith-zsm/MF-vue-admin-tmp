<template>
  <div class="form">
    <base-dialog :title="initData.tenantId ? '修改' : '新增'" :visible.sync="innerVisible">
      <m-form
        :form-data="formData"
        :column="column"
        :rule="rules"
        label-width="100px"
        :save-btn-loading="loading"
        @handleSave="handleSave"
        @handleCancel="innerVisible = false"
      />
    </base-dialog>
  </div>
</template>
<script>
export default {
  props: {
    initData: {
      type: Object,
      default: function() {
        return {}
      }
    },
    visible: Boolean
  },
  data() {
    return {
      formData: {},
      column: [
        {
          content: [
            {
              type: 'label_input',
              label: '编号key',
              prop: 'key',
              disabled: this.initData.edit
            },
            {
              type: 'label_input',
              label: '异常信息(中文)',
              prop: 'valueZh',
              disabled: false
            },
            {
              type: 'label_input',
              label: '异常信息(英文)',
              prop: 'valueEn',
              disabled: false
            },
            {
              type: 'label_input',
              label: '异常信息(印尼文)',
              prop: 'valueAr',
              disabled: false
            },
            {
              type: 'label_input',
              label: '异常信息(繁体中文)',
              prop: 'valueTw',
              disabled: false
            },
            {
              type: 'label_input',
              label: '模块名称',
              prop: 'module',
              disabled: false
            }
          ]
        }
      ],
      loading: false,
      EInformationVisible: false,
      img: []
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
    },
    rules() {
      return {
        key: [
          {
            required: true,
            message: '请填写编号key',
            trigger: 'change'
          }
        ],
        valueZh: [
          {
            required: true,
            message: '请填写异常信息(中文)',
            trigger: 'change'
          }
        ]
      }
    }
  },
  mounted() {
    if (this.initData.key) {
      this.formData = { ...this.initData }
    }
  },
  methods: {
    // 保存
    async handleSave() {
      this.loading = true
      const form = {
        ...this.formData
      }
      try {
        await this.$api.system.abnormal.addEdit(form)
        this.message.success('保存成功')
        this.innerVisible = false
        this.$emit('handleSuccessSave', form)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
