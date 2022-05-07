
<template>
  <div ref="menuTop" class="top_menu">
    <el-scrollbar :vertical="false" class="scroll-container">
      <a
        v-for="(item,index) in topRouters"
        :key="index"
        class="top_menu_route"
        :class="topRouterPath === item.path ? 'cur_menu' : 'menu'"
        @click="onClickTopMenu(item, index)"
      >
        <span v-if="item.meta && item.meta.title">
          <svg-icon class="leftmenu-svg-icon" :icon-class="item.meta.icon" />
          <span>{{ $t(`${item.meta.title}`) }}</span>
        </span>
      </a>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Loading from '@/components/loading/index.js'
export default {
  name: 'TopMenu',
  data() {
    return {
      path: '',
      menuObj: {
        bgColor: '',
        textColor: '',
        activeTextColor: ''
      },
      firstPath: ''
    }
  },
  computed: {
    ...mapGetters(['topRouters', 'leftRouter', 'topMenuWidth', 'topRouterPath', 'isCollapse', 'sidebar', 'topFramePaths'])
  },
  watch: {
    '$route': 'getPath'
  },
  created() {
  },
  mounted() {
    this.getPath()
    this.$store.dispatch('setTopMenuWidth')
  },
  methods: {
    onClickTopMenu(item) {
      if (item.systemUrl) {
        const frameURL = process.env.NODE_ENV === 'production' ? item.systemUrl : process.env.VUE_APP_DMS_URL
        if (this.topFramePaths === frameURL) return
        Loading.show()
        this.$store.dispatch('setFramePath', frameURL)
        this.$store.dispatch('setTopPath', item.path)
        const iFrame = document.getElementById('myIframe')
        iFrame.onload = () => {
          iFrame.contentWindow.postMessage({ 'setLeftCollapse': `${this.isCollapse}`, 'handleLeftMenu': this.sidebar },
            frameURL)
        }
        return
      }
      this.$store.dispatch('setFramePath', null)
      this.$store.dispatch('delAllVisitedViews').then(() => {
        this.$store.dispatch('ClickTopMenu', { ...item }).then(() => {
          var path = ''
          // 默认调转第一个路由
          if (item.children && item.children.length) {
            const kitem = item.children[0]
            if (kitem.children && kitem.children.length) {
              const citem = kitem.children[0]
              if (citem.children && citem.children.length) {
                path = `${item.path}/${kitem.path}/${citem.path}/${citem.children[0].path}`
              } else {
                path = `${item.path}/${kitem.path}/${citem.path}`
              }
            } else {
              path = `${item.path}/${kitem.path}`
            }
          } else {
            path = item.path
          }
          this.$router.push({ path: path })
        })
      })
    },
    getPath() {
      const path = this.$route.path.split('/')
      this.path = `/${path.length > 1 ? path[1] : ''}`
      this.$store.dispatch('setTopMenuWidth')
    }
  }
}

</script>

<style lang="scss" scoped>
.top_menu{
  flex-grow: 1;
  height: 39px;
  display: inline-block;
  .top_menu_route{
    vertical-align: top;
    display: inline-block;
    height: 39px;
    line-height: 39px;
    cursor: pointer;
    font-size: 14px;
    padding: 0 16px;
    margin: 0 2px;
    .leftmenu-svg-icon{
      margin-right: 5px;
      font-size: 14px;
    }
    &:hover{
      background: #0278b1;
      color: #ffffff;
    }
  }
  .cur_menu{
    background: #0278b1;
    color: #ffffff;
  }
}
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  /deep/.is-vertical{
    display: none;
  }
}
</style>
