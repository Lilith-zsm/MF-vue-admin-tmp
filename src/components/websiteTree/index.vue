<!--
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-03-10 14:02:40
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-03-25 17:43:58
-->
<template>
  <div class="websiteTree">
    <el-row :gutter="10">
      <el-col :span="operation.showTreeBtn ? 19 : 24">
        <el-input
          v-model="filterText"
          :placeholder="$t('输入关键字进行过滤')"
          clearable
          @input="searchEvent"
        />
      </el-col>
      <el-col v-if="operation.showTreeBtn" :span="5">
        <slot name="tree-add-button" />
      </el-col>
    </el-row>
    <el-scrollbar :style="{height: height || computTreeHeight()}">
      <vxe-table
        ref="websiteTree"
        size="small"
        border="none"
        show-overflow
        :row-config="{isCurrent: true, useKey: true}"
        :show-header="false"
        :data="filterTreeData"
        :radio-config="{labelField: 'label'}"
        :cell-style="{height: '35px'}"
        :loading="loading || cusLoading"
        :tree-config="{
          line: true,
          expandAll: true,
          iconOpen: 'el-icon-caret-bottom',
          iconClose: 'el-icon-caret-right'}"
        @current-change="currentChange"
        @radio-change="radioChange"
      >
        <vxe-column type="radio" tree-node>
          <template #radio="{ row, checked }">
            <div class="tree-label" @click="handleLabelClick(row)">
              <i :class="!checked ? 'el-icon-folder' : 'el-icon-folder-checked'" class="radio-select-icon" />
              <span v-html="row.label" />
            </div>
          </template>
        </vxe-column>
        <vxe-column v-if="operation.data" title="操作" :width="operation.width + 'px'">
          <template #default="{ row }">
            <vxe-button
              v-for="item in operation.data"
              :key="item.title"
              style="margin-left: 3px;"
              type="text"
              :icon="item.icon"
              :title="item.title"
              @click="handleClick(item, row)"
            />
          </template>
        </vxe-column>
      </vxe-table>
    </el-scrollbar>
  </div>
</template>
<script>
import XEUtils from 'xe-utils'
export default {
  props: {
    height: {
      type: String,
      default: ''
    },
    operation: {
      type: Object,
      default: function() {
        return {}
      }
    },
    treeCusData: {
      type: Array,
      default: function() {
        return null
      }
    },
    cusLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      treeData: [],
      loading: false,
      filterText: '',
      filterTreeData: []
    }
  },
  watch: {
    treeCusData(val) {
      if (!val) return
      this.treeData = val
      this.searchEvent()
    }
  },
  mounted() {
    if (!this.treeCusData) {
      this.getWebsiteData()
    }
  },
  methods: {
    // 获取网点数据
    async getWebsiteData() {
      this.loading = true
      try {
        const res = await this.$api.system.organization.list()
        this.treeData = res.data
        this.searchEvent()
        this.loading = false
      } catch {
        this.loading = false
      }
    },
    searchEvent () {
      const filterName = XEUtils.toValueString(this.filterText).trim().toLowerCase()
      if (filterName) {
        const filterRE = new RegExp(filterName, 'gi')
        const options = { children: 'children' }
        const searchProps = ['label']
        const rest = XEUtils.searchTree(this.treeData, item => searchProps.some(key => XEUtils.toValueString(item[key]).toLowerCase().indexOf(filterName) > -1), options)
        XEUtils.eachTree(rest, item => {
          searchProps.forEach(key => {
            item[key] = XEUtils.toValueString(item[key]).replace(filterRE, match => `<span class="keyword-lighten">${match}</span>`)
          })
        }, options)
        this.filterTreeData = rest
        // 搜索之后默认展开所有子节点
        this.$nextTick(() => {
          this.$refs.websiteTree.setAllTreeExpand(true)
        })
      } else {
        this.filterTreeData = this.treeData
        this.$nextTick(() => {
          this.$refs.websiteTree.setAllTreeExpand(true)
        })
      }
    },
    currentChange({ row }) {
      this.$refs.websiteTree.setRadioRow(row)
      this.$emit('handleNodeClick', row)
    },
    radioChange({ row }) {
      this.$refs.websiteTree.setCurrentRow(row)
      this.$emit('handleNodeClick', row)
    },
    computTreeHeight() {
      return this.$Utils.setContentHeight(38)
    },
    handleLabelClick(row) {
      this.$emit('handleLabelClick', row)
    },
    handleClick(item, row) {
      if (item.handleClick) {
        item.handleClick(row)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.websiteTree {
  padding: 5px;
  background-color: #fff;
  /deep/ .keyword-lighten {
    color: #000;
    background-color: #FFFF00;
  }
  .radio-select-icon {
    font-size: 16px;
    margin-right: 10px;
  }
  /deep/ .vxe-button.type--text {
    padding-bottom: 3px;
    padding-top: 3px;
  }
  .tree-label {
    cursor: pointer;
  }
}
</style>
