<template>
  <div class="common-wrap organization">
    <!-- 左侧树形 -->
    <div v-loading="treeBox.loading" class="left" :style="{height:treeBox.height,width:treeBox.width+'px'}">
      <div id="organizationSearch">
        <el-input
          v-model="treeBox.filterText"
          clearable
          class="con-margin-b"
          suffix-icon="el-icon-search"
          :placeholder="$t('输入关键字进行过滤')"
        />
      </div>
      <div>
        <el-scrollbar :style="{height:treeBox.scrollbarHeight}">
          <el-tree
            ref="tree"
            :data="treeBox.treeData"
            node-key="id"
            highlight-current
            default-expand-all
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            @node-click="viewSite"
          >
            <div slot-scope="{ data }" class="custom-tree-node">
              <span>{{ data.label }}</span>
              <div style="padding-right:10px">
                <el-button type="text" size="mini" @click.stop="addEditMain(data)"> 编辑 </el-button>
                <el-button type="text" size="mini" @click.stop="addSite(data)"> 添加下级 </el-button>
                <el-button type="text" size="mini" @click.stop="deleteSite(data)"> 删除 </el-button>
              </div>
            </div>
          </el-tree>
        </el-scrollbar>
      </div>
      <div ref="menuLine" class="menu-line" />
    </div>
    <!-- 右侧表单 -->
    <div ref="right" class="right" :style="{height:treeBox.height,width:rightWidth}">
      <detail v-if="detailOptions.visible && showTyoe === 'detail'" :visible.sync="detailOptions.visible" :site-id="detailOptions.siteId" />
      <add v-else-if="addOptions.visible && showTyoe === 'add'" :visible.sync="addOptions.visible" :parent-id="addOptions.parentId" />
      <div v-else class="tip">点击左侧列表查看数据</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import add from './components/add'
import detail from './components/detail'
export default {
  name: 'Organization',
  components: {
    add,
    detail
  },
  data() {
    return {
      treeBox: {
        treeData: [],
        scrollbarHeight: '',
        filterText: '',
        loading: false,
        height: '',
        width: 400
      },
      showTyoe: '',
      addOptions: {
        parentId: '',
        visible: false
      },
      detailOptions: {
        siteId: '',
        visible: false
      }
    }
  },
  computed: {
    rightWidth() {
      const sidebarWidth = this.sidebar.width
      const leftWidth = this.treeBox.width
      return `calc(100vw - (${sidebarWidth + leftWidth + 30}px))`
    },
    ...mapGetters([
      'sidebar'
    ])
  },
  watch: {
    'treeBox.filterText'(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
    this.getHeight()
    this.getWebsiteData()
    this.dragControllerDiv()
  },
  methods: {
    getHeight() {
      const headerHeight = document.querySelector('#common-header') ? document.querySelector('#common-header').clientHeight : 0 // 头部高度
      const tagHeight = document.querySelector('#tags-view-container') ? document.querySelector('#tags-view-container').clientHeight : 0 // 标签高度
      const inputHeight = document.querySelector('#organizationSearch') ? document.querySelector('#organizationSearch').clientHeight + 10 : 0 // 搜索框
      this.treeBox.height = `calc(100vh - (${headerHeight + tagHeight + 20}px))`
      this.treeBox.scrollbarHeight = `calc(100vh - (${headerHeight + tagHeight + 20 + inputHeight + 20}px))`
    },
    dragControllerDiv() {
      const menuLine = this.$refs.menuLine
      menuLine.onmousedown = (e) => {
        this.$refs.right.style.transition = 'all .0s ease'
        const startX = e.clientX
        menuLine.left = menuLine.offsetLeft
        document.onmousemove = (e) => {
          const endX = e.clientX
          const moveLen = menuLine.left + (endX - startX)
          if (moveLen < 400) return
          this.treeBox.width = moveLen
        }
        document.onmouseup = (e) => {
          this.$refs.right.style.transition = 'all .3s ease'
          document.onmousemove = null
          document.onmouseup = null
          menuLine.releaseCapture && menuLine.releaseCapture()
        }
        menuLine.setCapture && menuLine.setCapture()
        return false
      }
    },
    // 获取网点数据
    async getWebsiteData() {
      this.treeBox.loading = true
      try {
        const res = await this.$api.system.organization.list()
        this.treeBox.treeData = res.data
      } finally {
        this.treeBox.loading = false
      }
    },
    // 树形过滤节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 新增
    addSite(val) {
      this.showTyoe = 'add'
      this.addOptions.parentId = val.id
      this.addOptions.visible = true
    },
    // 删除
    deleteSite(val) {
      this.$confirm(`即将删除“${val.label}”, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async () => {
        this.treeBox.loading = true
        try {
          await this.$api.system.organization.delete(val.id)
          this.$resetMessage.success('操作成功')
          this.getWebsiteData()
        } finally {
          this.treeBox.loading = false
        }
      })
    },
    // 查看
    viewSite(val) {
      this.showTyoe = 'detail'
      this.detailOptions.siteId = val.id
      this.detailOptions.visible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.organization{
  display: flex;
  justify-content: space-between;
  .left{
    background-color: #fff;
    padding: 10px;
    box-sizing: border-box;
    position: relative;
    .menu-line {
      position: absolute;
      top: 0;
      right: 0;
      width: 5px;
      height: 100%;
      cursor: w-resize;
    }
  }
  .right{
    transition:all .3s ease;
    background-color: #fff;
    padding: 10px;
    box-sizing: border-box;
    .tip{
      height: 100%;
      display: flex;
      font-size: 14px;
      align-items: center;
      justify-content: center;
      color: #ccc;
    }
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.el-cascader--medium,.el-select{
  width: 100%;
}
.el-checkbox,.el-radio--small{
  margin-right: 10px;
}
  /deep/ .el-scrollbar__wrap {
    overflow-x: hidden;
    -ms-overflow-style: none;
    scrollbar-color: transparent transparent;
    -ms-scrollbar-track-color: transparent;
        scrollbar-track-color: transparent;
  }
  /deep/ .el-scrollbar__bar.is-horizontal{
    display: none;
  }
</style>
