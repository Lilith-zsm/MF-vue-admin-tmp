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
        node-key="siteCode"
        highlight-current
        default-expand-all
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :props="{children: 'children',label: 'siteNameChinese'}"
        @node-click="nodeClick"
      >
        <div slot-scope="{ data }" class="custom-tree-node">
          <span>{{ data.siteNameChinese }}</span>
          <span style="float:right;color:#abb8d7;">{{ data.siteCode }}</span>
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
import * as _api from '@/api/system/organization'

export default {
  name: 'WebsiteSelect',
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
      treeData: []
      // filterText:'',
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
    },
    filterText: {
      get() {
        return this.text
      },
      set(val) {
        return val
        // this.text = val;
        // this.$emit('update:visible', val);
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
  },
  methods: {
    // 获取网点数据
    async getData() {
      const { data } = await _api.siteList()
      this.treeData = this.$Utils.handleTree(data, 'id')
    },
    // 过滤
    filterNode(value, data) {
      if (!value) return true
      return data.siteNameChinese.indexOf(value) !== -1
    },
    // 节点点击
    nodeClick(val) {
      this.filterText = val.siteNameChinese
      this.$emit('submit', val)
    }
  }
}
</script>

<style lang="scss" scoped>
    .custom-tree-node{
        width: 100%;
    }
</style>
