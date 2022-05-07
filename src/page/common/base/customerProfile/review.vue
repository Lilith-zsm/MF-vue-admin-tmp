<template>
  <div>
    <base-dialog
      :title="$t('审核客户资料')"
      :visible.sync="innerVisible"
      width="1200px"
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
            @handleChange="handleChange"
            @handleCancel="innerVisible = false"
            @handleSave="saveFormdata"
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
                <span style="margin-left:30px;">{{ formData.status | status }}</span>
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
                <span style="margin-left:20px;">{{ $t('17/10/2020 11:14:00 ') }}</span>
                <span style="margin-left:30px;">{{ $t('处理人：') }}</span>
                <span style="margin-left:20px;">{{ $t('ANNY') }}</span>
                <span style="margin-left:30px;">{{ $t('处理结果：') }}</span>
                <span style="margin-left:20px;">{{ $t('已认证 ') }}</span>
              </div>
            </div>
          </my_form>
        </el-col>
      </el-row>
    </base-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getReviewList, importFileUrl, addReview } from '@/api/common/base/customerProfile'
export default {
  components: {
  },
  filters: {
    status(val) {
      switch (val) {
      case '1':
        return '未提交认证'
      case '2':
        return '审核中'
      case '3':
        return '认证通过'
      case '4':
        return '拒绝通过'
      default:
        return ''
      }
    }
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
      importFileUrl2: importFileUrl,
      importFileUrl1: importFileUrl,
      title: '审核客户资料',
      options: {
        isScroller: true,
        scrollMaxHeight: 'calc(100vh - 350px)'
      },
      subNameVisible: false,
      websiteTableVisible: false,
      businessVisible: false,
      statusIden: '1',
      formData: {
        customInfoList: [
          {}
        ]
      },
      rule: {
        customerCode: {
          required: true,
          message: '请输入请输入客户编号',
          trigger: 'blur'
        }
      },
      column: [
        {
          title: '客户信息',
          content: [
            {
              label: '客户编号',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入客户编号',
              prop: 'customerCode'
            },
            {
              label: '登录用户名',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入登录用户名',
              prop: 'userName'
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
              prop: 'customerType'
            },
            {
              label: '公司名称',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入公司名称',
              prop: 'companayName'
            },
            {
              label: '密码',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入密码',
              prop: 'password',
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
                  label: '认证拒绝',
                  value: '4'
                }
              ],
              placeholder: '请选择当前状态',
              prop: 'status'
            },
            {
              label: '姓名/法人(泰)',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入姓名/法人(泰)',
              prop: 'customerNameTha'
            },
            {
              label: '姓名/法人(英)',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入姓名/法人(英)',
              prop: 'customerNameEn'
            },
            {
              label: '性别',
              type: 'label_select',
              disabled: false,
              options: [
                {
                  label: '男',
                  value: '1'
                },
                {
                  label: '女',
                  value: '0'
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
              prop: 'mobile'
            },
            {
              label: '手机号码',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入手机号码',
              prop: 'phonenumber'
            },
            {
              label: '邮箱',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入邮箱',
              prop: 'email'
            },
            {
              label: '其它联系方式',
              type: 'label_select',
              disabled: false,
              options: [
                {
                  label: 'LINE',
                  value: 'LINE'
                }
              ],
              placeholder: '请选择其它联系方式',
              prop: 'contactRest'
            },
            {
              label: '其它联系号码',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入其它联系号码',
              prop: 'contactNo'
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
              prop: 'tradeCode'
            },
            {
              label: '证件类型',
              type: 'label_select',
              disabled: false,
              options: [
                {
                  label: '身份证',
                  value: '01'
                }
              ],
              placeholder: '请选择证件类型',
              prop: 'papersCode'
            },
            {
              label: '证件附件一',
              type: 'slot',
              prop: 'photo1',
              xl: 6,
              lg: 8,
              md: 8,
              sm: 12,
              height: 'aotu'

            },
            {
              label: '证件附件二',
              type: 'slot',
              prop: 'photo1',
              xl: 6,
              lg: 8,
              md: 8,
              sm: 12,
              height: 'aotu'
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
              label: '',
              type: 'slot',
              prop: 'hide',
              xl: 18,
              lg: 18,
              md: 18,
              sm: 18,
              height: 'aotu'
            },
            {
              label: '所属客户',
              type: 'label_select',
              disabled: false,
              options: [
                {
                  label: 'T20201020001',
                  value: 'T20201020001'
                }
              ],
              placeholder: '请选择所属客户',
              prop: 'belongCustomerCode'
            },
            {
              label: '服务类型',
              type: 'slot',
              prop: 'title',
              xl: 3,
              lg: 3,
              md: 3,
              sm: 3
            },
            {
              label: '转运服务',
              text: '',
              type: 'label_checkbox',
              trueLabel: '0',
              falseLabel: '1',
              disabled: false,
              prop: 'isTransfer',
              xl: 3,
              lg: 3,
              md: 3,
              sm: 3
            },
            {
              label: '云仓服务',
              text: '',
              type: 'label_checkbox',
              trueLabel: '0',
              falseLabel: '1',
              disabled: false,
              prop: 'isEc',
              xl: 3,
              lg: 3,
              md: 3,
              sm: 3
            },
            {
              label: 'GTC服务',
              text: '',
              type: 'label_checkbox',
              trueLabel: '0',
              falseLabel: '1',
              disabled: false,
              prop: 'isGtc',
              xl: 3,
              lg: 3,
              md: 3,
              sm: 3
            }
          ]
        },
        {
          title: '补充信息',
          content: [
            {
              label: '销售员代号',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入销售员代号',
              prop: 'salespersonCode'
            },
            {
              label: '代理客户代号',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入代理客户代号',
              prop: 'agencyCusCode'
            },
            {
              label: '导购员',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入导购员',
              prop: 'oyshoName'
            },
            {
              label: '中方跟账人员',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入中方跟账人员',
              prop: 'withaccountNameCn'
            },
            {
              label: '泰方跟账人员',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入泰方跟账人员',
              prop: 'withaccountNameTha'
            },
            {
              label: '泰国客服人员',
              type: 'label_select',
              options: [
                {
                  label: '测试',
                  value: '01'
                }
              ],
              disabled: false,
              placeholder: '请选择泰国客服人员',
              prop: 'cusServiceCode'
            },
            {
              label: '运费等级',
              type: 'label_select',
              options: [
                {
                  label: '一',
                  value: '01'
                },
                {
                  label: '二',
                  value: '02'
                }
              ],
              disabled: false,
              placeholder: '请输入运费等级',
              prop: 'freightLevelCode'
            },
            {
              label: '运费账期',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入运费账期',
              prop: 'freightPeriod'
            },
            {
              label: '贷款账期',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入贷款账期',
              prop: 'loanPeriod'
            },
            {
              label: '透支额度',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入透支额度',
              prop: 'overdraftLimit'
            },
            {
              label: '客户等级',
              type: 'label_select',
              disabled: false,
              options: [
                {
                  label: 'A',
                  value: '01'
                },
                {
                  label: 'B',
                  value: '02'
                },
                {
                  label: 'C',
                  value: '03'
                },
                {
                  label: 'D',
                  value: '04'
                },
                {
                  label: 'E',
                  value: '05'
                },
                {
                  label: 'F',
                  value: '06'
                },
                {
                  label: 'G',
                  value: '07'
                }
              ],
              placeholder: '请输入客户等级',
              prop: 'cusLevelCode'
            },
            {
              label: '二维码下载',
              type: 'slot',
              prop: 'qrcode',
              xl: 4,
              lg: 4,
              md: 4,
              sm: 4
            },
            {
              label: '上架服务',
              text: '',
              type: 'label_checkbox',
              trueLabel: '1',
              falseLabel: '0',
              disabled: false,
              prop: 'isShelve',
              xl: 3,
              lg: 3,
              md: 3,
              sm: 3
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
              change: true,
              options: [
                {
                  value: '3',
                  label: '审核通过'
                },
                {
                  value: '4',
                  label: '拒绝通过'
                }
              ],
              placeholder: '',
              prop: 'status',
              xl: 6,
              lg: 6,
              md: 6,
              sm: 6
            },
            {
              label: '',
              type: 'label_input',
              disabled: true,
              placeholder: '请输入拒绝原因',
              prop: 'checkDesc'
            }
            // {
            //   label: '',
            //   type: 'slot',
            //   prop: 'btn',
            //   xl: 3,
            //   lg: 3,
            //   md: 3,
            //   sm: 3
            // }
            // {
            //   label: '',
            //   type: 'slot',
            //   prop: 'process',
            //   xl: 24,
            //   lg: 24,
            //   md: 24,
            //   sm: 24
            // }
          ]
        },
        {
          title: '审核信息',
          tableOption: {
            tableKey: 'customInfoList',
            addBtnVisible: false,
            onAddTableLine: this.onAddTableLine
          },
          tableColumn: [
            {
              label: '处理时间',
              prop: 'checkTime',
              disabled: false
            },
            {
              label: '处理人',
              prop: 'checkByName',
              disabled: false
            },
            {
              label: '处理结果',
              prop: 'checkDesc',
              disabled: false
            },
            {
              label: '审核状态',
              prop: 'checkName',
              disabled: false
            }
          ]
        }
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
    },
    ...mapGetters(['userInfo'])
  },
  mounted () {
    this.column[0].content.forEach(item => {
      item.disabled = true
    })
    this.column[1].content.forEach(item => {
      item.disabled = true
    })
    this.formData = {
      ...this.form,
      customInfoList: []
    }
    this.getReviewList()
    if (this.formData.status === '1' || this.formData.status === '3') {
      this.column[2].content.forEach(item => {
        if (item.prop === 'status') {
          item.disabled = true
        }
        if (item.prop === 'checkDesc') {
          item.disabled = true
        }
      })
    } else {
      this.column[2].content.forEach(item => {
        if (item.prop === 'status') {
          item.disabled = false
        }
        if (item.prop === 'checkDesc') {
          item.disabled = false
        }
      })
    }
  },
  methods: {
    // 表单改变
    handleChange(prop, val) {
      if (prop === 'status') {
        if (val === '3') {
          this.column[2].content.forEach(item => {
            if (item.prop === 'status') {
              item.disabled = true
            }
          })
        } else {
          this.column[2].content.forEach(item => {
            if (item.prop === 'status') {
              item.disabled = false
            }
          })
        }
      }
    },
    // 审核信息查询
    async getReviewList() {
      const res = await getReviewList({ customerId: this.form.id })
      this.formData.customInfoList = res.rows
      console.log(this.formData)
    },
    // 表单表格添加行
    onAddTableLine() {
      this.formData.customInfoList.push({})
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
        if (item.prop === 'sexCode') {
          return this.$set(this.formData, 'sexName', this.$Utils.matchValue(item.options, this.formData.sexCode, 'value', 'label'))
        }
        if (item.prop === 'tradeCode') {
          return this.$set(this.formData, 'tradeName', this.$Utils.matchValue(item.options, this.formData.tradeCode, 'value', 'label'))
        }
        if (item.prop === 'papersCode') {
          return this.$set(this.formData, 'papersName', this.$Utils.matchValue(item.options, this.formData.papersCode, 'value', 'label'))
        }
      })
      this.column[1].content.map(item => {
        if (item.prop === 'freightLevelCode') {
          return this.$set(this.formData, 'freightLevelName', this.$Utils.matchValue(item.options, this.formData.freightLevelCode, 'value', 'label'))
        }
        if (item.prop === 'cusServiceCode') {
          return this.$set(this.formData, 'cusServiceName', this.$Utils.matchValue(item.options, this.formData.cusServiceCode, 'value', 'label'))
        }
        if (item.prop === 'cusLevelCode') {
          return this.$set(this.formData, 'cusLevelName', this.$Utils.matchValue(item.options, this.formData.cusLevelCode, 'value', 'label'))
        }
      })
      if (this.form) {
        this.$set(this.formData, 'checkByName', this.userInfo.userName)
        const res = await addReview({ customerId: this.form.id, checkBy: this.userInfo.userId, checkName: this.formData.status === '3' ? '认证通过' : '认证拒绝', checkByName: this.formData.checkByName, checkCode: this.formData.status, checkDesc: this.formData.checkDesc })
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
