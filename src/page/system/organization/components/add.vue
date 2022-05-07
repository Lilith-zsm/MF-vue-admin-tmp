<template>
  <div class="form">
    <m-form
      ref="my_form"
      :form-data="formData"
      :column="column"
      :rule="rule"
      :loading="options.loading"
      :btn-group-visible="false"
      :options="options"
    >
      <template slot="form-img">
        <el-upload
          :limit="1"
          action=""
          :on-preview="handleViewImg"
          :file-list="fileOptions.fileList"
          list-type="picture-card"
          class="disabled"
        >
          <i slot="default" class="el-icon-plus" />
        </el-upload>
      </template>
    </m-form>
    <base-dialog :title="$t('查看')" top="30px" :visible.sync="fileOptions.showImgVisible" :is-minus-full="false">
      <img style="width: 100%" :src="fileOptions.showImgSrc" alt="">
    </base-dialog>
  </div>
</template>
<script>
export default {
  props: {
    parentId: {
      type: [String, Number],
      default() {
        return ''
      }
    },
    visible: Boolean
  },
  data() {
    return {
      formData: {},
      options: {
        loading: false
      },
      fileOptions: {
        fileList: [{ url: 'http://47.115.178.236:22221/business-basic/file/customer/customerImage/20210929/timg (5)_1632883169073.jpg' }],
        showImgVisible: false,
        showImgSrc: ''
      },
      column: [
        {
          content: [
            {
              label: '上级组织',
              prop: 'parentName',
              type: 'label_input',
              disabled: true
            },
            {
              label: '组织编号',
              prop: 'siteCode',
              type: 'label_input'
            },
            {
              label: '组织简称',
              prop: 'siteNameChinese',
              type: 'label_input'
            },
            {
              label: '组织类型',
              prop: 'siteRankName',
              type: 'label_input'
            },
            {
              label: '网点电话',
              prop: 'phone',
              type: 'label_input'
            },
            {
              label: '网点邮箱',
              prop: 'email',
              type: 'label_input'
            },
            {
              label: '负责人',
              prop: 'leader',
              type: 'label_input'
            },
            {
              label: '负责人手机',
              prop: 'mobile',
              type: 'label_input'
            },
            {
              label: '所属财务中心',
              prop: 'finCenterSiteName',
              type: 'label_input'
            },
            {
              label: '所属分拨中心',
              prop: 'allocateCenterName',
              type: 'label_input'
            },
            {
              label: '管理方式',
              prop: 'supervisorModeName',
              type: 'label_input'
            },
            {
              label: '分拣码',
              prop: 'sortingCode',
              type: 'label_input'
            },
            {
              label: '所属国家',
              prop: 'country',
              type: 'label_input'
            },
            {
              label: '所属城市',
              prop: 'city',
              type: 'label_input'
            },
            {
              label: '详细地址',
              prop: 'address',
              type: 'label_textarea',
              autosize: true
            },
            {
              label: '所属公司',
              prop: 'keyworkName',
              type: 'label_input'
            },
            {
              label: '邮编',
              prop: 'region',
              type: 'label_input'
            },
            {
              label: '备注',
              prop: 'remark',
              type: 'label_textarea',
              autosize: true
            },
            {
              label: '网点区域',
              prop: 'remark',
              type: 'label_textarea',
              autosize: true,
              xl: 12,
              lg: 8,
              md: 16,
              sm: 24
            },
            {
              label: '财务中心标识',
              prop: 'finCenterFlag',
              type: 'label_switch',
              activeValue: '1',
              inactiveValue: '0',
              change: true
            },
            {
              label: '分拨中心标识',
              prop: 'allocateCenterFlag',
              type: 'label_switch',
              activeValue: '1',
              inactiveValue: '0'
            },
            {
              label: '是否启用',
              prop: 'status',
              type: 'label_switch',
              activeValue: '0',
              inactiveValue: '1'
            },
            {
              label: '图片',
              prop: 'img',
              type: 'slot'
            }
          ]
        }
      ],
      rule: {
        siteCode: {
          required: true, message: '请输入网点编号', trigger: 'blur'
        },
        siteNameChinese: {
          required: true, message: '请输入网点名称', trigger: 'blur'
        },
        siteRankCode: {
          required: true, message: '请选择机构级别', trigger: 'change'
        },
        sendAddr: {
          required: true, message: '请输入默认发件地', trigger: 'blur'
        },
        country: {
          required: true, message: '请选择所属国家', trigger: 'change'
        }
      }
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
  watch: {
    parentId(val) {
      if (val) this.getParentData()
    }
  },
  created() {
    this.getParentData()
  },
  methods: {
    async getParentData() {
      this.options.loading = true
      try {
        const res = await this.$api.system.organization.getInfo(this.parentId)
        this.$set(this.formData, 'parentName', res.data.siteNameChinese)
        this.$set(this.formData, 'parentId', res.data.id)
      } finally {
        this.options.loading = false
      }
    },
    // 查看图片
    handleViewImg(file) {
      this.fileOptions.showImgSrc = file.url
      this.fileOptions.showImgVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.disabled .el-upload--picture-card {
  display: none!important;
}
/deep/.disabled .el-upload-list__item.is-success .el-upload-list__item-status-label{
  display: none!important;
}
</style>
