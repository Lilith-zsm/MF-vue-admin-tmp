<template>
  <div>
    <base-dialog
      :title="orderList? $t('修改员工资料') : $t('新增员工资料')"
      :visible.sync="innerVisible"
      width="65%"
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
            @handleSave="saveFormdata"
            @handleCancel="innerVisible = false"
          >
            <div slot="form-hide" />
          </my_form>
        </el-col>
      </el-row>
    </base-dialog>
    <!-- 所属网点 -->
    <website-table
      v-if="websiteVisible"
      :visible.sync="websiteVisible"
      @submit="websiteSubmit"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import websiteTable from '@/components/websiteTable'
import { getSubName } from '@/api/common/base/lookUp'
import { getCountry } from '@/api/common'
import { updateEmpInfo, addEmpInfo } from '@/api/common/base/empInfo'
export default {
  components: {
    websiteTable
  },
  props: {
    orderList: {
      type: Object,
      default: null
    },
    visible: {
      type: Boolean
    }
  },
  data () {
    const validatePassword = (rule, value, callback) => {
      if (this.formData.password !== value) {
        callback(new Error('密码不一致请重新输入'))
      } else {
        callback()
      }
    }
    return {
      websiteVisible: false,
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
        empCode: {
          required: true,
          message: '请输入员工编号',
          trigger: 'blur'
        },
        empName: {
          required: true,
          message: '请输入中文姓名',
          trigger: 'blur'
        },
        empNameEn: {
          required: true,
          message: '请输入英文姓名',
          trigger: 'blur'
        },
        empNameTh: {
          required: true,
          message: '请输入泰文姓名',
          trigger: 'blur'
        },
        sex: {
          required: true,
          message: '请选择性别',
          trigger: 'change'
        },
        belongSiteName: {
          required: true,
          message: '请选择所属网点',
          trigger: 'change'
        },
        belongDeptCode: {
          required: true,
          message: '请选择所属部门',
          trigger: 'change'
        },
        telephone: {
          required: true,
          message: '请输入电话',
          trigger: 'blur'
        },
        postCode: {
          required: true,
          message: '请选择岗位',
          trigger: 'change'
        },
        phone: {
          required: true,
          message: '请输入手机号码',
          trigger: 'blur'
        },
        loginAccount: {
          required: true,
          message: '请输入账号',
          trigger: 'blur'
        },
        password: {
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        },
        confirmPassword: {
          required: true,
          message: '密码不一致请重新输入',
          trigger: 'blur',
          validator: validatePassword
        },
        roleCode: {
          required: true,
          message: '请选择角色权限',
          trigger: 'change'
        }
      },
      column: [
        {
          title: '员工信息',
          content: [
            {
              label: '员工编号',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入员工编号',
              prop: 'empCode'
            },
            {
              label: '中文姓名',
              type: 'label_input',
              disabled: false,
              maxlength: 20,
              placeholder: '请输入中文姓名',
              prop: 'empName'
            },
            {
              label: '英文姓名',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入英文姓名',
              prop: 'empNameEn'
            },
            {
              label: '泰文姓名',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入泰文姓名',
              prop: 'empNameTh'
            },
            {
              label: '昵称',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入昵称',
              prop: 'nickName'
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
              prop: 'sex'
            },
            {
              label: '所属网点',
              type: 'label_input_clearable',
              disabled: false,
              handleClick: () => {
                this.websiteVisible = true
              },
              handleClear: () => {
                this.$set(this.formData, 'belongSiteCode', null)
              },
              placeholder: '请选择所属网点',
              prop: 'belongSiteName'
            },
            {
              label: '所属部门',
              type: 'label_select',
              disabled: false,
              options: [
                {
                  label: '项目部',
                  value: '01'
                }
              ],
              placeholder: '请选择所属部门',
              prop: 'belongDeptCode'
            },
            {
              label: '电话',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入电话',
              prop: 'telephone'
            },
            {
              label: '岗位',
              type: 'label_select',
              disabled: false,
              options: [],
              labelName: 'subName',
              labelVal: 'subCode',
              placeholder: '请选择岗位',
              prop: 'postCode'
            },
            {
              label: '手机号码',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入手机号码',
              prop: 'phone'
            },
            {
              label: '邮箱地址',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入邮箱地址',
              prop: 'email'
            },
            {
              label: '传真',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入传真',
              prop: 'fax'
            },
            {
              label: '巴枪密码',
              type: 'label_input',
              disabled: false,
              genre: 'password',
              placeholder: '请输入巴枪密码',
              prop: 'spearPassword'
            },
            {
              label: '入职日期',
              type: 'label_date_picker',
              dateType: 'datetime',
              format: 'yyyy-MM-dd HH:mm:ss',
              disabled: false,
              placeholder: '请选择入职日期',
              prop: 'entryDate'
            },
            {
              label: '离职日期',
              type: 'label_date_picker',
              dateType: 'datetime',
              format: 'yyyy-MM-dd HH:mm:ss',
              disabled: false,
              placeholder: '请选择离职日期',
              prop: 'departureDate'
            },
            {
              label: '证件类型',
              type: 'label_select',
              labelName: 'subName',
              labelVal: 'subName',
              disabled: false,
              options: [],
              placeholder: '请选择证件类型',
              prop: 'idType'
            },
            {
              label: '证件编号',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入证件编号',
              prop: 'idNumber'
            },
            {
              label: '账号',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入账号',
              prop: 'loginAccount'
            },
            {
              label: '密码',
              type: 'label_input',
              disabled: false,
              genre: 'password',
              placeholder: '请输入密码',
              prop: 'password'
            },
            {
              label: '确认密码',
              type: 'label_input',
              disabled: false,
              genre: 'password',
              placeholder: '请输入确认密码',
              prop: 'confirmPassword'
            },
            {
              label: '角色权限',
              type: 'label_select',
              disabled: false,
              options: [
                {
                  label: '管理员',
                  value: '01'
                }
              ],
              placeholder: '请选择角色权限',
              prop: 'roleCode'
            },
            {
              label: '销售员国籍',
              type: 'label_select',
              disabled: false,
              options: [],
              labelName: 'name',
              labelVal: 'id',
              placeholder: '请选择销售员国籍',
              prop: 'salespersonNationalityCode'
            },
            {
              label: '销售员状态',
              type: 'label_select',
              disabled: false,
              options: [
                {
                  label: '公司销售员',
                  value: '01'
                },
                {
                  label: '泰国办公室',
                  value: '02'
                },
                {
                  label: '中国办公室',
                  value: '03'
                }
              ],
              placeholder: '请选择销售员状态',
              prop: 'salespersonTypeCode'
            },
            {
              label: '员工状态',
              type: 'label_select',
              disabled: false,
              options: [
                {
                  label: '启用',
                  value: '1'
                },
                {
                  label: '禁用',
                  value: '0'
                }
              ],
              placeholder: '请选择员工状态',
              prop: 'empType'
            },
            {
              label: '导购员提成比例',
              type: 'label_input_number',
              disabled: false,
              placeholder: '请输入导购员提成比例',
              prop: 'salespersonProportion'
            },
            {
              label: '是否弹屏',
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
              placeholder: '请选择是否弹屏',
              prop: 'popScreen'
            },
            {
              label: '查询范围天数',
              type: 'label_input_number',
              disabled: false,
              placeholder: '请输入查询范围天数',
              prop: 'days'
            },
            // {
            //   label: '岗位',
            //   type: 'label_select',
            //   options: [
            //     {
            //       label: '中国跟单',
            //       vlaue: '1'
            //     },
            //     {
            //       label: '物流跟单员',
            //       value: '2'
            //     },
            //     {
            //       label: '泰国客服',
            //       value: '3'
            //     }
            //   ],
            //   disabled: false,
            //   prop: 'documentaryType'
            // },
            // {
            //   label: '',
            //   type: 'slot',
            //   prop: 'hide'
            // },
            {
              label: '销售员标识',
              text: '',
              type: 'label_checkbox',
              disabled: false,
              trueLabel: '1',
              falseLabel: '0',
              xl: 4,
              lg: 4,
              md: 4,
              sm: 4,
              prop: 'salespersonIdentification'
            },
            {
              label: '导购员标识',
              text: '',
              type: 'label_checkbox',
              disabled: false,
              trueLabel: '1',
              falseLabel: '0',
              xl: 4,
              lg: 4,
              md: 4,
              sm: 4,
              prop: 'shoppingIdentification'
            },
            {
              label: '送货员标识',
              text: '',
              type: 'label_checkbox',
              disabled: false,
              trueLabel: '1',
              falseLabel: '0',
              xl: 4,
              lg: 4,
              md: 4,
              sm: 4,
              prop: 'deliveryIdentification'
            }
          ]
        }
      ],
      mainParams: {},
      selectData: {}
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
    console.log(this.formData, '加载')
    this.getCountry()
    if (this.$props.orderList) {
      this.formData = {
        ...this.$props.orderList
      }
      this.$set(this.formData, 'password', '******')
      this.$set(this.formData, 'confirmPassword', '******')
    }
  },
  methods: {
    // 所属网点
    websiteSubmit(val) {
      this.$set(this.formData, 'belongSiteCode', val.siteCode)
      this.$set(this.formData, 'belongSiteName', val.siteNameChinese)
      this.websiteVisible = false
    },
    /**
     * 获取数据字典
     */
    getLookUpData() {
      return new Promise((resove, reject) => {
        getSubName({
          name: 'POST,IDTYPE',
          code: '018,075'
        }).then((res) => {
          resove(res.data)
        }).catch(err => { reject(err) })
      })
    },
    // 加载国家数据
    async getCountry () {
      const data = await this.getLookUpData()
      const country = await getCountry()
      this.selectData = {
        ...this.selectData,
        ...data
      }
      if (this.column[0].content.length > 0) {
        this.column[0].content.forEach(item => {
          if (item.prop === 'salespersonNationalityCode') {
            this.$set(item, 'options', country.data)
          }
          if (item.prop === 'postCode') {
            this.$set(item, 'options', this.selectData.POST)
          }
          if (item.prop === 'idType') {
            this.$set(item, 'options', this.selectData.IDTYPE)
          }
        })
      }
    },
    // 保存
    async saveFormdata () {
      this.$emit('save', this.formData)
      this.column[0].content.map(item => {
        if (item.prop === 'salespersonNationalityCode') {
          return this.$set(this.formData, 'salespersonNationalityName', this.$Utils.matchValue(item.options, this.formData.salespersonNationalityCode, 'id', 'name'))
        }
        if (item.prop === 'belongSiteCode') {
          return this.$set(this.formData, 'belongSiteName', this.$Utils.matchValue(item.options, this.formData.belongSiteCode, 'value', 'label'))
        }
        if (item.prop === 'belongDeptCode') {
          return this.$set(this.formData, 'belongDeptName', this.$Utils.matchValue(item.options, this.formData.belongDeptCode, 'value', 'label'))
        }
        if (item.prop === 'postCode') {
          return this.$set(this.formData, 'postName', this.$Utils.matchValue(item.options, this.formData.postCode, 'subCode', 'subName'))
        }
        if (item.prop === 'roleCode') {
          return this.$set(this.formData, 'roleName', this.$Utils.matchValue(item.options, this.formData.roleCode, 'value', 'label'))
        }
        if (item.prop === 'salespersonTypeCode') {
          return this.$set(this.formData, 'salespersonTypeName', this.$Utils.matchValue(item.options, this.formData.salespersonTypeCode, 'value', 'label'))
        }
      })
      if (!this.$props.orderList) {
        // this.$set(this.formData, 'belongSiteCode', this.userInfo.site.siteCode)
        // this.$set(this.formData, 'belongSiteName', this.userInfo.site.siteNameChinese)
        const res = await addEmpInfo(this.formData)
        if (res.code === 200) {
          this.$message({
            message: this.$i18n.tc(res.msg),
            type: 'success'
          })
          this.innerVisible = false
          this.$emit('onSubmit')
        }
      } else {
        const res = await updateEmpInfo(this.formData)
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
