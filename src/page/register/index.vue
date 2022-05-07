<template>
  <div class="login_page">
    <div class="menuBox">
      <h1>{{ $t('欢迎注册') }}!</h1>
      <div class="tltBox">
        <el-row>
          <el-col :span="16">
            <img src="@/assets/img/logo.png" width="215px">
          </el-col>
          <el-col :span="8">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                <img class="country-icon-1" :src="lang === 'zh' ? zhIcon:lang === 'en' ? enIcon:alIcon" alt="">
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="zh">
                  <img class="country-icon" :src="zhIcon" alt="">
                </el-dropdown-item>
                <el-dropdown-item command="en">
                  <img class="country-icon" :src="enIcon" alt="">
                </el-dropdown-item>
                <el-dropdown-item command="ar">
                  <img class="country-icon" :src="alIcon" alt="">
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </div>
      <div class="login-tab">
        <el-steps :active="activeStep" align-center>
          <el-step :title="$t('设置用户名')" />
          <el-step :title="$t('填写个人信息')" />
          <el-step :title="$t('注册成功')" />
        </el-steps>
        <div v-show="activeStep === 0" class="reg-form">
          <div class="reg-radio">
            <el-radio-group v-model="activeName">
              <el-radio-button label="phone">{{ $t('手机') }}</el-radio-button>
              <el-radio-button label="email">{{ $t('邮箱') }}</el-radio-button>
            </el-radio-group>
          </div>
          <reg-phone-form v-show="activeName === 'phone'" @submit="onSubmit" />
          <reg-email-form v-show="activeName === 'email'" @submit="onSubmit" />
        </div>
        <div v-show="activeStep === 1" class="reg-form">
          <reg-inform :init-form="initForm" @onPreStep="onPreStep" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setCookie, getCookie } from '@/utils/cache'
import zhIcon from '@/assets/img/icon/zh-icon.png'
import enIcon from '@/assets/img/icon/en-icon.png'
// import alIcon from '@/assets/img/icon/ar-icon.png'
import regPhoneForm from './regPhoneForm'
import regEmailForm from './regEmailForm'
import regInform from './regInform'
export default {
  name: 'Register',
  components: {
    regPhoneForm,
    regEmailForm,
    regInform
  },
  data() {
    return {
      loading: false,
      zhIcon,
      enIcon,
      // alIcon,
      lang: '',
      icon: '',
      activeName: 'phone',
      activeStep: 0,
      initForm: {}
    }
  },
  created() {
  },
  mounted() {
    if (!getCookie('LANG_Mk_CRS')) {
      setCookie('LANG_Mk_CRS', 'zh')
    }
    this.lang = getCookie('LANG_Mk_CRS')
    this.$i18n.locale = this.lang
  },
  methods: {
    handleCommand(lang) {
      this.lang = lang
      setCookie('LANG_Mk_CRS', lang)
      this.$store.dispatch('setLang', lang)
      this.$i18n.locale = lang
    },
    handleClick() {

    },
    onPreStep() {
      this.activeStep--
    },
    onNextStep() {
      this.activeStep++
    },
    onSubmit(val) {
      this.initForm = { ...val }
      this.onNextStep()
    }
  }
}
</script>

<style lang="scss" scoped>
  .login_page {
    position: absolute;
    width: 100%;
    height: 100%;
    // background: url('../../assets/img/login_bg.jpg') no-repeat center center;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    .el-tabs__header {
      padding: 0
    }
    /deep/ .el-step__title {
      font-size: 14px;
      &.is-process,&.is-finish {
        color: #EE9B0A;
      }
    }
    /deep/ .el-step__head.is-process,/deep/ .el-step__head.is-finish {
      color: #EE9B0A;
      border-color: #EE9B0A;
    }
  }
  .reg-form {
    width: 327px;
    margin: 30px auto 0;
  }
  .reg-radio {
    text-align: center;
  }
  .login-tab {
    margin-top: 20px;
  }
  .menuBox{
    width: 660px;
    padding: 20px;
    border-radius: 3px;
    box-sizing: border-box;
    background-color: #fff;
    transform: translateX(50%);
    position: relative;
    .tltBox{
      height: 50px;
    }
    .title{
      font-size: 18px;
      font-weight: bold;
      color: #38a9ef;
    }
    .el-dropdown{
      position: absolute;
      right: 0px;
      cursor: pointer;
      margin-top: 5px;
    }
    h1 {
      position: absolute;
      color: #ffffff;
      top: -90px;
      left: 0;
      font-size: 28px;
      letter-spacing: 6px;
    }
  }
  .country-icon{
    width: 38px;
    margin: 3px 0 0 0;
    border-radius: 4px;
  }
  .country-icon-1{
    width: 38px;
    margin: 0 0 -7px;
    border-radius: 4px;
  }
</style>
