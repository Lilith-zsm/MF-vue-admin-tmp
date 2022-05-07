<template>
  <div>
    <el-form ref="loginForm" v-loading="loading" :rules="rules" :model="form" class="ruleForm" size="small">
      <el-form-item :label="$t('注册类型')+ ':'" prop="registeredType">
        <el-radio-group v-model="form.registeredType">
          <el-radio v-for="item in radioOptions" :key="item.subCode" :label="item.subCode">{{ item.subName }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="phone" class="item">
        <el-input
          v-model="form.phone"
          size="small"
          clearable
          :placeholder="$t('请输入手机号')"
          prefix-icon="el-icon-mobile-phone"
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
              :placeholder="$t('请输入短信验证码')"
              prefix-icon="el-icon-folder-checked"
              @keyup.enter.native="submitForm"
            />
          </el-col>
          <el-col :span="8" style="text-align: right;">
            <el-button type="primary" plain :disabled="codeFlag" :loading="sendLoading" @click="sendPhoneCode">{{ codeFlag ? `${count}${$t('秒后重新发送')}` : $t('发送验证码') }}</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item prop="proxyCusCode" class="item">
        <el-input
          v-model="form.proxyCusCode"
          size="small"
          clearable
          :placeholder="$t('请输入代理人编码')"
          prefix-icon="el-icon-user"
          @keyup.enter.native="submitForm"
        />
      </el-form-item>
      <el-form-item prop="businessIntentions" class="item">
        <el-select v-model="form.businessIntentions" multiple :placeholder="$t('业务意向(可多选)')">
          <span slot="prefix" class="pre-select"><i class="el-icon-suitcase-1" /></span>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.subName"
            :value="item.subCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="item">
        <el-button type="primary" size="medium" :loading="loading" :disabled="disabled" class="sub_btn" @click="submitForm">{{ $t('下一步') }}</el-button>
        <div class="reg-btn">{{ $t('已有账号') }}?<el-button type="text" @click="$router.push({name: 'login'})">{{ $t('立即登录') }}</el-button></div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import moment from 'moment'
import md5 from 'md5'
export default {
  data () {
    return {
      form: {},
      loading: false,
      icon: '',
      options: [],
      radioOptions: [],
      count: 60,
      codeFlag: false,
      sendLoading: false
    }
  },
  computed: {
    rules() {
      return {
        registeredType: {
          required: true,
          message: '请选择注册类型',
          trigger: ['change', 'blur']
        },
        phone: [
          {
            required: true,
            message: '请输入手机号',
            trigger: ['change', 'blur']
          },
          { pattern: /^[0-9]*$/, message: '手机号格式错误' }
        ],
        code: [
          {
            required: true,
            message: '请输入验证码',
            trigger: ['change', 'blur']
          }
        ]
      }
    },
    disabled() {
      return !this.form.registeredType || !this.form.phone || !this.form.code
    }
  },
  mounted() {
    this.getDataDict()
  },
  methods: {
    // 获取数据字典
    async getDataDict() {
      const { data } = await this.$api.basic.getSubName({
        name: 'BusinessTypes,regType',
        code: '092,103'
      })
      this.options = data['BusinessTypes']
      this.radioOptions = data['regType']
    },
    sendPhoneCode() {
      this.$refs['loginForm'].validateField('phone', async (phoneError) => {
        if (!phoneError) {
          this.sendLoading = true
          try {
            await this.$api.user.info.sendPhone({
              phone: this.form.phone,
              sign: md5(this.form.phone + '-' + moment().format('YYYY-MM-DD-HH') + '-' + 'skywin')
            })
            this.sendLoading = false
            this.codeFlag = true
            this.count = 60
            this.timedCount()
          } catch {
            this.sendLoading = false
            this.codeFlag = false
          }
        }
      })
    },
    // 倒计时
    timedCount() {
      this.timer = setInterval(() => {
        this.count--
        if (this.count === 0) {
          this.codeFlag = false
          clearInterval(this.timer)
        }
      }, 1000)
    },
    submitForm() {
      this.$refs['loginForm'].validate(async (valid) => {
        if (valid) {
          this.loading = true
          try {
            await this.$api.user.info.vaildCode({
              code: this.form.code,
              emailOrPhone: this.form.phone,
              vaildType: 1
            })
            this.loading = false
            this.form.registeredMethod = 1
            this.$emit('submit', this.form)
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
