<template>
  <div class="common-wrap">
    <!-- 查询 -->
    <condition-form
      ref="conditionForm"
      v-model="searchForm"
      label-width="90px"
      :form-data="formData"
      @handleSearch="onSearch"
      @handleReset="onSearch"
    />
    <div class="common-box">
      <!-- 按钮 -->
      <div id="common-operation-btns">
        <el-button v-hasPermi="['system:appMenu:add']" type="success" icon="el-icon-plus" @click="append({})"> {{ $t('新增') }}</el-button>
      </div>
      <!-- 表格 -->
      <el-table
        ref="commonTable"
        v-loading="loading"
        :data="tableData"
        style="width: 100%;"
        row-key="menuId"
        border
        :height="calcTableHeight"
        highlight-current-row
        :expand-row-keys="expandRowKeys"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        @row-click="onRowClick"
      >
        <el-table-column prop="menuName" :label="$t('菜单名称')" width="250" />
        <el-table-column prop="perms" :label="$t('权限标识')" width="200" />
        <el-table-column prop="path" :label="$t('路由名称')" width="150" />
        <el-table-column prop="menuType" :label="$t('类型')">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.menuType === 'M'" type="success">{{ $t('目录') }}</el-tag>
            <el-tag v-if="scope.row.menuType === 'C'" type="warning">{{ $t('菜单') }}</el-tag>
            <el-tag v-if="scope.row.menuType === 'F'">{{ $t('按钮') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="icon" :label="$t('图标')">
          <template slot-scope="scope">
            <svg-icon
              style="font-size:18px;"
              :icon-class="scope.row.icon"
            />
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" :label="$t('排序')" />
        <el-table-column prop="status" :label="$t('状态')">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="0"
              inactive-value="1"
              :disabled="!$Utils.hasPermi(['system:appMenu:edit'])"
              @change="editFn(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="siteRankName" :label="$t('机构级别')" />
        <el-table-column prop="createTime" :label="$t('创建时间')" width="150" />
        <el-table-column
          fixed="right"
          :label="$t('操作')"
          width="130"
        >
          <template slot-scope="scope">
            <el-button v-hasPermi="['system:appMenu:add']" icon="el-icon-plus" circle :title="$t('新增')" type="primary" plain @click="append(scope.row)" />
            <el-button v-hasPermi="['system:appMenu:edit']" icon="el-icon-edit" circle :title="$t('修改')" type="success" plain @click="edit(scope.row)" />
            <el-button v-hasPermi="['system:appMenu:delete']" icon="el-icon-delete" circle :title="$t('删除')" type="danger" plain @click="remove(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增/编辑弹框 -->
    <edit-dialog
      v-if="addDialogVisible"
      :visible.sync="addDialogVisible"
      :type="type"
      :t-type="tType"
      :current-menu="currentMenu"
      @finish="getData()"
    />
  </div>
</template>

<script>
// import editDialog from './editDialog'

export default {
  name: 'SystemAppMenu',
  components: {
    editDialog
  },
  data() {
    return {
      tType: 2, // 类型：1-PC，2-APP,3-VIP
      type: '',
      loading: false,
      calcTableHeight: 0,
      searchForm: {},
      addDialogVisible: false,
      currentMenu: {},
      tableData: [],
      expandRowKeys: [],
      // 查询字段设置
      formData: [
        {
          label: this.$i18n.tc('菜单名称'),
          type: 'label_input',
          placeholder: this.$i18n.tc('请输入'),
          prop: 'menuName'
        },
        {
          label: this.$i18n.tc('菜单状态'),
          type: 'label_select',
          placeholder: this.$i18n.tc('请选择'),
          prop: 'status',
          options: [
            { value: '1', label: this.$i18n.tc('停用') },
            { value: '0', label: this.$i18n.tc('启用') }
          ]
        }
      ]
    }
  },
  mounted() {
    this.getData()
    this.$nextTick(() => {
      this.calcTableHeight = this.$Utils.setTableHeight()
    })
  },
  methods: {
    onRowClick(row, col) {
      if (col.label === this.$i18n.tc('操作') || col.property === 'status' || !row.children.length) return
      if (this.expandRowKeys.indexOf(row.menuId) !== -1) {
        this.expandRowKeys = []
        this.$refs.commonTable.toggleRowExpansion(row, false)
      } else {
        this.expandRowKeys = [row.menuId]
        this.$refs.commonTable.toggleRowExpansion(row, true)
      }
    },
    async getData() {
      if (!this.$Utils.hasPermi(['system:appMenu:list'])) {
        this.$message.warning(this.$i18n.tc('您没有查看列表的权限！'))
        return
      }
      this.loading = true
      const res = {
        type: this.tType,
        ...this.searchForm
      }
      try {
        const { data } = await this.$api.system.menu.list(res)
        this.tableData = this.$Utils.handleTree(data, 'menuId')
      } finally {
        this.loading = false
      }
    },
    // 新增
    append(row) {
      this.type = 'add'
      this.currentMenu = row
      this.addDialogVisible = true
    },
    // 编辑
    async edit(row) {
      this.type = 'edit'
      this.currentMenu = row
      this.addDialogVisible = true
    },
    // 删除
    remove(data) {
      this.$confirm(this.$i18n.tc('确定删除？'), this.$i18n.tc('提示'), {
        confirmButtonText: this.$i18n.tc('确定'),
        cancelButtonText: this.$i18n.tc('取消'),
        type: 'warning'
      }).then(() => {
        this.deleteMenu(data.menuId)
      }).catch(() => {})
    },
    // 删除
    async deleteMenu(id) {
      await this.$api.system.menu.remove({ menuId: id })
      this.$message.success(this.$i18n.tc('删除成功'))
      this.getData()
    },
    // 编辑
    async editFn(params) {
      await this.$api.system.menu.edit(params)
      this.$message.success('修改成功')
      this.getData()
      this.open = false
      this.menuVisibleRefresh = false
    },
    // 查询按钮
    onSearch() {
      this.getData()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
