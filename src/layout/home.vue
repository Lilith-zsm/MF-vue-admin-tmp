<template>
  <div class="home rflex">
    <!-- 头部菜单 -->
    <head-nav />
    <!-- End -->
    <!-- 左侧菜单 -->
    <left-menu v-if="!topFramePaths" />
    <!-- End -->
    <div v-if="!topFramePaths" ref="menu_right" class="menu_right wflex el-scrollbar" :style="{left:sidebar.width+'px',top:'40px'}">
      <!-- tag 页签 -->
      <tags-view />
      <!-- End -->
      <!-- 右侧内容 -->
      <div ref="menu_content" class="menu_content">
        <el-scrollbar>
          <transition name="fade-transform" mode="out-in">
            <keep-alive :include="cachedViews">
              <router-view :key="key" />
            </keep-alive>
          </transition>
        </el-scrollbar>
        <minus-button />
      </div>
    </div>
    <!-- End -->
    <!-- 子系统iframe -->
    <iframe id="myIframe" :src="topFramePaths ? frameUrl : ''" frameborder="0" width="100%" style="height: calc(100vh - 61px)" />
    <!-- End -->
    <!-- 底部 -->
    <div class="footer" :style="{'paddingLeft': sidebar.width+'px'}">
      <div>敏思达科技有限公司&nbsp;&nbsp;&nbsp;&nbsp;粤ICP备2022010374号-1</div>
    </div>
    <!-- End -->
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Loading from '@/components/loading/index.js'
import HeadNav from './headNav.vue'
import LeftMenu from './leftMenu.vue'
import minusButton from '@/components/minusButton'
import tagsView from '@/components/tagsView'
export default {
  name: 'Home',
  components: {
    HeadNav,
    LeftMenu,
    minusButton,
    tagsView
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'topRouterPath', 'topFramePaths']),
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    },
    frameUrl() {
      return this.topFramePaths + '?parent_url=' + window.location.host
    },
    ishave() {
      return this.$store.state.tagsView.cachedViews.includes(this.$route.name)
    }
  },
  watch: {
    topFramePaths(val) {
      if (val) {
        const iframe = document.getElementById('myIframe')
        if (iframe.attachEvent) {
          iframe.attachEvent('onreadystatechange', function() {
            if (iframe.readyState === 'complete' || iframe.readyState === 'loaded') {
              Loading.hide()
            }
          })
        } else {
          iframe.addEventListener('load', function() {
            Loading.hide()
          }, false)
        }
      }
    }
  }
}
</script>
<style scoped lang='scss'>
  .home{
    .menu_right{
      transition:all .3s ease;
      position: absolute;
      right:0;
      top:0;
      bottom:0;
      background:rgba(238,244,249,1);
      .menu_content{
        position: relative;
        width:100%;
        .el-scrollbar {
          height: calc(100vh - 94px);
        }
        /deep/ .el-scrollbar__wrap {
          overflow-x: hidden;
          scrollbar-color: transparent transparent;
          scrollbar-track-color: transparent;
          -ms-scrollbar-track-color: transparent;
          -ms-overflow-style: none;
        }
      }
    }
    .footer{
      text-align: center;
      font-size: 12px;
      position: fixed;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
      padding-bottom: 5px;
    }
  }
</style>
