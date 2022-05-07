<template>
  <div class="login_page">
    <div class="menuBox">
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
        <el-steps :active="step" align-center>
          <el-step :title="$t('选择账户性质')" />
          <el-step :title="$t('提交认证资料')" />
          <el-step :title="$t('客服人工审核并验证信息。此阶段需要一定时间，请耐心等候')" />
          <el-step :title="$t('审核通过，开始发货')" />
        </el-steps>
        <div class="reg-form" :style="{'width': step === 0 ? '327px' : '700px'}">
          <!-- 选择账户性质 -->
          <my_form
            v-show="step === 0"
            :form-data="typeForm.formData"
            :column="typeForm.column"
            :options="typeForm.options"
            :rule="rule1"
            label-width="80px"
            @handleSave="onNext"
          />

          <!-- 提交认证资料 -->
          <my_form
            v-show="step === 1"
            :form-data="infoForm.formData"
            :column="infoForm.column"
            :options="infoForm.options"
            :rule="rule2"
            label-width="80px"
            @handleClose="handleClose"
          />
        </div>
        <div v-show="step === 0" class="returnIndex"><span @click="returnIndex">暂不认证</span></div>
      </div>
    </div>
  </div>
</template>

<script>
import { setCookie, getCookie } from '@/utils/cache'
import zhIcon from '@/assets/img/icon/zh-icon.png'
import enIcon from '@/assets/img/icon/en-icon.png'
// import alIcon from '@/assets/img/icon/ar-icon.png'
export default {
  name: 'Approve',
  data() {
    return {
      loading: false,
      zhIcon,
      enIcon,
      // alIcon,
      lang: '',
      icon: '',
      step: 0,
      typeForm: {
        formData: {},
        column: [
          {
            content: [
              {
                label: '注册类型',
                type: 'label_radio_group',
                disabled: false,
                prop: 'type',
                options: [
                  {
                    label: '个人注册',
                    value: '1'
                  },
                  {
                    label: '企业注册',
                    value: '2'
                  }
                ],
                span: 24
              }
            ]
          }
        ],
        options: {
          hideCancleBtn: true,
          saveBtnText: '下一步',
          labelPosition: 'left'
        }
      },
      infoForm: {
        formData: {},
        column: [
          {
            content: [
              {
                label: '用户姓名',
                type: 'label_input',
                disabled: false,
                prop: 'userName',
                span: 12
              },
              {
                label: '联系电话',
                type: 'label_input',
                disabled: false,
                prop: 'contact',
                span: 12
              },
              {
                label: '身份证号',
                type: 'label_input',
                disabled: false,
                prop: 'idcard',
                span: 12
              },
              {
                label: '业务意向',
                type: 'label_input',
                disabled: false,
                prop: 'ywyx',
                span: 12
              },
              {
                label: '身份证正面',
                type: 'label_upload',
                disabled: false,
                prop: 'type',
                span: 12,
                height: 185
              },
              {
                label: '身份证反面',
                type: 'label_upload',
                disabled: false,
                prop: 'type',
                span: 12,
                height: 185
              }
            ]
          }
        ],
        options: {
          cancleBtnText: '上一步',
          saveBtnText: '提交'
        }
      }
    }
  },
  computed: {
    rule1() {
      return {
        type: {
          required: true,
          message: '请选择注册类型',
          trigger: 'change'
        }
      }
    },
    rule2() {
      return {

      }
    }
  },
  created() {
  },
  mounted() {
    if (!setCookie('LANG_Mk_CRS')) {
      setCookie('LANG_Mk_CRS', 'zh')
    }
    this.lang = getCookie('LANG_Mk_CRS')
    this.$i18n.locale = this.lang
  },
  methods: {
    handleCommand(lang) {
      this.lang = lang
      setCookie('LANG_Mk_CRS', lang)
      this.$i18n.locale = lang
    },
    handleClick() {

    },
    onNext() {
      this.step++
    },
    returnIndex() {
      this.$router.push({ name: 'index' })
    },
    handleClose() {
      this.step--
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
      line-height: 20px;
      margin-top: 10px;
      &.is-process, &.is-finish {
        color: #EE9B0A;
      }

    }
    /deep/ .el-step__head {
      &.is-process, &.is-finish {
        color: #EE9B0A;
        border-color: #EE9B0A;
      }
    }
  }
  .reg-form {
    // width: 327px;
    margin: 50px auto 0;
    position: relative;
    padding-bottom: 30px;
  }
  .login-tab {
    margin-top: 20px;
  }
  .menuBox{
    width: 900px;
    padding: 20px;
    border-radius: 3px;
    box-sizing: border-box;
    background-color: #fff;
    // transform: translateX(50%);
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
  .returnIndex {
    text-align: center;
    font-size: 14px;
    span{
      cursor: pointer;
      color: #868383;
      text-decoration: underline;
    }
  }
</style>
