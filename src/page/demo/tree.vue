<!--
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-03-10 13:57:18
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-03-24 17:24:22
-->
<template>
  <div class="common-wrap">
    <el-row :gutter="5">
      <el-col :span="8">
        <div class="header">
          <span>组织架构树形：</span>
        </div>
        <website-tree
          :height="height"
          @handleNodeClick="handleNodeClick"
        />
      </el-col>
      <el-col :span="8">
        <div class="header">
          <span>带按钮的组织架构树形：</span>
        </div>
        <website-tree
          :operation="treeOperation"
          :height="height"
          @handleLabelClick="handleLabelClick"
        />
      </el-col>
      <el-col :span="8">
        <div class="header">
          <span>主子类别树形：</span>
        </div>
        <website-tree
          :tree-cus-data="treeData"
          :cus-loading="loading"
          :operation="treeOperation"
          :height="height"
          @handleNodeClick="handleNodeClick"
        />
      </el-col>
    </el-row>
    <base-dialog title="查看组织机构" :visible.sync="innerVisible">
      <website-tree
        height="500px"
        @handleNodeClick="handleNodeClick"
      />
    </base-dialog>
  </div>
</template>
<script>
import websiteTree from '@/components/websiteTree'
export default {
  name: 'TreeTable',
  components: {
    websiteTree
  },
  data() {
    return {
      currentSite: {},
      treeOperation: {
        data: [
          {
            title: '编辑',
            icon: 'el-icon-edit',
            handleClick: (row) => {

            }
          },
          {
            title: '添加下级',
            icon: 'el-icon-plus',
            handleClick: (row) => {
            }
          },
          {
            title: '删除',
            icon: 'el-icon-delete',
            handleClick: (row) => {
            }
          }
        ],
        width: 110
      },
      height: '',
      loading: false,
      treeData: [],
      innerVisible: false
    }
  },
  mounted() {
    this.computContentHeight()
    this.getMainData()
  },
  methods: {
    handleNodeClick(val) {
      this.currentSite = { ...val }
    },
    handleLabelClick(row) {

    },
    // 获取主类（树形）列表
    async getMainData() {
      this.loading = true
      try {
        const res = await this.$api.common.dictionary.mainList()
        this.treeData = res.rows.map(item => ({
          ...item,
          label: `${item.mainName} （${item.mainCode}）`
        }))
      } finally {
        this.loading = false
      }
    },
    computContentHeight() {
      this.$nextTick(() => {
        this.height = this.$Utils.setContentHeight(68)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.header {
  line-height: 30px;
  background-color: #ffffff;
  padding: 0 5px;
  font-weight: bold;
}
</style>
