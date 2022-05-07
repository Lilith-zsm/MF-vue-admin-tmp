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
              label: '客户编号',
              prop: 'code',
              disabled: !!this.initData.tenantId
            },
            {
              type: 'label_input',
              label: '客户名称',
              prop: 'name',
              disabled: false
            },
            {
              type: 'label_date_picker',
              label: '注册时间',
              prop: 'registerTime',
              disabled: false,
              dateType: 'datetime',
              format: 'yyyy-MM-dd HH:mm:ss'
            },
            {
              type: 'label_date_picker',
              label: '有效时间(起)',
              prop: 'startTime',
              disabled: false,
              dateType: 'datetime',
              format: 'yyyy-MM-dd HH:mm:ss'
            },
            {
              type: 'label_date_picker',
              label: '有效时间(止)',
              prop: 'endTime',
              disabled: false,
              dateType: 'datetime',
              format: 'yyyy-MM-dd HH:mm:ss'
            },
            {
              type: 'label_select',
              label: '状态',
              prop: 'status',
              options: [
                {
                  label: '正常',
                  value: '0'
                },
                {
                  label: '冻结',
                  value: '9'
                }
              ]
            },
            {
              type: 'label_switch',
              label: '是否独立db',
              prop: 'ownDb',
              activeText: '是',
              inactiveText: '否'
            },
            {
              type: 'label_input',
              label: '备注',
              prop: 'remark',
              genre: 'textarea',
              rows: 3,
              span: 24
            },
            {
              type: 'label_upload_img',
              label: '公司logo',
              prop: 'companyLogo',
              fixedNumber: [11, 3.6],
              outputType: 'png',
              autoCropWidth: 220,
              autoCropHeight: 72,
              span: 8
            },
            {
              type: 'label_upload_img',
              label: 'logo缩略图',
              prop: 'companyMinLogo',
              fixedNumber: [1, 1],
              outputType: 'png',
              autoCropWidth: 80,
              autoCropHeight: 80,
              span: 8
            },
            {
              type: 'label_upload_img',
              label: '背景图',
              prop: 'fromUrl',
              fixedNumber: [19, 9],
              outputType: 'jpg',
              autoCropWidth: 1900,
              autoCropHeight: 900,
              span: 8
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
        code: [
          {
            required: true,
            message: '请填写客户编号',
            trigger: 'change'
          }
        ],
        name: [
          {
            required: true,
            message: '请填写客户名称',
            trigger: 'change'
          }
        ],
        registerTime: [
          {
            required: true,
            message: '请选择注册时间',
            trigger: 'change'
          }
        ],
        startTime: [
          {
            required: true,
            message: '请选择有效时间(起)',
            trigger: 'change'
          }
        ],
        endTime: [
          {
            required: true,
            message: '请选择有效时间(止)',
            trigger: 'change'
          }
        ],
        companyLogo: [
          {
            required: true,
            message: '请选择公司logo',
            trigger: 'change'
          }
        ],
        companyMinLogo: [
          {
            required: true,
            message: '请选择logo缩略图',
            trigger: 'change'
          }
        ],
        fromUrl: [
          {
            required: true,
            message: '请选择背景图',
            trigger: 'change'
          }
        ]
      }
    }
  },
  mounted() {
    if (this.initData.tenantId) {
      const { companyLogo } = this.initData
      const toArrCompanyLogo = companyLogo ? companyLogo.split(',') : null
      if (toArrCompanyLogo) {
        [this.initData.companyLogo, this.initData.companyMinLogo] = toArrCompanyLogo
      }
      this.formData = { ...this.initData }
    }
  },
  methods: {
    // 保存
    async handleSave() {
      this.loading = true
      const { companyLogo, companyMinLogo } = this.formData
      const form = {
        ...this.formData,
        companyLogo: companyLogo + ',' + companyMinLogo
      }
      delete form.companyMinLogo
      try {
        await this.$api.system.tenant.addEdit(form)
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
