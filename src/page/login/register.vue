<!--
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-04-25 14:12:17
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-05-05 14:23:44
-->
<template>
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
        <reg-phone-form v-show="activeName === 'phone'" @submit="onSubmit" />
        <reg-email-form v-show="activeName === 'email'" @submit="onSubmit" />
      </div>
    </div>
    <div v-show="activeStep === 1" class="reg-form">
      <reg-inform :init-form="initForm" @onPreStep="onPreStep" />
    </div>
  </div>
</template>
<script>
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
      activeStep: 0,
      activeName: 'phone',
      initForm: {}
    }
  },
  methods: {
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
  .reg-form {
    width: 327px;
    margin: 30px auto 0;
  }
  .reg-radio {
    text-align: center;
  }
  .login-tab {
    margin-top: 20px;
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
</style>
