<template>
  <div>
    <base-dialog
      :title="$t('查看供应商')"
      :visible.sync="innerVisible"
      width="1100px"
      :is-minus-full="true"
      :close-on-click-modal="false"
    >
      <el-row>
        <el-col style="text-align: left;">
          <my_form
            :form-data="formData"
            :column="column"
            :go-back="false"
            :options="options"
            :rule="rule"
            :close-hide="true"
            label-width="80px"
            :save-btn-visible="false"
            @handleSave="saveFormdata"
            @handleCancel="innerVisible = false"
          >
            <div slot="form-hide" />
            <div slot="form-title" />
            <!-- 证件附件1 -->
            <div slot="form-photo1">
              <!-- :data="{attachmentUrl: fileName ? fileName : '', attachmentType: '证件图片', businessCode : 'CUSTOMER'}" -->
              <el-upload
                :limit="1"
                :disabled="true"
                :data="{attachmentUrl: [], attachmentType: '证件图片', businessCode : 'CUSTOMER'}"
                :file-list="fileList1"
                :before-upload="beforeUpload1"
                :on-progress="onProgress1"
                :on-success="onSuccess1"
                :on-remove="handleRemove1"
                :action="importFileUrl1"
                list-type="picture-card"
              >
                <i
                  slot="default"
                  class="el-icon-plus"
                />
              </el-upload>
            </div>
            <!-- 证件附件2 -->
            <div slot="form-photo2">
              <!-- :data="{bizId: form ? formData.originBizId : bizId, bizCode: 'SubProduct'}" -->
              <el-upload
                :limit="1"
                :disabled="true"
                :data="{attachmentType: '证件图片', businessCode : 'CUSTOMER'}"
                :file-list="fileList2"
                :on-success="onSuccess2"
                :on-remove="handleRemove2"
                :action="importFileUrl2"
                list-type="picture-card"
              >
                <i
                  slot="default"
                  class="el-icon-plus"
                />
              </el-upload>
            </div>
            <!-- 二维码下载 -->
            <div slot="form-qrcode">
              <el-button
                type="text"
              > {{ $t('下载') }}</el-button>
            </div>
            <!-- 审核状态 -->
            <div slot="form-reviewStatus">
              <div>
                <span>{{ $t('当前状态：') }}</span>
                <span style="margin-left:30px;">{{ $t(formData.statusName) }}</span>
              </div>
            </div>
            <div slot="form-reviewDeal">
              <span>{{ $t('审核处理') }}</span>
            </div>
            <!-- 保存按钮 -->
            <div slot="form-btn">
              <el-button
                type="primary"
              > {{ $t('保存') }}</el-button>
            </div>
            <!-- 处理结果 -->
            <div slot="form-process">
              <div>
                <span>{{ $t('处理时间：') }}</span>
                <span style="margin-left:20px;">{{ $t(formData.updateTime) }}</span>
                <span style="margin-left:30px;">{{ $t('处理人：') }}</span>
                <span style="margin-left:20px;">{{ $t(formData.updateByName) }}</span>
                <span style="margin-left:30px;">{{ $t('处理结果：') }}</span>
                <span style="margin-left:20px;">{{ $t(formData.statusName) }}</span>
              </div>
            </div>
          </my_form>
        </el-col>
      </el-row>
    </base-dialog>
  </div>
</template>
<script>
import { getSubName } from '@/api/common/base/lookUp'
import { addCustomerProfile, putCustomerProfile, importFileUrl } from '@/api/common/base/customerProfile'
export default {
  components: {
  },
  props: {
    form: {
      type: Object,
      default: null
    },
    visible: {
      type: Boolean
    }
  },
  data () {
    return {
      fileList1: [],
      fileList2: [],
      fileName: '',
      importFileUrl2: '',
      importFileUrl1: importFileUrl,
      title: '新增供应商资料',
      options: {
        isScroller: true,
        scrollMaxHeight: 'calc(100vh - 350px)'
      },
      subNameVisible: false,
      websiteTableVisible: false,
      businessVisible: false,
      statusIden: '1',
      formData: {},
      rule: {
        supplierCode: {
          required: true,
          message: '请输入供应商编号',
          trigger: 'blur'
        },
        certificateNumber: {
          required: true,
          message: '请输入证件号码',
          trigger: 'blur'
        },
        certificateTypeCode: {
          required: true,
          message: '请输入证件类型',
          trigger: 'change'
        }
      },
      column: [
        {
          title: '供应商信息',
          content: [
            {
              label: '供应商编号',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入供应商编号',
              prop: 'supplierCode'
            },
            {
              label: '登录用户名',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入登录用户名',
              prop: 'loginUserName'
            },
            {
              label: '客户类型',
              type: 'label_select',
              disabled: false,
              options: [
                {
                  label: '个人用户',
                  value: '0'
                },
                {
                  label: '企业用户',
                  value: '1'
                }
              ],
              placeholder: '请选择客户类型',
              prop: 'customerTypeCode'
            },
            {
              label: '公司名称',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入公司名称',
              prop: 'companyName'
            },
            {
              label: '密码',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入密码',
              prop: 'loginPassword',
              genre: 'password'
            },
            {
              label: '当前状态',
              type: 'label_select',
              disabled: false,
              options: [
                {
                  label: '未提交认证',
                  value: '1'
                },
                {
                  label: '审核中',
                  value: '2'
                },
                {
                  label: '认证通过',
                  value: '3'
                },
                {
                  label: '拒绝',
                  value: '4'
                }
              ],
              placeholder: '请选择当前状态',
              prop: 'statusCode'
            },
            // {
            //   label: '姓名/法人(泰)',
            //   type: 'label_input',
            //   disabled: false,
            //   placeholder: '请输入姓名/法人(泰)',
            //   prop: 'customerNameTha'
            // },
            {
              label: '姓名/法人(中)',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入姓名/法人(中)',
              prop: 'personName'
            },
            {
              label: '性别',
              type: 'label_select',
              disabled: false,
              options: [
                {
                  label: '男',
                  value: '0'
                },
                {
                  label: '女',
                  value: '1'
                }
              ],
              placeholder: '请选择性别',
              prop: 'sexCode'
            },
            {
              label: '联系电话',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入联系电话',
              prop: 'contactPhone'
            },
            {
              label: '手机号码',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入手机号码',
              prop: 'mobilePhone'
            },
            {
              label: '邮箱',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入邮箱',
              prop: 'email'
            },
            {
              label: '行业信息',
              type: 'label_select',
              disabled: false,
              options: [
                {
                  label: '鞋帽',
                  value: '01'
                },
                {
                  label: '电子产品',
                  value: '02'
                }
              ],
              placeholder: '请选择行业信息',
              prop: 'industryInformationCode'
            },
            {
              label: '证件类型',
              type: 'label_select',
              disabled: false,
              options: [
                {
                  label: '身份证',
                  value: '1'
                },
                {
                  label: '户口本',
                  value: '2'
                },
                {
                  label: '护照',
                  value: '3'
                },
                {
                  label: '营业执照',
                  value: '4'
                }
              ],
              placeholder: '请选择证件类型',
              prop: 'certificateTypeCode'
            },
            {
              label: '证件号码',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入邮箱',
              prop: 'certificateNumber'
            },
            {
              label: '注册时间',
              type: 'label_date_picker',
              dateType: 'datetime',
              format: 'yyyy-MM-dd HH:mm:ss',
              disabled: false,
              placeholder: '请选择注册时间',
              prop: 'createTime'
            },
            {
              label: '地址',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入地址',
              xl: 16,
              lg: 16,
              md: 16,
              sm: 16,
              prop: 'address'
            },
            {
              label: '证件附件一',
              type: 'slot',
              prop: 'photo1',
              xl: 10,
              lg: 10,
              md: 10,
              sm: 12,
              height: 'aotu'
            },
            {
              label: '证件附件二',
              type: 'slot',
              prop: 'photo1',
              xl: 10,
              lg: 10,
              md: 10,
              sm: 12,
              height: 'aotu'
            }
          ]
        },
        {
          title: '银行信息',
          content: [
            {
              label: '收款银行名称',
              type: 'label_select',
              options: [],
              labelName: 'subName',
              labelVal: 'subCode',
              disabled: false,
              placeholder: '请选择收款银行名称',
              prop: 'receiveBankCode'
            },
            {
              label: '收款账号',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入收款账号',
              prop: 'receiveAccountNumber'
            }
          ]
        },
        {
          title: '审核处理',
          content: [
            {
              label: '',
              type: 'slot',
              prop: 'reviewStatus',
              xl: 24,
              lg: 24,
              md: 24,
              sm: 24
            },
            {
              label: '',
              type: 'slot',
              prop: 'reviewDeal',
              xl: 3,
              lg: 3,
              md: 3,
              sm: 3
            },
            {
              label: '',
              type: 'label_radio_group',
              disabled: false,
              options: [
                {
                  value: 3,
                  label: '审核通过'
                },
                {
                  value: 4,
                  label: '拒绝通过'
                }
              ],
              placeholder: '',
              prop: 'statusCode',
              xl: 6,
              lg: 6,
              md: 6,
              sm: 6
            },
            {
              label: '',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入拒绝原因',
              prop: 'refuseReason'
            },
            {
              label: '',
              type: 'slot',
              prop: 'btn',
              xl: 3,
              lg: 3,
              md: 3,
              sm: 3
            },
            {
              label: '',
              type: 'slot',
              prop: 'process',
              xl: 24,
              lg: 24,
              md: 24,
              sm: 24
            }
          ]
        }
        // {
        //   title: '启用状态',
        //   content: [
        //     {
        //       label: '',
        //       type: 'label_switch',
        //       activeValue: '0',
        //       inactiveValue: '1',
        //       activeText: '启用',
        //       inactiveText: '禁用',
        //       disabled: false,
        //       prop: 'enabledStatus'
        //     }
        //   ]
        // }
      ]
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
    this.getCustomerProfileSelect()
    if (this.form) {
      this.formData = {
        ...this.form
      }
      this.column[0].content.forEach(item => {
        item.disabled = true
      })
      this.column[1].content.forEach(item => {
        item.disabled = true
      })
      this.column[2].content.forEach(item => {
        item.disabled = true
      })
      this.column[3].content.forEach(item => {
        item.disabled = true
      })
    }
  },
  methods: {
    /**
     * 获取数据字典
     */
    getLookUpData() {
      return new Promise((resove, reject) => {
        getSubName({
          name: 'TRADE,PAPERS,BANK',
          code: '076,075,077'
        }).then((res) => {
          resove(res.data)
        }).catch(err => { reject(err) })
      })
    },
    // 获取主子类别 & 客户资料
    async getCustomerProfileSelect() {
      const data = await this.getLookUpData()
      this.selectData = {
        ...this.selectData,
        ...data
      }
      if (this.column[0].content.length > 0) {
        this.column[0].content.forEach(item => {
          if (item.prop === 'industryInformationCode') {
            this.$set(item, 'options', this.selectData.TRADE)
          }
          if (item.prop === 'certificateTypeCode') {
            this.$set(item, 'options', this.selectData.PAPERS)
          }
        })
        this.column[1].content.forEach(item => {
          if (item.prop === 'receiveBankCode') {
            this.$set(item, 'options', this.selectData.BANK)
          }
        })
      }
    },
    beforeUpload1(file) {
      console.log(file)
    },
    // 图片改变
    onProgress1(event, file, fileList) {
      console.log(event, '1')
      console.log(file, '545')
      console.log(fileList, '545')
      this.fileName = file.url
    },
    // 图片删除
    async handleRemove1(file, fileList) {
      // console.log(file, '删除')
      // const id = []
      // id.push(file.id)
      // const res = await deleteUpload(id)
      // console.log(res)
    },
    // 图片上传成功
    async onSuccess1(response, file, fileList) {
      console.log(this.fileName)
      console.log(response)
      console.log(file)
      console.log(fileList)
    },
    // END
    // 图片删除
    async handleRemove2(file, fileList) {
      // console.log(file, '删除')
      // const id = []
      // id.push(file.id)
      // const res = await deleteUpload(id)
      // console.log(res)
    },
    // 图片上传成功
    onSuccess2(response, file, fileList) {
      console.log(response)
      console.log(file)
      console.log(fileList)
    },
    // END
    // 保存
    async saveFormdata () {
      this.$emit('save', this.formData)
      this.column[0].content.map(item => {
        if (item.prop === 'customerTypeCode') {
          return this.$set(this.formData, 'customerTypeName', this.$Utils.matchValue(item.options, this.formData.customerTypeCode, 'value', 'label'))
        }
        if (item.prop === 'sexCode') {
          return this.$set(this.formData, 'sexName', this.$Utils.matchValue(item.options, this.formData.sexCode, 'value', 'label'))
        }
        if (item.prop === 'statusCode') {
          return this.$set(this.formData, 'statusName', this.$Utils.matchValue(item.options, this.formData.statusCode, 'value', 'label'))
        }
        if (item.prop === 'industryInformationCode') {
          return this.$set(this.formData, 'industryInformationName', this.$Utils.matchValue(item.options, this.formData.industryInformationCode, 'subCode', 'subName'))
        }
        if (item.prop === 'certificateTypeCode') {
          return this.$set(this.formData, 'certificateTypeName', this.$Utils.matchValue(item.options, this.formData.certificateTypeCode, 'subCode', 'subName'))
        }
      })
      this.column[1].content.map(item => {
        if (item.prop === 'receiveBankCode') {
          return this.$set(this.formData, 'receiveBankName', this.$Utils.matchValue(item.options, this.formData.receiveBankCode, 'subCode', 'subName'))
        }
        if (item.prop === 'cusServiceCode') {
          return this.$set(this.formData, 'cusServiceName', this.$Utils.matchValue(item.options, this.formData.cusServiceCode, 'value', 'label'))
        }
        if (item.prop === 'cusLevelCode') {
          return this.$set(this.formData, 'cusLevelName', this.$Utils.matchValue(item.options, this.formData.cusLevelCode, 'value', 'label'))
        }
      })
      if (!this.form) {
        const res = await addCustomerProfile(this.formData)
        if (res.code === 200) {
          this.$message({
            message: this.$i18n.tc(res.msg),
            type: 'success'
          })
          this.innerVisible = false
          this.$emit('onSubmit')
        }
      } else {
        const res = await putCustomerProfile(this.formData)
        if (res.code === 200) {
          this.$message({
            message: this.$i18n.tc(res.msg),
            type: 'success'
          })
          this.innerVisible = false
          this.$emit('onSubmit')
        }
      }
    }
  }
}
</script>
