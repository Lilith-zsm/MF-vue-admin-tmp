<template>
  <div>
    <el-form ref="loginForm" :model="loginForm" :rules="rules" class="ruleForm" size="small">
      <el-form-item :label="$t('用户名')" prop="username" class="item">
        <el-input
          v-model="loginForm.username"
          size="small"
          clearable
          :placeholder="$t('用户名')"
          prefix-icon="el-icon-mobile-phone"
          @keyup.enter.native="submitForm"
        />
      </el-form-item>
      <el-form-item :label="$t('密码')" prop="password" class="item">
        <el-input
          v-model="loginForm.password"
          size="small"
          clearable
          type="password"
          :placeholder="$t('密码')"
          prefix-icon="el-icon-key"
          @keyup.enter.native="submitForm"
        />
      </el-form-item>
      <el-form-item :label="$t('验证码')" prop="code" class="item">
        <el-row>
          <el-col :span="16">
            <el-input
              v-model="loginForm.code"
              class="checkInp"
              size="small"
              clearable
              type="text"
              :placeholder="$t('验证码')"
              prefix-icon="el-icon-lock"
              @keyup.enter.native="submitForm"
            />
          </el-col>
          <el-col :span="8">
            <el-tooltip class="" effect="dark" :content="$t('点击刷新')" placement="top-start">
              <img class="checkImg" :src="'data:image/png;base64,'+codeIcon" @click="getIcon">
            </el-tooltip>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item class="item">
        <el-button type="primary" size="medium" class="sub_btn" :loading="loading" @click="submitForm">{{ $t('立即登录') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { setCookie } from '@/utils/cache'
export default {
  props: {
    tenantId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        code: '',
        uuid: ''
      },
      codeIcon: '',
      loading: false
    }
  },
  computed: {
    rules() {
      this.clearValidate()
      return {
        username: [
          { required: true, message: this.$i18n.tc('请输入账号'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$i18n.tc('请输入密码'), trigger: 'blur' }
        ],
        code: [
          { required: true, message: this.$i18n.tc('请输入验证码'), trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') {
      this.loginForm['username'] = 'admin'
      this.loginForm['password'] = '123456'
    }
    this.getIcon()
  },
  methods: {
    // 清除校验信息
    clearValidate() {
      this.$nextTick(() => {
        this.$refs.loginForm.clearValidate()
      })
    },
    submitForm() {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          this.login()
        }
      })
    },
    // 登录
    async login() {
      if (!this.tenantId) {
        this.message.error(this.$i18n.tc('请刷新页面重新获取租户信息'))
        return
      }
      this.loading = true
      const params = {
        ...this.loginForm,
        grant_type: 'password',
        scope: 'server'
      }
      try {
        const data = await this.$api.user.token(params)
        this.loading = false
        setCookie(process.env.VUE_APP_TOKEN_STR, data.access_token)
        this.$router.push({ path: '/home/index' })
      } catch {
        // 更新验证码
        this.getIcon()
        this.loginForm.code = ''
        this.loading = false
      }
    },
    // 获取图形验证码
    async getIcon() {
      const { data } = await this.$api.user.code()
      this.codeIcon = data.img
      this.loginForm.uuid = data.uuid
    }
  }
}
</script>
<style lang="scss" scoped>
  .ruleForm{
    .item{
      margin: 0;
      margin-top: 10px;
      .sub_btn{
        width: 100%;
        margin-top: 20px;
      }
    }
  }
  /deep/ .el-form-item__label{
    width: 100%;
    text-align: left;
  }
  /deep/ .el-col-8{
    height: 33px;
  }
  .checkImg{
    width: 100px;
    height: 33px;
    margin-left: 15px;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
