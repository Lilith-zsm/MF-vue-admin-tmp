<template>
  <div>
    <h3 class="reg-title">
      {{ initForm.registeredMethod === 1 ? $t('手机注册') : $t('邮箱注册') }}
    </h3>
    <el-form ref="loginForm" :model="form" :rules="rules" class="ruleForm" size="small">
      <el-form-item prop="username" class="item">
        <el-input
          v-model="form.username"
          size="small"
          clearable
          :placeholder="$t('请输入登录名')"
          prefix-icon="el-icon-user"
          @keyup.enter.native="submitForm"
        />
      </el-form-item>
      <el-form-item prop="password" class="item">
        <el-input
          v-model="form.password"
          size="small"
          clearable
          type="password"
          :placeholder="$t('请输入密码')"
          prefix-icon="el-icon-key"
          @keyup.enter.native="submitForm"
        />
      </el-form-item>
      <el-form-item prop="rePassword" class="item">
        <el-input
          v-model="form.rePassword"
          size="small"
          clearable
          type="password"
          :placeholder="$t('再次输入密码')"
          prefix-icon="el-icon-key"
          @keyup.enter.native="submitForm"
        />
      </el-form-item>
      <el-form-item class="item">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-button type="primary" size="medium" class="sub_btn" @click="onPreStep">{{ $t('上一步') }}</el-button>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" size="medium" :loading="loading" :disabled="disabled" class="sub_btn" @click="submitForm">{{ $t('提交') }}</el-button>
          </el-col>
        </el-row>
        <div class="reg-btn">{{ $t('已有账号') }}?<el-button type="text" @click="$router.push({name: 'login'})">{{ $t('立即登录') }}</el-button></div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    initForm: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      form: {},
      loading: false
    }
  },
  computed: {
    rules() {
      return {
        username: [
          {
            required: true,
            message: '请输入登录名',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              const patter = /^[A-Za-z0-9]+$/
              if (!patter.test(value)) {
                return callback(new Error(this.$i18n.tc('不能输入中文和特殊字符')))
              } else {
                callback()
              }
            },
            trigger: ['change', 'blur']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ],
        rePassword: [
          {
            required: true,
            message: '请再次输入密码',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (value !== this.form.password) {
                return callback(new Error(this.$i18n.tc('两次密码不一致')))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
    },
    disabled() {
      return !this.form.username || !this.form.password || !this.form.rePassword
    }
  },
  mounted() {
  },
  methods: {
    onPreStep() {
      this.$emit('onPreStep')
    },
    submitForm() {
      this.$refs['loginForm'].validate(async (valid) => {
        if (valid) {
          this.loading = true
          const { email, phone, businessIntentions, registeredType, registeredMethod, proxyCusCode } = this.initForm
          try {
            await this.$api.user.info.registered({
              ...this.form,
              email,
              phone,
              registeredMethod,
              registeredType,
              proxyCusCode,
              businessIntentions: businessIntentions && businessIntentions.length > 0 ? businessIntentions.join(',') : ''
            })
            this.loading = false
            this.$router.push({ name: 'login' })
            this.message.success(this.$i18n.tc('注册成功'))
          } catch {
            this.loading = false
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.reg-title {
  text-align: center;
}
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
