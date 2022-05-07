<template>
  <div v-loading="fullLoading" class="login_page" :style=" {'background-image': `url(${tenantId ? loginBgImg : defaultBgImg})`}">
    <div class="menuBox">
      <div class="form_content" :style="{'width': type === 'login' ? '340px': '430px'}">
        <div class="tltBox">
          <el-row>
            <el-col :span="16" class="form_head">
              <span class="title">{{ type === 'login' ? $t('登录') : $t('注册') }}</span>
            </el-col>
            <el-col :span="8">
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  <img class="country-icon-1" :src="currentCountry.icon" alt="">
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="item in countryData" :key="item.lang" :command="item">
                    <img class="country-icon" :src="item.icon">
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </div>
        <!-- 登录 -->
        <div v-show="type === 'login'">
          <login :tenant-id="tenantId" />
          <div class="register-btn">
            <el-button type="text" @click="type = 'reg'">{{ $t('还没有账号？ 立即注册') }}</el-button>
          </div>
        </div>
        <!-- 注册 -->
        <div v-show="type === 'reg'">
          <register :tenant-id="tenantId" />
          <div class="register-btn">
            <el-button type="text" @click="type = 'login'">{{ $t('已有账号, 立即登录') }}</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setCookie, getCookie, removeCookie, setLocalStorage } from '@/utils/cache'
import login from './login'
import register from './register'
export default {
  name: 'Login',
  components: {
    login,
    register
  },
  data() {
    return {
      countryData: [ // 国家数据
        {
          lang: 'zh',
          icon: require('@/assets/img/icon/zh-icon.png')
        },
        {
          lang: 'en',
          icon: require('@/assets/img/icon/en-icon.png')
        },
        {
          lang: 'ar',
          icon: require('@/assets/img/icon/th-icon.png')
        },
        {
          lang: 'mal',
          icon: require('@/assets/img/icon/mala-icon.png')
        }
      ],
      currentCountry: {}, // 当前选中的国家
      fullLoading: false,
      tenantId: '',
      loginBgImg: '',
      defaultBgImg: require('@/assets/img/bg.jpg'),
      type: 'login'
    }
  },
  mounted() {
    const getLang = getCookie(process.env.VUE_APP_LANG_STR)
    if (!getLang) {
      setCookie(process.env.VUE_APP_LANG_STR, 'zh')
    }
    this.$i18n.locale = getLang
    this.currentCountry = this.countryData.find(item => item.lang === getLang)
    if (getCookie(process.env.VUE_APP_TENANT_STR)) {
      removeCookie(process.env.VUE_APP_TENANT_STR)
    }
    this.getTenantByCode()
  },
  methods: {
    handleCommand(item) {
      this.currentCountry = item
      setCookie(process.env.VUE_APP_LANG_STR, item.lang)
      this.$i18n.locale = item.lang
    },
    // 获取租户信息
    async getTenantByCode() {
      const code = location.pathname.match('[^/]+') ? location.pathname.match('[^/]+')[0] : 'msd'
      this.fullLoading = true
      try {
        const { data } = await this.$api.system.tenant.getByCode(code)
        document.title = data.name
        setCookie(process.env.VUE_APP_TENANT_STR, data.tenantId)
        this.tenantId = data.tenantId
        this.loginBgImg = data.fromUrl ? process.env.VUE_APP_GATEWAY_URL + data.fromUrl : this.defaultBgImg
        setLocalStorage('COMPANYLOGO', data.companyLogo)
        this.fullLoading = false
      } catch {
        this.fullLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .login_page {
    position: absolute;
    width: 100%;
    height: 100%;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    .register-btn {
      text-align: right;
    }
  }
  .menuBox{
    position: absolute;
    right: 10%;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
    .logo_title{
      text-align: center;
      font-size: 28px;
      font-weight: bold;
      margin: 0 0 40px;
      color:#fff;
    }
    .form_content{
      width: 340px;
      padding: 10px 30px 30px;
      border-radius: 3px;
      background-color: #fff;
      margin: 0 auto;
    }
    .tltBox{
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #aab3be;
    }
    .form_head{
      text-align: left;
    }
    .title{
      font-size: 18px;
      font-weight: bold;
      color: #38a9ef;
    }
    .el-dropdown{
      padding: 0 10px;
      position: absolute;
      right: 0px;
      cursor: pointer;
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
  .login_logo{
    position:absolute;
    left: 68px;
    top: 46px;
  }
</style>
