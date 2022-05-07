<template>
  <div class="form">
    <m-form
      ref="my_form"
      :form-data="formData"
      :column="column"
      :disabled="true"
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
    siteId: {
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
              type: 'label_input',
              prop: 'parentName'
            },
            {
              label: '组织编号',
              type: 'label_input',
              prop: 'siteCode'
            },
            {
              label: '组织简称',
              type: 'label_input',
              prop: 'siteNameChinese'
            },
            {
              label: '组织类型',
              type: 'label_input',
              prop: 'siteRankName'
            },
            {
              label: '网点电话',
              type: 'label_input',
              prop: 'phone'
            },
            {
              label: '网点邮箱',
              type: 'label_input',
              prop: 'email'
            },
            {
              label: '负责人',
              type: 'label_input',
              prop: 'leader'
            },
            {
              label: '负责人手机',
              type: 'label_input',
              prop: 'mobile'
            },
            {
              label: '所属财务中心',
              type: 'label_input',
              prop: 'finCenterSiteName'
            },
            {
              label: '所属分拨中心',
              type: 'label_input',
              prop: 'allocateCenterName'
            },
            {
              label: '管理方式',
              type: 'label_input',
              prop: 'supervisorModeName'
            },
            {
              label: '分拣码',
              type: 'label_input',
              prop: 'sortingCode'
            },
            {
              label: '所属国家',
              type: 'label_input',
              prop: 'country'
            },
            {
              label: '所属城市',
              type: 'label_input',
              prop: 'city'
            },
            {
              label: '详细地址',
              type: 'label_textarea',
              prop: 'address',
              autosize: true
            },
            {
              label: '所属公司',
              type: 'label_input',
              prop: 'keyworkName'
            },
            {
              label: '邮编',
              type: 'label_input',
              prop: 'region'
            },
            {
              label: '备注',
              type: 'label_textarea',
              prop: 'remark',
              autosize: true
            },
            {
              label: '网点区域',
              type: 'label_textarea',
              prop: 'remark',
              autosize: true,
              xl: 12,
              lg: 8,
              md: 16,
              sm: 24
            },
            {
              label: '财务中心标识',
              type: 'label_switch',
              prop: 'finCenterFlag',
              activeValue: '1',
              inactiveValue: '0',
              change: true
            },
            {
              label: '分拨中心标识',
              type: 'label_switch',
              prop: 'allocateCenterFlag',
              activeValue: '1',
              inactiveValue: '0'
            },
            {
              label: '是否启用',
              type: 'label_switch',
              prop: 'status',
              activeValue: '0',
              inactiveValue: '1'
            },
            {
              label: '图片',
              type: 'slot',
              prop: 'img'
            }
          ]
        }

      ]
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
    siteId(val) {
      if (val) this.getData()
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      this.options.loading = true
      try {
        const res = await this.$api.system.organization.getInfo(this.siteId)
        this.formData = res.data
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
