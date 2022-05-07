<template>
  <div>
    <base-dialog
      :title="form? $t('修改客户资料') : $t('新增客户资料')"
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
            @handleCancel="innerVisible = false"
            @handleSave="saveFormdata"
          >
            <div slot="form-hide" />
            <div slot="form-title" />
            <!-- 证件附件1 -->
            <div
              slot="form-photo1"
              style="margin-bottom: 20px;"
            >
              <!-- :data="{attachmentUrl: fileName ? fileName : '', attachmentType: '证件图片', businessCode : 'CUSTOMER'}" -->
              <el-upload
                :limit="1"
                :file-list="fileList1"
                :auto-upload="false"
                :before-upload="beforeUpload1"
                :on-change="onChange1"
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
            <div
              slot="form-photo2"
              style="margin-bottom: 20px;"
            >
              <!-- :data="{bizId: form ? formData.originBizId : bizId, bizCode: 'SubProduct'}" -->
              <el-upload
                :limit="1"
                :auto-upload="false"
                :file-list="fileList2"
                :on-change="onChange1"
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
              <el-button type="text"> {{ $t('下载') }}</el-button>
            </div>
            <!-- 审核状态 -->
            <div slot="form-reviewStatus">
              <div>
                <span>{{ $t('当前状态：') }}</span>
                <span style="margin-left:30px;">{{ $t('待审核 ') }}</span>
              </div>
            </div>
            <div slot="form-reviewDeal">
              <span>{{ $t('审核处理') }}</span>
            </div>
            <!-- 保存按钮 -->
            <div slot="form-btn">
              <el-button type="primary"> {{ $t('保存') }}</el-button>
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
    <!-- 销售员代号 -->
    <E-Information
      v-if="empSalespersonVisible"
      :visible.sync="empSalespersonVisible"
      @submit="empSalespersonSubmit"
    />
    <!-- 导购员 -->
    <E-Information
      v-if="empOyshoVisible"
      :visible.sync="empOyshoVisible"
      @submit="empOyshoSubmit"
    />
    <!-- 中方跟账人员 -->
    <E-Information
      v-if="empWithaccountVisible"
      :visible.sync="empWithaccountVisible"
      @submit="empWithaccountSubmit"
    />
    <!-- 泰方跟账人员 -->
    <E-Information
      v-if="empWithaccountThVisible"
      :visible.sync="empWithaccountThVisible"
      @submit="empWithaccountThSubmit"
    />
    <!-- 泰方客服人员 -->
    <E-Information
      v-if="empCusServiceVisible"
      :visible.sync="empCusServiceVisible"
      @submit="empCusServiceSubmit"
    />
    <!-- 中方跟单人员 -->
    <E-Information
      v-if="empTypeVisible"
      :documentary-type="'1'"
      :visible.sync="empTypeVisible"
      @submit="empTypeSubmit"
    />
    <!-- 物流跟单人员 -->
    <E-Information
      v-if="empMerchandiserThVisible"
      :documentary-type="'2'"
      :visible.sync="empMerchandiserThVisible"
      @submit="empMerchandiserThSubmit"
    />
  </div>
</template>
<script>
import { getSubName } from '@/api/common/base/lookUp'
import EInformation from '@/components/EInformation'
import { addCustomerProfile, putCustomerProfile, importFileUrl, getUploadCustomerPro, getCustomerProfileDetail, getCustomerProfileSelect } from '@/api/common/base/customerProfile'
export default {
  components: {
    EInformation
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
      empMerchandiserThVisible: false,
      empTypeVisible: false,
      empCusServiceVisible: false,
      empWithaccountThVisible: false,
      empWithaccountVisible: false,
      empOyshoVisible: false,
      empSalespersonVisible: false,
      fileList1: [],
      fileList2: [],
      importFileUrl2: importFileUrl,
      importFileUrl1: importFileUrl,
      title: '新增客户资料',
      options: {
        isScroller: true,
        scrollMaxHeight: 'calc(100vh - 350px)'
      },
      subNameVisible: false,
      websiteTableVisible: false,
      businessVisible: false,
      statusIden: '1',
      formData: {
        fileList: [{}]
      },
      rule: {
        customerCode: {
          required: true,
          message: '请输入客户编号',
          trigger: 'blur'
        },
        papersCode: {
          required: true,
          message: '请选择证件类型',
          trigger: 'change'
        },
        userName: {
          required: true,
          message: '请输入登录用户名',
          trigger: 'blur'
        },
        password: {
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        },
        paymentSiteCode: {
          required: true,
          message: '请选择结算组织',
          trigger: 'change'
        },
        siteCode: {
          required: true,
          message: '请选择所属组织',
          trigger: 'change'
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
                  label: '拒绝',
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
              label: '姓名/法人(中)',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入姓名/法人(中)',
              prop: 'customerNameCh'
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
              labelName: 'subName',
              labelVal: 'subCode',
              options: [],
              placeholder: '请选择其它联系方式',
              prop: 'contactRestCode'
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
              labelName: 'subName',
              labelVal: 'subCode',
              options: [],
              placeholder: '请选择行业信息',
              prop: 'tradeCode'
            },
            {
              label: '证件类型',
              type: 'label_select',
              disabled: false,
              options: [],
              placeholder: '请选择证件类型',
              prop: 'papersCode'
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
              label: '所属组织',
              type: 'label_select',
              disabled: false,
              options: [
                {
                  label: '6PL中心',
                  value: '88802'
                }
              ],
              placeholder: '请选择所属组织',
              prop: 'siteCode'
            },
            // {
            //   label: '',
            //   type: 'slot',
            //   prop: 'hide',
            //   xl: 10,
            //   lg: 8,
            //   md: 8,
            //   sm: 8
            // },
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
            },
            {
              label: '证件附件一',
              type: 'slot',
              prop: 'photo1',
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              height: 'aotu'

            },
            {
              label: '证件附件二',
              type: 'slot',
              prop: 'photo2',
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              height: 'aotu'
            }
          ]
        },
        {
          title: '补充信息',
          content: [
            {
              label: '销售员代号',
              type: 'label_input_clearable',
              disabled: false,
              handleClick: () => {
                this.empSalespersonVisible = true
              },
              handleClear: () => {
                this.$set(this.formData, 'salespersonName', null)
              },
              placeholder: '请输入销售员代号',
              prop: 'salespersonCode'
            },
            {
              label: '代理客户代号',
              type: 'label_select',
              disabled: false,
              options: [],
              labelName: 'customerCode',
              labelVal: 'customerCode',
              placeholder: '请输入代理客户代号',
              prop: 'agencyCusCode'
            },
            {
              label: '导购员',
              type: 'label_input_clearable',
              disabled: false,
              handleClick: () => {
                this.empOyshoVisible = true
              },
              handleClear: () => {
                this.$set(this.formData, 'oyshoCode', null)
              },
              placeholder: '请输入导购员',
              prop: 'oyshoName'
            },
            {
              label: '中方跟账人员',
              type: 'label_input_clearable',
              disabled: false,
              placeholder: '请输入中方跟账人员',
              handleClick: () => {
                this.empWithaccountVisible = true
              },
              handleClear: () => {
                this.$set(this.formData, 'withaccountCodeCn', null)
              },
              prop: 'withaccountNameCn'
            },
            {
              label: '泰方跟账人员',
              type: 'label_input_clearable',
              disabled: false,
              placeholder: '请输入泰方跟账人员',
              handleClick: () => {
                this.empWithaccountThVisible = true
              },
              handleClear: () => {
                this.$set(this.formData, 'withaccountCodeTha', null)
              },
              prop: 'withaccountNameTha'
            },
            {
              label: '泰国客服人员',
              type: 'label_input_clearable',
              handleClick: () => {
                this.empWithaccountThVisible = true
              },
              handleClear: () => {
                this.$set(this.formData, 'cusServiceCode', null)
              },
              disabled: false,
              placeholder: '请选择泰国客服人员',
              prop: 'cusServiceName'
            },
            {
              label: '中方跟单人员',
              type: 'label_input_clearable',
              disabled: false,
              placeholder: '请选择中方跟单人员',
              handleClick: () => {
                this.empTypeVisible = true
              },
              handleClear: () => {
                this.$set(this.formData, 'merchandiserCodeCn', null)
              },
              prop: 'merchandiserNameCn'
            },
            {
              label: '物流跟单人员',
              type: 'label_input_clearable',
              disabled: false,
              placeholder: '请选择物流跟单人员',
              handleClick: () => {
                this.empMerchandiserThVisible = true
              },
              handleClear: () => {
                this.$set(this.formData, 'merchandiserLogisticsCode', null)
              },
              prop: 'merchandiserLogisticsName'
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
              type: 'label_input_number',
              disabled: false,
              max: 99999,
              min: 1,
              placeholder: '请输入运费账期',
              prop: 'freightPeriod'
            },
            {
              label: '贷款账期',
              type: 'label_input_number',
              max: 99999,
              min: 1,
              disabled: false,
              placeholder: '请输入贷款账期',
              prop: 'loanPeriod'
            },
            {
              label: '透支额度',
              type: 'label_input_number',
              disabled: false,
              max: 99999,
              min: 1,
              placeholder: '请输入透支额度',
              prop: 'overdraftLimit'
            },
            {
              label: '是否共享客户',
              type: 'label_select',
              disabled: false,
              options: [
                {
                  label: '是',
                  value: '1'
                },
                {
                  label: '否',
                  value: '0'
                }
              ],
              placeholder: '请选择是否共享客户',
              prop: 'isShare'
            },
            {
              label: '结算组织',
              type: 'label_select',
              disabled: false,
              options: [
                {
                  label: 'CTW中心',
                  value: '88801'
                }
              ],
              placeholder: '请选择结算组织',
              prop: 'paymentSiteCode'
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
              label: '第三方客户标识',
              type: 'label_select',
              disabled: false,
              options: [
                {
                  label: '是',
                  value: '1'
                },
                {
                  label: '否',
                  value: '0'
                }
              ],
              placeholder: '请选择第三方客户标识',
              prop: 'isThird'
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
        //       prop: 'userStatus'
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
        fileList: []
      }
      this.column[0].content.forEach(item => {
        if (item.prop === 'customerCode') {
          item.disabled = true
        }
        if (item.prop === 'userName') {
          item.disabled = true
        }
        if (item.prop === 'password') {
          item.disabled = true
        }
      })
      this.getDetail(this.form.id)
      // this.formData = {
      //   ...this.form
      // }
      // if (this.formData.fileList.length > 0) {
      //   this.formData.fileList.forEach(item => {
      //     const params = {
      //       name: '',
      //       url: item.attachmentUrl
      //     }
      //     this.fileList.push(params)
      //   })
      // }
    }
  },
  methods: {
    empMerchandiserThSubmit(val) {
      this.$set(this.formData, 'merchandiserLogisticsName', val.empName)
      this.$set(this.formData, 'merchandiserLogisticsCode', val.empCode)
      this.empMerchandiserThVisible = false
    },
    // 中国跟单人员
    empTypeSubmit(val) {
      this.$set(this.formData, 'merchandiserNameCn', val.empName)
      this.$set(this.formData, 'merchandiserCodeCn', val.empCode)
      this.empTypeVisible = false
    },
    // 泰国客服人员
    empCusServiceSubmit(val) {
      this.$set(this.formData, 'cusServiceName', val.empName)
      this.$set(this.formData, 'cusServiceCode', val.empCode)
      this.empWithaccountThVisible = false
    },
    // 泰方跟账人员
    empWithaccountThSubmit(val) {
      this.$set(this.formData, 'withaccountNameTha', val.empName)
      this.$set(this.formData, 'withaccountCodeTha', val.empCode)
      this.empWithaccountThVisible = false
    },
    // 中方跟账人员
    empWithaccountSubmit(val) {
      this.$set(this.formData, 'withaccountNameCn', val.empName)
      this.$set(this.formData, 'withaccountCodeCn', val.empCode)
      this.empWithaccountVisible = false
    },
    // 导购员
    empOyshoSubmit(val) {
      this.$set(this.formData, 'oyshoName', val.empName)
      this.$set(this.formData, 'oyshoCode', val.empCode)
      this.empOyshoVisible = false
    },
    // 销售员员工资料
    empSalespersonSubmit(val) {
      this.$set(this.formData, 'salespersonName', val.empName)
      this.$set(this.formData, 'salespersonCode', val.empCode)
      this.empSalespersonVisible = false
    },
    /**
     * 获取数据字典
     */
    getLookUpData() {
      return new Promise((resove, reject) => {
        getSubName({
          name: 'TRADE,PAPERS,CONTACTREST',
          code: '073,075,074'
        }).then((res) => {
          resove(res.data)
        }).catch(err => { reject(err) })
      })
    },
    // 获取主子类别 & 客户资料
    async getCustomerProfileSelect() {
      const res = await getCustomerProfileSelect()
      const data = await this.getLookUpData()
      this.selectData = {
        ...this.selectData,
        ...data
      }
      if (res.code === 200) {
        if (this.column[0].content.length > 0) {
          this.column[0].content.forEach(item => {
            if (item.prop === 'tradeCode') {
              this.$set(item, 'options', this.selectData.TRADE)
            }
            if (item.prop === 'papersCode') {
              this.$set(item, 'options', this.selectData.PAPERS)
            }
            if (item.prop === 'contactRestCode') {
              this.$set(item, 'options', this.selectData.CONTACTREST)
            }
          })
        }
        if (this.column[1].content.length > 0) {
          this.column[1].content.forEach(item => {
            if (item.prop === 'agencyCusCode') {
              this.$set(item, 'options', res.data)
            }
          })
        }
      }
    },
    // 获取详情
    async getDetail (id) {
      const res = await getCustomerProfileDetail(id)
      console.log(res)
      if (res.code === 200) {
        this.formData = {
          ...res.data
        }
        if (this.formData.fileList && this.formData.fileList.length > 0) {
          const params = {
            name: '',
            url: this.formData.fileList[0].attachmentUrl
          }
          this.fileList1.push(params)
        }
        if (this.formData.fileList && this.formData.fileList.length > 1) {
          const params1 = {
            name: '',
            url: this.formData.fileList[1].attachmentUrl
          }
          this.fileList2.push(params1)
        }
      }
    },
    beforeUpload1 (file) {

    },
    // 图片改变
    async onChange1 (file, fileList) {
      this.fileListURL1 = file.url
      console.log(fileList)
      console.log(file)
      if (!this.formData.fileList) {
        this.$set(this.formData, 'fileList', [])
      }
      const formData = new FormData()
      formData.append('attachmentUrl', fileList[0].raw)
      formData.append('attachmentType', '证件图片')
      formData.append('businessCode', 'CUSTOMER')
      console.log(formData)
      const res = await getUploadCustomerPro(formData)
      if (res.code === 200) {
        res.data.forEach(item => {
          const params = {
            attachmentUrl: item.attachmentUrl
          }
          this.formData.fileList.push(params)
        })
      }
    },
    // 图片删除
    async handleRemove1 (file, fileList) {
      // this.formData.fileList.forEach(item => {
      //   if (item.attachmentUrl === file.url) {
      //   }
      // })
      for (var i in this.formData.fileList) {
        for (var k in this.formData.fileList[i]) {
          if (this.formData.fileList[i][k] === file.url) {
            this.formData.fileList.splice(i, 1)
            console.log(this.formData.fileList)
            break
          }
        }
      }
      console.log(this.formData.fileList)
    },
    // 图片上传成功
    async onSuccess1 (response, file, fileList) {
      console.log(this.fileName)
      console.log(response)
      console.log(file)
      console.log(fileList)
    },
    // END
    // 图片修改
    async onChange2 (file, fileList) {
      // if (this) {

      // }
      const formData = new FormData()
      formData.append('attachmentUrl', fileList[0].raw)
      formData.append('attachmentType', '证件图片')
      formData.append('businessCode', 'CUSTOMER')
      console.log(formData)
      const res = await getUploadCustomerPro(formData)
      if (res.code === 200) {
        const list = []
        res.data.forEach(item => {
          const params = {
            attachmentUrl: item.attachmentUrl
          }
          list.push(params)
          this.formData.fileList.push(params)
          // this.$set(this.formData, 'fileList', list)
        })
      }
      console.log(this.formData.fileList)
    },
    // 图片删除
    async handleRemove2 (file, fileList) {
      for (var i in this.formData.fileList) {
        for (var k in this.formData.fileList[i]) {
          if (this.formData.fileList[i][k] === file.url) {
            this.formData.fileList.splice(i, 1)
            console.log(this.formData.fileList)
            break
          }
        }
      }
    },
    // 图片上传成功
    async onSuccess2 (response, file, fileList) {
      console.log(response)
      console.log(file)
      console.log(fileList)
    },
    // END
    // 保存
    async saveFormdata () {
      this.$emit('save', this.formData)
      console.log(this.formData)
      this.column[0].content.map(item => {
        if (item.prop === 'sexCode') {
          return this.$set(this.formData, 'sexName', this.$Utils.matchValue(item.options, this.formData.sexCode, 'value', 'label'))
        }
        if (item.prop === 'siteCode') {
          return this.$set(this.formData, 'siteNameChinese', this.$Utils.matchValue(item.options, this.formData.siteCode, 'value', 'label'))
        }
        if (item.prop === 'tradeCode') {
          return this.$set(this.formData, 'tradeName', this.$Utils.matchValue(item.options, this.formData.tradeCode, 'subCode', 'subName'))
        }
        if (item.prop === 'papersCode') {
          return this.$set(this.formData, 'papersName', this.$Utils.matchValue(item.options, this.formData.papersCode, 'subCode', 'subName'))
        }
        if (item.prop === 'contactRestCode') {
          return this.$set(this.formData, 'contactRestName', this.$Utils.matchValue(item.options, this.formData.contactRestCode, 'subCode', 'subName'))
        }
      })
      this.column[1].content.map(item => {
        if (item.prop === 'freightLevelCode') {
          return this.$set(this.formData, 'freightLevelName', this.$Utils.matchValue(item.options, this.formData.freightLevelCode, 'value', 'label'))
        }
        if (item.prop === 'paymentSiteCode') {
          return this.$set(this.formData, 'paymentSiteName', this.$Utils.matchValue(item.options, this.formData.paymentSiteCode, 'value', 'label'))
        }
        if (item.prop === 'cusServiceCode') {
          return this.$set(this.formData, 'cusServiceName', this.$Utils.matchValue(item.options, this.formData.cusServiceCode, 'value', 'label'))
        }
        if (item.prop === 'cusLevelCode') {
          return this.$set(this.formData, 'cusLevelName', this.$Utils.matchValue(item.options, this.formData.cusLevelCode, 'value', 'label'))
        }
      })
      // if (this.fileListURL1 !== '') {
      //   const formData = new FormData()
      //   formData.append('attachmentUrl', this.fileListURL1)
      //   formData.append('attachmentType', '证件图片')
      //   formData.append('businessCode', 'CUSTOMER')
      // }
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
