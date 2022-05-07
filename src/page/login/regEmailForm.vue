<template>
  <div>
    <el-form ref="loginForm" :model="form" :rules="rules" class="ruleForm" size="small">
      <el-form-item :label="$t('注册类型')+ ':'" prop="registeredType">
        <el-radio-group v-model="form.registeredType">
          <el-radio label="0">个人注册</el-radio>
          <el-radio label="1">企业注册</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="email" class="item">
        <el-input
          v-model="form.email"
          size="small"
          clearable
          :placeholder="$t('请输入邮箱')"
          prefix-icon="el-icon-message"
          @keyup.enter.native="submitForm"
        />
      </el-form-item>
      <el-form-item prop="code" class="item">
        <el-row>
          <el-col :span="16">
            <el-input
              v-model="form.code"
              class="checkInp"
              size="small"
              clearable
              type="text"
              :placeholder="$t('请输入激活码')"
              prefix-icon="el-icon-folder-checked"
              @keyup.enter.native="submitForm"
            />
          </el-col>
          <el-col :span="8" style="text-align: right;">
            <el-button type="primary" plain :loading="sendLoading" @click="sendEmail">{{ $t('发送邮件') }}</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- <el-form-item prop="proxyCusCode" class="item">
        <el-input
          v-model="form.proxyCusCode"
          size="small"
          clearable
          :placeholder="$t('请输入代理人编码')"
          prefix-icon="el-icon-user"
          @keyup.enter.native="submitForm"
        />
      </el-form-item> -->
      <el-form-item class="item">
        <el-button type="primary" size="medium" :loading="loading" :disabled="disabled" class="sub_btn" @click="submitForm">{{ $t('下一步') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      form: {},
      loading: false,
      sendLoading: false,
      icon: '',
      options: [],
      radioOptions: []
    }
  },
  computed: {
    rules() {
      return {
        registeredType: {
          required: true,
          message: '请选择客户类型',
          trigger: ['change', 'blur']
        },
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: ['change', 'blur']
          },
          {
            validator: (rule, value, callback) => {
              const patter = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
              if (!patter.test(value)) {
                return callback(new Error(this.$i18n.tc('邮箱格式不正确')))
              } else {
                callback()
              }
            },
            trigger: ['change', 'blur']
          }
        ],
        code: [
          {
            required: true,
            message: '请输入激活码',
            trigger: ['change', 'blur']
          }
        ]
      }
    },
    disabled() {
      return !this.form.registeredType || !this.form.email || !this.form.code
    },
    ...mapGetters(['lang'])
  },
  mounted() {
    // this.getDataDict()
  },
  methods: {
    sendEmail() {
      this.$refs['loginForm'].validateField('email', async (emailError) => {
        if (!emailError) {
          this.sendLoading = true
          try {
            await this.$api.user.info.sendEmail({
              email: this.form.email
            })
            this.message.success(this.$i18n.tc('邮件发送成功'))
            this.sendLoading = false
          } catch {
            this.sendLoading = false
          }
        }
      })
    },
    // 获取数据字典
    // async getDataDict() {
    //   const { data } = await this.$api.basic.getSubName({
    //     name: 'BusinessTypes,regType',
    //     code: '092,103'
    //   })
    //   this.options = data['BusinessTypes']
    //   this.radioOptions = data['regType']
    // },
    formatLabel (val) {
      if (this.lang === 'en') {
        return val + 'En'
      } else if (this.lang === 'id') {
        return val + 'Id'
      } else {
        return val
      }
    },
    submitForm() {
      this.form.registeredMethod = 2
      this.$emit('submit', this.form)
      // this.$refs['loginForm'].validate(async (valid) => {
      //   if (valid) {
      //     this.loading = true
      //     try {
      //       await this.$api.user.info.vaildCode({
      //         code: this.form.code,
      //         emailOrPhone: this.form.email,
      //         vaildType: 2
      //       })
      //       this.loading = false
      //       this.form.registeredMethod = 2
      //       this.$emit('submit', this.form)
      //     } catch {
      //       this.message.warning(this.$i18n.tc('激活码验证失败'))
      //       this.loading = false
      //     }
      //   }
      // })
    }
  }
}
</script>
<style lang="scss" scoped>
  .ruleForm{
    margin-top: 20px;
    .item{
      .sub_btn{
          width: 100%;
      }
    }
    /deep/ .el-input__inner {
      border: 0;
      border-bottom: 1px solid #d3d3d3;
      border-radius: 0;
      padding-left: 40px;
    }
    /deep/ .el-input__icon {
      color: #001960;
      font-size: 16px;
      font-weight: bold;
    }
    /deep/ .el-form-item--small .el-form-item__error {
      margin-left: 40px;
    }
    .forget-btn {
      text-align: right;
    }
    .reg-btn {
      margin-top: 10px;
      text-align: center;
    }
    .pre-select {
      color: #001960;
      font-size: 18px;
      display: block;
      width: 26px;
    }
    /deep/ .el-select__tags {
      left: 30px;
    }
  }
  .checkImg{
    width: 100px;
    height: 33px;
    margin-left: 15px;
    border-radius: 4px;
    cursor: pointer;
    vertical-align: middle;
  }
</style>
