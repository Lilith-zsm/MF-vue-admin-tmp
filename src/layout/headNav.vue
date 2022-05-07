<template>
  <div id="common-header" ref="layoutHeader" class="header">
    <div class="navTab">
      <div class="menu_page_top rflex" :style="{width:sidebar.width+'px'}">
        <span v-show="sidebar.opened" class="title" @click="goIndex()">
          <img :src="companyLogo" width="110px" height="39px">
        </span>
        <span v-show="!sidebar.opened" class="title" @click="goIndex()">
          <img :src="companyMinLogo" width="35px" height="35px">
        </span>
      </div>
      <div class="rightCenten">
        <div id="bread_container" class="bread_container">
          <span class="collapse-btn" @click="collapseChage">
            <i v-if="!isCollapse" class="el-icon-s-fold" />
            <i v-else class="el-icon-s-unfold" />
          </span>
        </div>
        <topMenu v-if="isTopMenu" />
        <div class="header-right">
          <div class="header-user-con">
            <!-- 全屏显示 -->
            <div class="btn-fullscreen" @click="handleFullScreen">
              <el-tooltip effect="dark" :content="fullscreen ? $t('取消全屏') : $t('全屏')" placement="bottom">
                <i style="vertical-align: middle;" class="el-icon-rank" />
              </el-tooltip>
            </div>
            <!-- 消息中心 -->
            <div class="btn-bell">
              <el-badge :value="messageNum" class="item">
                <span v-if="!messageNum">
                  <img src="../assets/img/emil.png" style="width: 27px;vertical-align: middle;" alt="">
                </span>
                <span v-if="messageNum" @click="onMessage">
                  <img src="https://wimg.588ku.com/gif620/19/07/09/d3cd8039178e1a76f9f80c5d1222b596.gif" style="width: 35px;vertical-align: middle;" alt="">
                </span>
              </el-badge>
            </div>
            <!-- 多语言下拉 -->
            <el-dropdown class="user-name" trigger="click" @command="handleCommand1">
              <span class="el-dropdown-link">
                <img class="country-icon-1" :src="lang === 'zh' ? zhIcon:lang === 'en' ? enIcon:lang === 'ar' ? alIcon : malaIcon " alt="">
              <!-- <i class="el-icon-caret-bottom" /> -->
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
                <el-dropdown-item command="mal">
                  <img class="country-icon" :src="malaIcon" alt="">
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- 时区下拉 -->
            <el-select v-model="selectTimeZone" class="time-zone-list" @change="changeTimeZone">
              <el-option v-for="item in timeZones" :key="item" :label="item" :value="item" />
            </el-select>
            <!-- 用户头像 -->
            <div class="user-avator">
              <img src="../assets/img/avatar-3.png">
            </div>
            <!-- 用户名下拉菜单 -->
            <el-dropdown class="user-name" trigger="click" @command="handleCommand">
              <span class="el-dropdown-link">
                {{ userInfo.accountName }}
                <i class="el-icon-caret-bottom" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="resetPassword">{{ $t('修改密码') }}</el-dropdown-item>
                <el-dropdown-item command="loginout">{{ $t('退出登录') }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
    <!-- 修改密码 弹窗 -->
    <el-dialog :title="$t('修改密码')" :visible.sync="pswVisible" width="600" label-width="100px">
      <el-form ref="pwdForm" v-loading="pswLoading" :model="pwdForm" status-icon :rules="rules">
        <el-form-item :label="$t('原密码')" prop="oldPassword">
          <el-input v-model="pwdForm.oldPassword" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="$t('新密码')" prop="newPassword">
          <el-input v-model="pwdForm.newPassword" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="$t('重复新密码')" prop="newPassword_1">
          <el-input v-model="pwdForm.newPassword_1" type="password" auto complete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pswVisible = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="onSubmit">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <messageDialog v-if="messageVisible" :visible.sync="messageVisible" :row="currentRow" @onMessage="onMessage" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'
import { setCookie, getCookie, getLocalStorage } from '@/utils/cache'
import { editPsw } from '@/api/user'
import zhIcon from '@/assets/img/icon/zh-icon.png'
import enIcon from '@/assets/img/icon/en-icon.png'
import alIcon from '@/assets/img/icon/th-icon.png'
import malaIcon from '@/assets/img/icon/mala-icon.png'
import topMenu from './topMenu'
import moment from 'moment-timezone'
export default {
  name: 'HeadNav',
  components: {
    topMenu
  },
  data() {
    var validatePass1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.pwdForm.newPassword_1 !== '') {
          this.$refs.pwdForm.validateField('newPassword_1')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.pwdForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      messageVisible: false,
      currentRow: {},
      pswLoading: false,
      pwdForm: {
        oldPassword: '',
        newPassword: '',
        newPassword_1: ''
      },
      pswVisible: false,
      rules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validatePass1, trigger: 'blur' }
        ],
        newPassword_1: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      zhIcon,
      enIcon,
      alIcon,
      malaIcon,
      lang: '',
      fullscreen: false,
      messageNum: '',
      socket: '',
      messagelist: [],
      companyLogo: require('@/assets/img/logo.png'),
      companyMinLogo: require('@/assets/img/logo1.png'),
      selectTimeZone: '',
      timeZones: [],
      langCountry: {
        'zh': 'CN',
        'en': 'US',
        'ar': 'IN',
        'mal': 'MY'
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'sidebar', 'isCollapse', 'isTopMenu', 'topFramePaths', 'topRouterPath']),
    headNavWidth() {
      return document.body.clientWidth - this.sidebar.width
    }
  },
  mounted() {
    this.lang = getCookie(process.env.VUE_APP_LANG_STR)
    const companyLogos = getLocalStorage('COMPANYLOGO')
    const toArrCompanyLogo = companyLogos ? companyLogos.split(',') : null
    if (toArrCompanyLogo) {
      [this.companyLogo, this.companyMinLogo] = toArrCompanyLogo.map(item => process.env.VUE_APP_GATEWAY_URL + item)
    }
    if (document.body.clientWidth < 1200) {
      this.collapseChage()
    }
    this.timeZones = moment.tz.zonesForCountry(this.langCountry[this.lang])
    const timeZones = getCookie(process.env.VUE_APP_TIME_ZONE_STR)
    if (!timeZones) {
      this.selectTimeZone = this.timeZones.length > 0 ? this.timeZones[0] : ''
      setCookie(process.env.VUE_APP_TIME_ZONE_STR, this.selectTimeZone)
    } else {
      this.selectTimeZone = timeZones
    }
  },
  methods: {
    onSubmit() {
      this.$refs['pwdForm'].validate((valid) => {
        if (valid) {
          this.pswLoading = true
          editPsw({
            newPassword: this.pwdForm.newPassword,
            oldPassword: this.pwdForm.oldPassword
          }).then(() => {
            this.pswLoading = false
            this.pswVisible = false
            this.$message.success(this.$i18n.tc('修改密码成功'))
            setTimeout(() => {
              store.dispatch('LogOut').then(() => {
                location.reload()// 为了重新实例化vue-router对象 避免bug
              })
            }, 1000)
          })
        }
      })
    },
    openSocket() {
      if (typeof (WebSocket) === 'undefined') {
        console.log(this.$i18n.tc('您的浏览器不支持WebSocket'))
      } else {
        this.socket = new WebSocket(this.src)
        // 监听socket连接
        this.socket.onopen = this.open
        // 监听socket错误信息
        this.socket.onerror = this.error
        // 监听socket消息
        this.socket.onmessage = this.getMessage
      }
    },
    open() {
      console.log('socket连接成功')
    },
    error() {
      console.log('连接错误')
    },
    getMessage(msg) {
      if (msg.data !== this.$i18n.tc('连接成功') && msg.data) {
        console.log(JSON.parse(msg.data))
        this.messageNum = JSON.parse(msg.data).num
        const _this = this
        const h = this.$createElement
        JSON.parse(msg.data).list.forEach((item, index) => {
          setTimeout(function () {
            // 叠加展示 关闭之前展示的消息
            if (_this.notifyInstance) {
              _this.notifyInstance.close()
            }
            _this.notifyInstance = _this.$notify({
              title: _this.$i18n.tc(item.title),
              dangerouslyUseHTMLString: true,
              //  _this.$i18n.tc('运单编号:')    message: '运单编号:' + _this.$i18n.tc(item.waybillNo) + '<br>' + _this.$i18n.tc(item.messageContent) + '<br>' + '扫描时间' + _this.$i18n.tc(item.waybillNo),
              message: h('p', [
                h('p', { style: 'cursor: pointer;', on: { click: () => { _this.onClickMessage() } }}, _this.$i18n.tc('运单编号:') + _this.$i18n.tc(item.waybillNo)),
                h('p', { style: 'cursor: pointer;', on: { click: () => { _this.onClickMessage() } }}, _this.$i18n.tc(item.messageContent)),
                h('p', { style: 'cursor: pointer;', on: { click: () => { _this.onClickMessage() } }}, _this.$i18n.tc('扫描时间') + _this.$i18n.tc(item.waybillNo))
              ]),
              position: 'bottom-right',
              type: 'warning'
            })
          }, 1000 * index)
        })
      }
    },
    onClickMessage() {
      this.messageVisible = true
    },
    onMessage() {
      this.notifyInstance.close()
      this.messageNum = ''
      this.$router.push({ path: '/message/message' })
    },
    send(params) {
      this.socket.send(params)
    },
    close() {
      console.log('socket已经关闭')
    },
    sendMessage() {
      if (typeof (WebSocket) === 'undefined') {
        console.log('您的浏览器不支持WebSocket')
      } else {
        console.log('您的浏览器支持WebSocket')
      }
    },
    matchedArr() {
      const temp = []
      const temps = []
      this.$route.matched.filter((item, index, self) => {
        if (item.meta.title) {
          const name = item.meta.title
          temp.push(name)
        }
      })
      temp.filter((item, index, self) => {
        if (!temps.includes(item)) {
          temps.push(item)
        }
      })
      return temps
    },
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command === 'loginout') {
        store.dispatch('LogOut').then(() => {
          location.reload()// 为了重新实例化vue-router对象 避免bug
        })
      } else if (command === 'resetPassword') {
        this.pswVisible = true
      }
    },
    // 多语言下拉菜单选择事件
    handleCommand1(lang) {
      setCookie(process.env.VUE_APP_LANG_STR, lang)
      this.lang = lang
      this.$i18n.locale = lang
      if (!this.topFramePaths) {
        location.reload()
      } else {
        document.getElementById('myIframe')
          .contentWindow.postMessage('reload',
            this.topFramePaths)
      }
      this.timeZones = moment.tz.zonesForCountry(this.langCountry[this.lang])
      this.selectTimeZone = this.timeZones.length > 0 ? this.timeZones[0] : ''
      setCookie(process.env.VUE_APP_TIME_ZONE_STR, this.selectTimeZone)
    },
    // 全屏事件
    handleFullScreen() {
      const element = document.documentElement
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
      this.fullscreen = !this.fullscreen
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse
      this.$store.dispatch('setLeftCollapse') // 折叠菜单
      this.$store.dispatch('handleLeftMenu') // 改变菜单宽度 180->35/35-180
      if (this.topFramePaths) {
        document.getElementById('myIframe')
          .contentWindow.postMessage({ 'setLeftCollapse': `${this.isCollapse}`, 'handleLeftMenu': this.sidebar },
            this.topFramePaths)
      }
    },
    goIndex() {
      this.$store.dispatch('ClickTopMenu', { path: 'home' })
      this.$store.dispatch('setFramePath', null)
      this.$router.push({ path: '/home/index' })
    },
    changeTimeZone(val) {
      setCookie(process.env.VUE_APP_TIME_ZONE_STR, val)
      if (!this.topFramePaths) {
        location.reload()
      } else {
        document.getElementById('myIframe')
          .contentWindow.postMessage('reload',
            this.topFramePaths)
      }
    }
  }
}
</script>

<style scoped lang='less'>
.rightCenten{
  flex-grow: 1;
  display: flex;
}
.time-zone-list {
  width: 150px !important;
  margin-left: 10px;
  /deep/ .el-input--mini .el-input__inner {
    height: 25px;
  }
}
.header {
  transition:all .3s ease;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 40px;
  color: rgba(140, 160, 179, 1);
  font-size: 22px;
  background: white;
}
.menu_page_top {
  transition:all .3s ease;
  float: left;
  width: 200px;
  text-align: center;
  border-bottom: 1px solid #eff3f8;
  background-color: #284876;
  img {
    vertical-align: middle;
  }
}
.header-right {
  .warehouseList{
    margin-left: 10px;
    font-size: 12px;
    &:hover{
      color: #169bd5;
      cursor: pointer;
    }
  }
}
.navTab {
  display: flex;
  height: 40px;
  background: #eff3f8;
}
.header-user-con {
  display: flex;
  align-items: center;
  height: 39px;
  padding-right: 30px;
}

.btn-fullscreen {
  margin-right: 5px;
  font-size: 24px;
  transform: rotate(45deg);
}

.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}

.btn-bell-badge {
  color: rgba(140, 160, 179, 1);
  background: #f56c6c;
}

.btn-bell .el-icon-bell {
  color: rgba(140, 160, 179, 1);
}

.user-name {
  margin-left: 10px;
}

.user-avator {
  margin-left: 10px;
}

.user-avator img {
  display: block;
  width: 31px;
  height: 31px;
  border-radius: 50%;
}

.el-dropdown-link {
  color: rgba(140, 160, 179, 1);
  cursor: pointer;
}

.el-dropdown-menu--mini {
  .el-dropdown-menu__item {
    padding: 3px 13px;
    font-size: 13px;
  }
}

.bread_container {
  height: 100%;
  .collapse-btn {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    i {
      font-size: 18px;
      cursor: pointer;
    }
  }
  .breadcrumb {
    float: left;
    height: 39px;
    margin-left: 15px;
    color: #97a8be;
    font-family: PingFangSC-Regular, PingFang SC;
    font-size: 12px;
    font-weight: 400;
    line-height: 39px;

    .breadbutton {
      float: left;
      margin: 4px 5px 0 0;
    }
  }
}
.header-right {
   /deep/ .el-badge__content {
    top: 3px;
    height: 14px;
    padding: 0 4px;
    line-height: 14px;
    background: rgba(241, 34, 34, 1);
  }
}

.bread_container {
   /deep/ .el-breadcrumb__separator {
    margin: 0 5px;
    color: #606266;
    font-weight: 500;
  }
}
.country-icon {
  width: 40px;
  margin: 3px 0 0 0;
  border-radius: 4px;
}
.country-icon-1 {
  width: 27px;
  margin: 0 0 -4px 0;
  border-radius: 3px;
  cursor: pointer;
}
#app {
   /deep/ .el-notification .right {
    z-index: 0 !important;
  }
}
</style>
