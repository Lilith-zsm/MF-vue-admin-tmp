<!--
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-01-05 16:30:03
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-03-25 17:33:44
-->
<template>
  <base-dialog title="主类别信息" :visible.sync="innerVisible" width="500px" :is-minus-full="false">
    <m-form
      :rule="rule"
      :column="column"
      :form-data="formData"
      :save-btn-loading="subLoading"
      @handleSave="saveFormdata"
      @handleCancel="innerVisible = false"
    />
  </base-dialog>
</template>
<script>
export default {
  props: {
    editData: {
      type: Object,
      default: null
    },
    visible: {
      type: Boolean
    }
  },
  data () {
    return {
      subLoading: false,
      formData: {},
      column: [
        {
          title: '',
          content: [
            {
              label: '主类别名称（中）',
              prop: 'mainName',
              type: 'label_input',
              span: 24
            },
            {
              label: '主类别名称（英）',
              prop: 'mainNameEn',
              type: 'label_input',
              span: 24
            },
            {
              label: '主类别名称（泰）',
              prop: 'mainNameTh',
              type: 'label_input',
              span: 24
            }
          ]
        }
      ],
      rule: {
        mainName: { required: true, message: '请输入主类别名称（中）', trigger: 'blur' },
        mainNameEn: { required: true, message: '主类别名称（英）', trigger: 'blur' },
        mainNameTh: { required: true, message: '主类别名称（泰）', trigger: 'blur' }
      }
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
    this.formData = { ...this.editData } || {}
  },
  methods: {
    async saveFormdata () {
      this.subLoading = true
      try {
        await this.$api.common.dictionary.addEditMain(this.formData)
        this.message.success('保存成功')
        this.subLoading = false
        this.$emit('handleSuccess')
      } catch {
        this.subLoading = false
      }
    }
  }
}
</script>
