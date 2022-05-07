<template>
  <div class="menu_left cflex" :style="{width:sidebar.width+'px',top: '40px'}">
    <div v-show="!isCollapse" class="filter-input">
      <el-input v-model="filterText" :placeholder="$t('请输入关键字搜索菜单')" clearable @input="filterInput" />
    </div>
    <el-scrollbar style="width: 100%">
      <div class="menu_page_bottom is-scroll-left">
        <el-menu
          mode="vertical"
          theme="dark"
          :show-timeout="200"
          :unique-opened="true"
          :default-active="$route.path"
          :default-openeds="defaultOpeneds"
          :collapse="isCollapse"
          :text-color="menuObj.textColor"
          :active-text-color="menuObj.activeTextColor"
          :style="{width:sidebar.width+'px'}"
        >
          <template v-for="(item,index) in filterRouter">
            <!-- 一级并且没有子菜单(静态的) -->
            <router-link
              v-if="!item.hidden && item.noDropdown && item.children.length > 0"
              :key="index"
              :to="item.path+'/'+item.children[0].path"
            >
              <el-menu-item
                class="dropItem"
                :index="item.path+'/'+item.children[0].path"
              >
                <svg-icon class="leftmenu-svg-icon" :icon-class="item.meta.icon" />
                <span v-if="item.meta.title" slot="title" class="title">{{ $t(`${item.meta.title}`) }}</span>
              </el-menu-item>
            </router-link>
            <!-- 一级并且没有子菜单(动态的) -->
            <router-link
              v-if="!item.hidden && !item.noDropdown && !item.children"
              :key="index"
              :to="getPath(item)"
            >
              <el-menu-item
                class="dropItem"
                :index="getPath(item)"
              >
                <svg-icon class="leftmenu-svg-icon" :icon-class="item.meta.icon" />
                <span v-if="item.meta.title" slot="title" class="title">{{ $t(`${item.meta.title}`) }}</span>
              </el-menu-item>
            </router-link>
            <!-- 一级有子菜单 -->
            <el-submenu
              v-if="item.children && item.children.length >= 1 && !item.hidden && !item.noDropdown"
              :key="index"
              :index="getPath(item)"
            >
              <template slot="title">
                <svg-icon class="leftmenu-svg-icon" :icon-class="item.meta.icon" />
                <span v-if="item.meta.title" slot="title" class="title">{{ $t(`${item.meta.title}`) }}</span>
              </template>
              <template v-for="(citem,cindex) in item.children">
                <!-- 二级并且没有子菜单 -->
                <router-link
                  v-if="!citem.hidden && !citem.children"
                  :key="cindex"
                  :to="getPath(item,citem)"
                >
                  <el-menu-item
                    class="dropItem"
                    :index="getPath(item,citem)"
                  >
                    <svg-icon class="leftmenu-svg-icon" :icon-class="citem.meta.icon" />
                    <span v-if="citem.meta.title" slot="title" class="title">{{ $t(`${citem.meta.title}`) }}</span>
                  </el-menu-item>
                </router-link>
                <!-- 二级有子菜单 -->
                <el-submenu
                  v-if="citem.children && citem.children.length >= 1 && !citem.hidden"
                  :key="cindex"
                  :index="citem.path"
                >
                  <template slot="title">
                    <svg-icon class="leftmenu-svg-icon" :icon-class="citem.meta.icon" />
                    <span v-if="citem.meta.title" slot="title" class="title">{{ $t(`${citem.meta.title}`) }}</span>
                  </template>
                  <!--直接定位到子路由上，子路由也可以实现导航功能-->
                  <!-- 三级并且没有子菜单 -->
                  <router-link
                    v-for="(kitem,kindex) in citem.children"
                    :key="kindex"
                    :to="getPath(item,citem,kitem)"
                  >
                    <el-menu-item
                      v-if="kitem.meta.routerType != 'topmenu' && kitem.meta.title && !kitem.hidden"
                      :index="getPath(item,citem,kitem)"
                    >
                      <svg-icon class="leftmenu-svg-icon" :icon-class="kitem.meta.icon" />
                      <span slot="title" class="title">{{ $t(`${kitem.meta.title}`) }}</span>
                    </el-menu-item>
                  </router-link>
                </el-submenu>
              </template>
            </el-submenu>
          </template>
        </el-menu>
      </div>
    </el-scrollbar>
    <div ref="dragButton" class="drag-btn">
      <i class="el-icon-rank" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
export default {
  name: 'LeftMenu',
  data() {
    return {
      collapse: false,
      menuObj: {
        textColor: '#ccc',
        activeTextColor: '#fff'
      },
      filterText: '',
      filterRouter: [],
      defaultOpeneds: []
    }
  },
  computed: {
    ...mapGetters([
      'permission_routers',
      'topRouterPath',
      'isCollapse',
      'sidebar',
      'leftRouter',
      'isTopMenu',
      'maxLeftMenuWidth'
    ])
  },
  watch: {
    leftRouter(val) {
      this.filterRouter = _.cloneDeep(val)
    }
  },
  created() {
    this.filterRouter = _.cloneDeep(this.leftRouter)
  },
  mounted() {
    this.dragControllerDiv()
  },
  methods: {
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse
      this.$store.dispatch('setLeftCollapse') // 折叠菜单
      this.$store.dispatch('handleLeftMenu') // 改变菜单宽度 180->35/35-180
    },
    getPath(item, citem, kitem) {
      if (citem && item.path === '/demo') {
        return `${item.path}/${citem.path}`
      }
      if (citem && !kitem) {
        return this.isTopMenu ? `${this.topRouterPath}/${item.path}/${citem.path}` : `${item.path}/${citem.path}`
      }
      if (citem && kitem) {
        return this.isTopMenu ? `${this.topRouterPath}/${item.path}/${citem.path}/${kitem.path}` : `${item.path}/${citem.path}/${kitem.path}`
      }
      return this.isTopMenu ? `${this.topRouterPath}/${item.path}` : `${item.path}`
    },
    dragControllerDiv() {
      const dragButton = this.$refs.dragButton
      dragButton.onmousedown = (e) => {
        const startX = e.clientX
        dragButton.left = dragButton.offsetLeft
        document.onmousemove = (e) => {
          const endX = e.clientX
          let moveLen = dragButton.left + (endX - startX)
          if (moveLen < this.maxLeftMenuWidth) moveLen = this.maxLeftMenuWidth
          this.$store.dispatch('changeLeftCollapse', {
            sidebar: {
              opened: true,
              width: moveLen
            }
          })
        }
        document.onmouseup = () => {
          document.onmousemove = null
          document.onmouseup = null
          dragButton.releaseCapture && dragButton.releaseCapture()
        }
        dragButton.setCapture && dragButton.setCapture()
        return false
      }
    },
    filterInput(val) {
      this.filterRouter = _.cloneDeep(this.permission_routers)
      if (val) {
        this.searchKeyRouters(this.filterRouter, val)
        this.defaultOpeneds = this.filterRouter.map(item => this.getPath(item))
      } else {
        this.filterRouter = _.cloneDeep(this.leftRouter)
        this.defaultOpeneds = []
      }
    },
    searchKeyRouters(data, val) {
      data.forEach(item => {
        if (item.children) {
          let arr = []
          item.children.forEach(it => {
            if (it.meta && it.meta.title.indexOf(val) !== -1 && !it.children) {
              arr = _.concat(arr, it)
            } else if (it.children) {
              const child = it.children.filter(i => i.meta && i.meta.title.indexOf(val) !== -1)
              it.children = child
              if (child.length > 0) {
                arr = _.concat(arr, it)
              }
            }
          })
          item.children = arr
        } else {
          item.hidden = !(item.meta && item.meta.title.indexOf(val) !== -1)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@left-bgColor: #fff; // 左侧菜单背景颜色;
@icon-link: #ff6c60;
.menu_left {
  transition:all .3s ease;
  position: absolute;
  top: 0px;
  left: 0;
  bottom: 0;
  background: #284876;
  .el-scrollbar {
    height: 100%;
  }
  /deep/ .el-scrollbar__wrap {
    margin: 0 !important;
    overflow-x: hidden;
    scrollbar-color: transparent transparent;
    scrollbar-track-color: transparent;
    -ms-scrollbar-track-color: transparent;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
  }
  .drag-btn {
    width: 16px;
    height: 70px;
    background: url('~@/assets/img/menu_contro_bg.png') no-repeat;
    top: 50%;
    margin-top: -35px;
    position: absolute;
    right: 0;
    line-height: 70px;
    color: @left-bgColor;
    z-index: 200;
    cursor: pointer;
    color: #284876;
    z-index: 10;
  }
}
.menu_page_top {
  width: 100%;
  height: 73px;
  line-height: 73px;
  align-items: center;
  justify-content: space-around;
  text-transform: uppercase;
  box-sizing: border-box;
  text-align: center;
  background: #284876;
  border-bottom: 2px solid #fff;
  .logo {
    height: 36px;
    width: 36px;
    vertical-align: middle;
    display: inline-block;
  }

  .collapse-btn {
    color: white;
    cursor: pointer;
    display: inline-block;
    vertical-align: middle;
    margin-left: 5px;
  }

  .closeLogo {
    width: 30px;
    height: 30px;
  }

  .title {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
    font-size: 16px;
    font-family: Helvetica;
    color: rgba(255, 255, 255, 0.87);
    display: inline-block;
    vertical-align: top;
    padding-top: 10px;
  }
}
.menu_page_bottom {
  width: 100%;
  padding-top: 5px;
  flex: 1;
  z-index: 10;
}
.svg-icon {
  margin-right: 10px;
}
.menu-line {
  position: absolute;
  top: 0;
  right: 0;
  width: 3px;
  height: 100%;
  background: transparent;
  cursor: w-resize;
  z-index: 9;
}
.filter-input {
  padding: 5px 5px 0;
}
</style>
<style lang="scss">
.is-opened i,
.is-opened .el-submenu__title{
  color: #ffffff !important;
}
.menu_left {
  a {
    text-decoration: none;
  }

  .el-menu {
    transition:all .3s ease;
    background: #284876;
    border-right: 0;
  }
  .el-menu-item {
    color: #ffffff99;
    text-align: left;
    border-color: transparent;
    i {
      color: ffffff99;
    }
  }
  .el-menu-item.is-active,
  .el-menu-item:focus,
  .el-menu-item:hover,
  .el-submenu__title:hover {
    background:#0278b1;
    border-color: #0278b1;
    color: #ffffff!important;
    i {
      color: #ffffff!important;
    }
  }
  .el-submenu.is-active .el-submenu__title{
    color: #ffffff!important;
    i {
      color: #ffffff!important;
    }
  }
  .el-submenu__title {
    height: 50px;
    line-height: 50px;
    text-align: left;
  }
  .leftmenu-svg-icon{
      font-size: 19px;
      margin-right:10px;
  }
}
.el-tooltip__popper {
  background: #0c3761 !important;
  color: #fff;
}
.el-submenu__title:focus, .el-submenu__title:hover{
  background-color:#0c3761!important
}
</style>
