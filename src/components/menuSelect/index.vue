<template>
  <div>
    <el-popover
      v-model="popoverVisible"
      placement="bottom"
      width="400"
      trigger="click"
    >
      <el-tree
        ref="tree"
        :data="treeData"
        node-key="menuId"
        highlight-current
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :props="{children: 'children',label: 'menuName'}"
        accordion
        @node-click="nodeClick"
      >
        <div slot-scope="{ data }" class="custom-tree-node">
          <span>{{ data.menuName }}</span>
          <span style="float:right;color:#abb8d7;">{{ data.menuId }}</span>
        </div>
      </el-tree>
      <el-input
        slot="reference"
        v-model="filterText"
        class="el-input__box"
        :placeholder="$t('输入查询')"
        clearable
      >
        <i v-if="!filterText" slot="suffix" class="el-icon-search el-input__icon" />
      </el-input>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'MenuSelect',
  props: {
    visible: {
      type: Boolean
    },
    text: {
      type: String,
      default: function() {
        return ''
      }
    }
  },
  data() {
    return {
      treeData: [],
      filterText: ''
    }
  },
  computed: {
    popoverVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
      return val
    }
  },
  mounted() {
    this.getData()
    if (this.text) {
      this.filterText = this.text
    }
  },
  methods: {
    // 获取数据
    async getData() {
      const params = {
        type: this.$store.getters.type
      }
      const { data } = await this.$api.system.menu.getMenuList(params)
      const menu = [{
        menuId: 0,
        menuName: this.$i18n.tc('主类目'),
        children: []
      }]
      menu[0].children = this.$Utils.handleTree(data, 'menuId')
      this.treeData = menu
    },
    // 过滤
    filterNode(value, data) {
      if (!value) return true
      return data.menuName.indexOf(value) !== -1
    },
    // 节点点击
    nodeClick(val) {
      this.filterText = val.menuName
      this.$emit('submit', val)
    }
  }
}
</script>

<style lang="scss" scoped>
    .custom-tree-node{
        width: 100%;
    }
    /deep/.el-tree{
      max-height: 500px;
      overflow-y: auto;
    }
</style>
