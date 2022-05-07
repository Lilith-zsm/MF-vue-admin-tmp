<template>
  <div>
    <vxe-toolbar ref="xToolbar1" class="con-button-rows" custom />
    <vxe-table
      id="xTable"
      ref="xTable"
      border
      stripe
      :height="height"
      :max-height="maxHeight"
      :min-height="200"
      :loading="loading"
      resizable
      :column-config="{
        useKey: true,
        isHover: true, //当鼠标移到列头时，是否要高亮当前列头
        isCurrent: true, //当鼠标点击列头时，是否要高亮当前列
        minWidth: 100 //每一列的最小宽度
      }"
      :custom-config="{
        storage: customStorage // 是否启用 localStorage 本地保存
      }"
      :row-config="{
        isCurrent: true, // 当鼠标点击行时，是否要高亮当前行
        isHover: true // 当鼠标移到行时，是否要高亮当前行
      }"
      :checkbox-config="{
        labelField: '', //复选框显示的字段名
        reserve: true, //是否保留勾选状态
        range:!treeConfig //开启复选框范围选择功能
      }"
      :scroll-y="{
        mode: 'wheel', // 滚动模式
        oSize: 50 // 指定每次渲染的数据偏移量
      }"
      :seq-config="{
        startIndex: pageVo? (pageVo.currentPage - 1) * pageVo.pageSize : '' // 设置序号的起始值
      }"
      :filter-config="filterConfig"
      size="mini"
      :tree-config="treeConfig"
      :data="dataSource"
      @checkbox-change="checkboxChange"
      @checkbox-all="checkboxChange"
      @current-change="currentChange"
      @toggle-tree-expand="toggleTreeExpand"
    >
      <vxe-column type="seq" width="50" fixed="left" :resizable="false" align="center">
        <template #header>
          <div>
            <i class="vxe-icon--funnel" style="cursor: pointer" @click="showHeaderFilter = !showHeaderFilter" />
          </div>
        </template>
      </vxe-column>
      <vxe-column type="checkbox" fixed="left" width="60" align="center" :resizable="false" />
      <template v-for="item in columns">
        <!-- 表头筛选 -->
        <vxe-colgroup
          v-if="headerFilter && showHeaderFilter && item.field !== 'operation'"
          :key="item.field + item.title"
          :title="item.title"
          :resizable="true"
          :align="item.align || 'center' "
          :width="item.width"
        >
          <vxe-column
            :field="item.field"
            :filters="[{data: setFilterInitData(item.filterType)}]"
            :filter-method="customFilterMethod"
            :align="item.align || 'center'"
            :width="item.width"
            :title="item.title"
            :sortable="item.sortable"
            header-class-name="filter-header"
          >
            <template #header="{ column }">
              <div v-for="(option, index) in column.filters" :key="index">
                <!-- input -->
                <el-input
                  v-if="item.filterType === 'label_input' || !item.filterType"
                  v-model="option.data"
                  type="text"
                  :placeholder="$t('请输入')"
                  clearable
                  @input="filterEvent(option)"
                />
                <!-- date -->
                <el-date-picker
                  v-if="item.filterType === 'label_date'"
                  v-model="option.data"
                  type="daterange"
                  range-separator="~"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
                <!-- select -->
                <el-select
                  v-if="item.filterType === 'label_select'"
                  v-model="option.data"
                  clearable
                  placeholder="请选择"
                  @change="filterEvent(option)"
                >
                  <el-option
                    v-for="op in item.options"
                    :key="op.value"
                    :label="$t(op.label)"
                    :value="op.value"
                  />
                </el-select>
              </div>
            </template>
          </vxe-column>
        </vxe-colgroup>
        <!-- 普通列-->
        <vxe-column
          v-if="(!headerFilter || !showHeaderFilter) && item.field !== 'operation'"
          :key="item.field + item.title"
          :align="item.align || 'center' "
          :field="item.field"
          :title="item.title"
          :width="item.width"
          :sortable="item.sortable"
        />
        <!-- 操作列 -->
        <vxe-column
          v-if="item.field === 'operation'"
          :key="item.field"
          fixed="right"
          :title="item.title"
          :width="item.width"
          :resizable="false"
          :align="item.align || 'center' "
        >
          <template #default="{ row }">
            <el-button
              v-for="btn in item.params"
              :key="btn.title"
              v-hasPermi="btn.hasPermi"
              :icon="btn.saveIcon && $refs.xTable.isActiveByRow(row) ? btn.saveIcon : btn.icon"
              circle
              size="mini"
              style="padding: 6px 6px;"
              :title="btn.saveTitle && $refs.xTable.isActiveByRow(row) ? $t(btn.saveTitle) : $t(btn.title)"
              :type="btn.type"
              plain
              @click="btn.click ? btn.click(row, $refs.xTable.isActiveByRow(row)) : ''"
            />
          </template>
        </vxe-column>
      </template>
      <template #empty>
        <span>
          <img src="@/assets/img/no_data.png" width="100">
          <p>{{ $t('暂无数据') }}</p>
        </span>
      </template>
    </vxe-table>
    <vxe-pager
      class="con-pager"
      size="mini"
      :loading="loading"
      :current-page="pageVo.currentPage"
      :page-size="pageVo.pageSize"
      :total="pageVo.total"
      :page-sizes="pageVo.pageSizes ? pageVo.pageSizes : [50, 100, 200, 300, 500, 1000]"
      :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
      @page-change="handlePageChange"
    />
  </div>
</template>
<script>
import Sortable from 'sortablejs'
import XEUtils from 'xe-utils'
export default {
  props: {
    // 数据列表
    dataSource: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 表头
    columns: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 表头筛选
    headerFilter: {
      type: Boolean,
      default: false
    },
    // 加载状态
    loading: {
      type: Boolean,
      default: false
    },
    // 分页参数
    pageVo: {
      type: Object,
      default() {
        return null
      }
    },
    // 是否显示表尾
    showFooter: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 表尾的数据获取方法
    footerMethod: {
      type: Function,
      default() {
        return ''
      }
    },
    // 树节点配置
    treeConfig: {
      type: Object,
      default() {
        return null
      }
    },
    // 筛选配置
    filterConfig: {
      type: Object,
      default() {
        return null
      }
    },
    // 是否显示自定义列
    customStorage: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      height: 450,
      maxHeight: null,
      changePage: false,
      showHeaderFilter: this.headerFilter
    }
  },
  watch: {
    dataSource: {
      handler(val) {
        if (!this.changePage) {
          this.clearAll()
        } else {
          this.changePage = false
        }
      }
    }
  },
  created() {
    this.columnDrop()
  },
  mounted() {
    this.setTableHeight()
    window.onresize = () => { this.setTableHeight() }
  },
  beforeDestroy () {
    if (this.sortable) {
      this.sortable.destroy()
    }
  },
  methods: {
    setTableHeight() {
      this.$nextTick(() => {
        this.height = this.tableType === 'dialogTable' ? 300 : this.$Utils.setTableHeight()
        if (this.tableType === 'dialogTable') {
          this.maxHeight = this.$Utils.setDialogTableHeight() > 300 ? this.$Utils.setDialogTableHeight() : 300
        }
      })
    },
    filterEvent (option) {
      const xTable = this.$refs.xTable
      // 设置为选中状态
      option.checked = true
      // 修改条件之后，需要手动调用 updateData 处理表格数据
      xTable.updateData()
    },
    handlePageChange ({ currentPage, pageSize }) {
      this.changePage = true
      this.$emit('handlePageChange', { currentPage, pageSize })
    },
    checkboxChange({ records }) {
      this.$emit('handleSelectionChange', records)
    },
    currentChange({ row }) {
      this.$emit('handleCurrentChange', row)
    },
    toggleTreeExpand({ expanded, row }) {
      this.$emit('toggleTreeExpand', { expanded, row })
    },
    // 清空选中状态
    clearAll() {
      this.$refs.xTable.clearAll()
    },
    customFilterMethod ({ option, row, column }) {
      if (option.data) {
        return XEUtils.toValueString(row[column.property]).toLowerCase().indexOf(option.data) > -1
      }
      return true
    },
    // 列拖动
    columnDrop () {
      this.$nextTick(() => {
        const $table = this.$refs.xTable
        this.sortable = Sortable.create($table.$el.querySelector('.body--wrapper>.vxe-table--header .vxe-header--row'), {
          handle: '.vxe-header--column:not(.col--fixed)',
          onEnd: ({ item, newIndex, oldIndex }) => {
            const { fullColumn, tableColumn } = $table.getTableColumn()
            const targetThElem = item
            const wrapperElem = targetThElem.parentNode
            const newColumn = fullColumn[newIndex]
            if (newColumn.fixed) {
              // 错误的移动
              if (newIndex > oldIndex) {
                wrapperElem.insertBefore(targetThElem, wrapperElem.children[oldIndex])
              } else {
                wrapperElem.insertBefore(wrapperElem.children[oldIndex], targetThElem)
              }
              return this.message.warning(this.$i18n.tc('固定列不允许拖动'))
            }
            // 转换真实索引
            const oldColumnIndex = $table.getColumnIndex(tableColumn[oldIndex])
            const newColumnIndex = $table.getColumnIndex(tableColumn[newIndex])
            // 移动到目标列
            const currRow = fullColumn.splice(oldColumnIndex, 1)[0]
            fullColumn.splice(newColumnIndex, 0, currRow)
            $table.loadColumn(fullColumn)
          }
        })
      })
    },
    setFilterInitData(type) {
      let data
      switch (type) {
      case 'label_input' || 'label_select':
        data = ''
        break
      case 'label_date' || 'label_checkbox':
        data = []
        break
      default:
        data = ''
      }
      return data
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .vxe-toolbar.size--mini{
  height: 28px;
  position: absolute;
  right: 0;
  top: -31px;
}
.table-status{
  i{
    display: inline-block;
    vertical-align: middle;
    width: 6px;
    height: 6px;
    border-radius: 100%;
    margin-right: 5px;
    margin-top: -2px;
    &.green {
        background-color: #4c9e4c;
    }
    &.blue {
        background-color: #3481e0;
    }
    &.red {
        background-color: red;
    }
    &.gray {
        background-color: #c5c4c4;
    }
    &.yellow {
        background-color: #f3a051;
    }
  }
}
.sortable-column .vxe-header--row .vxe-header--column.sortable-ghost,
.sortable-column .vxe-header--row .vxe-header--column.sortable-chosen {
  background-color: #dfecfb;
}
.sortable-column .vxe-header--row .vxe-header--column.col--fixed {
  cursor: no-drop;
}
/deep/ .vxe-table--render-default.size--mini .vxe-body--column:not(.col--ellipsis), .vxe-table--render-default.size--mini .vxe-footer--column:not(.col--ellipsis), .vxe-table--render-default.size--mini .vxe-header--column:not(.col--ellipsis) {
  padding: 2px 0;
}
/deep/ .vxe-custom--wrapper {
  .vxe-button {
    min-width: 32px;
    width: 32px;
    height: 32px;
  }
}
/deep/ .vxe-header--row .vxe-header--column.col--filter {
  padding: 2px 0;
  .el-input__inner {
    border-radius: 0
  }
}
/deep/ .vxe-table--render-default .vxe-cell {
  padding-left: 2px;
  padding-right: 2px;
}
/deep/ .vxe-header--row .vxe-header--column.col--group {
  padding: 4px 0;
}
/deep/ .vxe-header--column, /deep/ .vxe-footer--column {
  color: #333;
}

/deep/ .vxe-header--column.filter-header .vxe-cell--sort {
  position: absolute;
  top: -22px;
  right: 10px;
}
</style>
