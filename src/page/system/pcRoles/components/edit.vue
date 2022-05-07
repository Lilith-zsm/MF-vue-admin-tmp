<template>
  <base-dialog width="500px" title="角色信息" :visible.sync="innerVisible" :is-minus-full="false">
    <m-form
      :rule="rule"
      :column="column"
      :form-data="formData"
      :save-btn-loading="saveLoading"
      @handleSave="handleSave"
      @handleCancel="innerVisible = false"
    />
  </base-dialog>
</template>
<script>
export default {
  components: {
  },
  props: {
    editData: {
      type: Object,
      default: null
    },
    visible: {
      type: Boolean
    }
  },
  data() {
    return {
      formData: {},
      column: [
        {
          content: [
            {
              label: '角色编号',
              prop: 'roleId',
              type: 'label_input',
              disabled: true,
              xl: 24,
              lg: 24,
              md: 24,
              sm: 24
            },
            {
              label: '角色名称',
              prop: 'roleName',
              type: 'label_input',
              xl: 24,
              lg: 24,
              md: 24,
              sm: 24
            },
            {
              label: '机构级别',
              prop: 'siteRankCode',
              type: 'label_select',
              options: [],
              xl: 24,
              lg: 24,
              md: 24,
              sm: 24
            },
            {
              label: '显示排序',
              prop: 'roleSort',
              type: 'label_input_number',
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12
            },
            {
              label: '状态',
              prop: 'status',
              type: 'label_radio_group',
              options: [
                { label: '启用', value: '0' },
                { label: '停用', value: '1' }
              ],
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12
            }
          ]
        }
      ],
      siteRankOptions: [],
      saveLoading: false
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
    rule() {
      return {
        roleName: [
          { required: true, message: this.$i18n.tc('请输入角色名称'), trigger: 'change' }
        ],
        siteRankCode: [
          { required: true, message: this.$i18n.tc('请选择机构级别'), trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.setOptions()
    this.formData = { ...this.editData }
  },
  methods: {
    async setOptions() {
      const res = await this.$api.common.dictionary.getSub({ code: '002' })
      this.siteRankOptions = res.data['002']
      this.$Utils.columnFilters(this.column, 'siteRankCode').options = this.siteRankOptions
    },
    // 保存
    async handleSave() {
      this.saveLoading = true
      const findSiteRank = this.siteRankOptions.find(item => item.subCode === this.formData.siteRankCode) || {}
      const params = {
        type: '1',
        ...this.formData,
        siteRankName: findSiteRank.subName,
        dsType: 1
      }
      try {
        await this.$api.system.role.addEdit(params)
        this.$emit('onSubmit')
        this.message.success('操作成功')
        this.innerVisible = false
      } catch {
        this.saveLoading = false
      }
    }
  }
}
</script>
<style lang="scss">
</style>

