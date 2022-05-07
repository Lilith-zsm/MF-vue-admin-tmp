<!--
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-02-07 09:47:24
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-05-07 10:04:46
-->
<template>
  <!--
  * id 唯一标识
  * column-key 是否需要为每一列的 VNode 设置 key 属性
  * row-id 自定义行数据唯一主键的字段名
  * border 是否带有边框
  * resizable 所有的列是否允许拖动列宽调整大小
  * height 表格的高度
  * size 表格的尺寸
  * loading 表格是否显示加载中
  * seq-config 序号配置项
  * column-config 列的默认参数
  * toolbar-config 工具栏配置
  * custom-config 自定义列配置项
  * checkbox-config 复选框配置项
  * scroll-y 纵向虚拟滚动配置
  * show-overflow 设置所有内容过长时显示为省略号
  * show-header-overflow 设置表头所有内容过长时显示为省略号
  * show-footer-overflow 设置表尾所有内容过长时显示为省略号
  * row-config 行配置信息
  * columns 列配置
  * data 表格数据
  * keepSource 保持原始值的状态
 -->
  <vxe-grid
    id="xGrid"
    ref="xGrid"
    class="sortable-column"
    column-key
    :row-id="rowId"
    border
    resizable
    :height="height"
    :max-height="maxHeight"
    :min-height="200"
    size="mini"
    :loading="loading"
    align="center"
    :seq-config="{
      startIndex: pageVo? (pageVo.currentPage - 1) * pageVo.pageSize : '' // 设置序号的起始值
    }"
    :header-cell-class-name="headerFilter ? 'header-column-filter' : ''"
    :keep-source="keepSource"
    :column-config="{
      isHover: true, //当鼠标移到列头时，是否要高亮当前列头
      isCurrent: true, //当鼠标点击列头时，是否要高亮当前列
      minWidth: 100 //每一列的最小宽度
    }"
    :toolbar-config="{
      custom: customStorage
    }"
    :custom-config="{
      storage: customStorage // 是否启用 localStorage 本地保存
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
    :tree-config="treeConfig"
    :filter-config="filterConfig"
    show-overflow
    show-header-overflow
    show-footer-overflow
    :show-footer="showFooter"
    :row-config="{
      isCurrent: true, // 当鼠标点击行时，是否要高亮当前行
      isHover: true // 当鼠标移到行时，是否要高亮当前行
    }"
    :edit-config="editConfig"
    :edit-rules="langRule"
    :footer-method="footerMethod"
    :columns="headerColumns"
    :data="dataSource"
    @checkbox-change="checkboxChange"
    @checkbox-all="checkboxChange"
    @current-change="currentChange"
    @toggle-tree-expand="toggleTreeExpand"
  >
    <template #pager>
      <vxe-pager
        v-if="pageVo"
        :layouts="['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total']"
        :current-page.sync="pageVo.currentPage"
        :page-size.sync="pageVo.pageSize"
        :page-sizes="[50, 100, 200, 300, 500, 1000]"
        :total="pageVo.total"
        @page-change="handlePageChange"
      />
    </template>
    <template #empty>
      <span>
        <img src="@/assets/img/no_data.png" width="100">
        <p>{{ $t('暂无数据') }}</p>
      </span>
    </template>
    <!-- 表头序号 -->
    <template #seq_header>
      <div style="cursor: pointer" @click="showHeaderFilter = !showHeaderFilter">
        <i class="vxe-icon--funnel" />
      </div>
    </template>
    <!-- 表头筛选列 -->
    <template #filter_header="{ column }">
      <div class="filter-header-title">{{ column.title }}</div>
      <div v-for="(option, index) in column.filters" v-show="showHeaderFilter" :key="index" class="filter-header-label">
        <!-- input -->
        <el-input
          v-if="column.params.filterType === 'label_input'"
          v-model="option.data"
          type="text"
          :placeholder="$t('请输入')"
          clearable
          @input="filterEvent(option)"
        />
        <!-- date -->
        <el-date-picker
          v-if="column.params.filterType === 'label_date'"
          v-model="option.data"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <!-- select -->
        <el-select
          v-if="column.params.filterType === 'label_select'"
          v-model="option.data"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="op in column.params.options"
            :key="op.value"
            :label="$t(op.label)"
            :value="op.value"
          />
        </el-select>
      </div>
    </template>
    <!-- 操作列 -->
    <template #operation_default="{ row,column }">
      <el-button
        v-for="item in column.params"
        :key="item.title"
        v-hasPermi="item.hasPermi"
        :disabled="item.setDisabled ? item.setDisabled(row) : false"
        :icon="item.saveIcon && $refs.xGrid.isActiveByRow(row) ? item.saveIcon : item.icon"
        circle
        size="mini"
        style="padding: 6px 6px;"
        :title="item.saveTitle && $refs.xGrid.isActiveByRow(row) ? $t(item.saveTitle) : $t(item.title)"
        :type="item.type"
        plain
        @click="item.click ? item.click(row, $refs.xGrid.isActiveByRow(row)) : ''"
      />
    </template>
    <!-- 状态列 -->
    <template #status_default="{ row,column }">
      <span class="table-status">
        <i
          v-if="column.params && column.params.color"
          :class="column.params.color[filterStatusRows(row,column).value]"
        />
        {{ filterStatusRows(row,column).label }}
      </span>
    </template>
    <!-- 状态列 -->
    <template #switch_default="{ row,column }">
      <vxe-switch
        v-model="row[column.field]"
        :open-label="column.params ? column.params.openLabel : ''"
        :open-value="column.params ? column.params.openValue : ''"
        :close-label="column.params ? column.params.closeLabel : ''"
        :close-value="column.params ? column.params.closeValue : ''"
        :disabled="column.params ? column.params.disabled : false"
        @change="column.params ? column.params.change($event, row) : ''"
      />
    </template>
    <!-- 编辑 -->
    <template #input_edit="{ row, column }">
      <vxe-input v-model="row[column.field]" :type="column.params && column.params.type ? column.params.type: ''" />
    </template>
    <template #select_edit="{ row, column }">
      <vxe-select v-model="row[column.field]">
        <vxe-option
          v-for="item in column.params.options"
          :key="item[column.params.key]"
          :value="item[column.params.value]"
          :label="item[column.params.label]"
        />
      </vxe-select>
    </template>
  </vxe-grid>
</template>
<script>
import Sortable from 'sortablejs'
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
    filterConfig: {
      type: Object,
      default() {
        return {
          remote: true
        }
      }
    },
    rowId: {
      type: String,
      default: 'id'
    },
    keepSource: {
      type: Boolean,
      default: false
    },
    tableType: {
      type: String,
      default: ''
    },
    editConfig: {
      type: Object,
      default() {
        return null
      }
    },
    editRules: {
      type: Object,
      default() {
        return {}
      }
    },
    // 是否显示自定义列
    customStorage: {
      type: Boolean,
      default: true
    },
    // 表头筛选
    headerFilter: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      height: 450,
      changePage: false,
      maxHeight: null,
      langRule: {},
      showHeaderFilter: true
    }
  },
  computed: {
    headerColumns() {
      return this.columns.map(item => {
        return {
          ...item,
          title: this.$i18n.tc(item.title)
        }
      })
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
  mounted() {
    this.getLangRule()
    this.setTableHeight()
    window.onresize = () => { this.setTableHeight() }
  },
  created () {
    this.columnDrop()
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
      this.$refs.xGrid.clearAll()
    },
    // 状态过滤
    filterStatusRows(row, column) {
      const data = column.filters.find(item => item.value === row[column.field])
      return data || {}
    },
    // 列拖动
    columnDrop () {
      this.$nextTick(() => {
        const $table = this.$refs.xGrid
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
    reloadTreeExpand(row) {
      this.$refs.xGrid.reloadTreeExpand(row)
    },
    remove(rows) {
      this.$refs.xGrid.remove(rows)
    },
    setCheckboxRow(rows, checked) {
      this.$refs.xGrid.setCheckboxRow(rows, checked)
    },
    clearCheckboxRow() {
      this.$refs.xGrid.clearCheckboxRow()
    },
    editRowEvent (row) {
      const $grid = this.$refs.xGrid
      $grid.setActiveRow(row)
    },
    saveRowEvent () {
      const $grid = this.$refs.xGrid
      $grid.clearActived()
    },
    filterEvent (option) {
      const xGrid = this.$refs.xGrid
      // 设置为选中状态
      option.checked = true
      // 修改条件之后，需要手动调用 updateData 处理表格数据
      xGrid.updateData()
    },
    // 校验规则多语言处理
    getLangRule() {
      const ruleObj = {}
      if (this.editRules) {
        Object.keys(this.editRules).forEach((key) => {
          let obj
          if (this.editRules[key] instanceof Array) {
            obj = this.editRules[key].map(it => ({
              ...it,
              message: it.message ? this.$i18n.tc(it.message) : ''
            }))
          } else {
            obj = {
              ...this.editRules[key],
              message: this.editRules[key].message ? this.$i18n.tc(this.editRules[key].message) : ''
            }
          }
          ruleObj[key] = obj
        })
        this.langRule = ruleObj
      }
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
/deep/ .vxe-table--render-default.size--mini .vxe-body--column.col--ellipsis, .vxe-table--render-default.size--mini .vxe-footer--column.col--ellipsis, .vxe-table--render-default.size--mini .vxe-header--column.col--ellipsis, .vxe-table--render-default.vxe-editable.size--mini .vxe-body--column{
  height: 31px !important;
}
/deep/ .vxe-header--column, /deep/ .vxe-footer--column {
  background-color: #eff3f8 !important;
  height: 34px !important;
  color: #333;
}
/deep/ .header-column-filter{
  .vxe-cell{
    max-height: inherit !important;
    padding-left: 0;
    padding-right: 0;
  }
  .vxe-cell--sort {
    position:absolute;
    right: 10px;
    top: 8px;
  }
  .filter-header-title {
    line-height: 30px;
    border-bottom: 1px solid #e8eaec;
  }
  .filter-header-label {
    padding: 2px
  }
  .el-input__inner {
    border-radius: 0
  }
}
</style>
