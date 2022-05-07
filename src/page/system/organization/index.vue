<!--
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2021-12-30 16:06:04
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-03-24 14:25:30
-->
<template>
  <div class="common-wrap">
    <el-row :gutter="5">
      <el-col :span="6">
        <website-tree
          ref="siteTree"
          :operation="treeOperation"
          @handleLabelClick="handleLabelClick"
        />
      </el-col>
      <el-col :span="18">
        <div class="common-box">
          <m-form
            v-loading="formLoading"
            :form-data="formData"
            :options="{
              isScroller: true,
              scrollHeight: computContentHeight()
            }"
            :disabled="formStatus === 'view'"
            :column="column"
            :rule="rules"
            label-width="100px"
            :save-btn-loading="loading"
            @handleSave="handleSave"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import websiteTree from '@/components/websiteTree'
export default {
  name: 'Organization',
  components: {
    websiteTree
  },
  data() {
    return {
      formData: {},
      currentSite: {},
      treeOperation: {
        data: [
          {
            title: '编辑',
            icon: 'el-icon-edit',
            handleClick: (row) => {
              this.currentSite = { ...row }
              this.getInfoData()
              this.formStatus = 'edit'
            }
          },
          {
            title: '添加下级',
            icon: 'el-icon-plus',
            handleClick: (row) => {
              this.formStatus = 'add'
              for (const i in this.formData) {
                this.formData[i] = null
              }
              this.$set(this.formData, 'parentName', row.label)
              this.$set(this.formData, 'parentId', row.id)
            }
          },
          {
            title: '删除',
            icon: 'el-icon-delete',
            handleClick: (row) => {
              this.$confirm(this.$i18n.tc('是否确定删除该数据?'), this.$i18n.tc('提示'), {
                confirmButtonText: this.$i18n.tc('确定'),
                cancelButtonText: this.$i18n.tc('取消')
              }).then(async () => {
                await this.$api.system.organization.delete(row.id)
                this.$refs.siteTree.getWebsiteData()
              }).catch(() => {})
            }
          }
        ],
        width: 110
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
              type: 'label_input',
              span: 12
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
              type: 'label_input',
              genre: 'textarea'
            },
            {
              label: '网点区域',
              prop: 'remark',
              type: 'label_input',
              genre: 'textarea'
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
              type: 'label_upload_img',
              label: '图片',
              prop: 'img',
              fixedNumber: [1, 1],
              autoCropWidth: 800,
              autoCropHeight: 800
            }
          ]
        }
      ],
      loading: false,
      formLoading: false,
      formStatus: 'view'
    }
  },
  computed: {
    rules() {
      return {
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
  methods: {
    async handleSave() {
      this.loading = true
      try {
        await this.formStatus === 'edit' ? this.$api.system.organization.edit(this.formData) : this.$api.system.organization.add(this.formData)
        this.message.success('保存成功')
      } finally {
        this.loading = false
      }
    },
    computContentHeight() {
      return this.$Utils.setContentHeight(50)
    },
    async getInfoData() {
      this.formLoading = true
      try {
        const res = await this.$api.system.organization.getInfo(this.currentSite.id)
        this.formData = res.data
      } finally {
        this.formLoading = false
      }
    },
    handleLabelClick(row) {
      this.currentSite = { ...row }
      this.getInfoData()
      this.formStatus = 'view'
    }
  }
}
</script>
<style lang="scss" scoped>
.common-box {
  position: relative;
  padding: 0 20px;
}
</style>
