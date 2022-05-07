<template>
  <div class="form">
    <base-dialog width="600px" :title="initData.tenantId ? '修改' : '新增'" :visible.sync="innerVisible">
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
              label: '模板类型',
              prop: 'templateTypeCode',
              disabled: false,
              span: 24
            },
            {
              type: 'label_input',
              label: '模板内容',
              prop: 'templateContent',
              disabled: false,
              genre: 'textarea',
              rows: 4,
              span: 24
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
