<!--
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2021-12-30 16:06:04
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-03-10 16:32:31
-->
<template>
  <div class="common-wrap">
    <condition-form
      ref="conditionForm"
      v-model="searchForm"
      :form-data="formData"
      @handleSearch="getData"
    />
    <div class="common-box">
      <div class="con-button-rows">
        <el-button v-hasPermi="['system:appMenu:add']" type="success" icon="el-icon-plus" @click="handleAdd">{{ $t('新增') }}</el-button>
      </div>
      <m-table
        ref="commonTable"
        :data-source="dataSource"
        :loading="tableLoading"
        :tree-config="{
          transform: true,
          rowField: 'menuId',
          parentField: 'parentId'
        }"
        :columns="columns"
      />
    </div>
    <!-- 新增/编辑弹框 -->
    <add-edit
      v-if="addEditVisible"
      :visible.sync="addEditVisible"
      :type="type"
      :t-type="tType"
      :current-menu="currentMenu"
      @finish="handleFinish"
    />
  </div>
</template>
<script>
import addEdit from './addEdit'
export default {
  components: {
    addEdit
  },
  data() {
    return {
      dataSource: [],
      searchForm: {},
      formData: [
        {
          type: 'label_input',
          label: '菜单名称',
          prop: 'menuName'
        },
        {
          type: 'label_select',
          label: '菜单状态',
          prop: 'status',
          options: [
            { value: '1', label: '停用' },
            { value: '0', label: '启用' }
          ]
        }
      ],
      tableLoading: false,
      // 初始化表格
      columns: [
        {
          field: 'menuName',
          title: '菜单名称',
          treeNode: true
        },
        {
          field: 'perms',
          title: '权限标识'
        },
        {
          field: 'path',
          title: '路由名称'
        },
        {
          field: 'menuType',
          title: '类型',
          filters: [
            { label: this.$i18n.tc('目录'), value: 'M' },
            { label: this.$i18n.tc('菜单'), value: 'C' },
            { label: this.$i18n.tc('按钮'), value: 'F' }
          ],
          slots: { default: 'status_default' },
          params: {
            color: {
              'M': 'green',
              'C': 'yellow',
              'F': 'gray'
            }
          }
        },
        {
          field: 'icon',
          title: '图标',
          slots: {
            default: ({ row }) => {
              return [
                <svg-icon
                  style='font-size:18px;'
                  icon-class={row.icon}
                />
              ]
            }
          }
        },
        {
          field: 'orderNum',
          title: '排序'
        },
        {
          field: 'status',
          title: '状态',
          slots: {
            default: ({ row }) => {
              return [
                <el-switch
                  v-model={row.status}
                  active-color='#13ce66'
                  inactive-color='#ff4949'
                  active-value='0'
                  inactive-value='1'
                  disabled={!this.$Utils.hasPermi(['system:menu:edit'])}
                />
              ]
            }
          }
        },
        {
          field: 'siteRankName',
          title: '机构级别'
        },
        {
          field: 'createTime',
          title: '创建时间'
        },
        {
          title: '操作',
          field: 'operation',
          width: 150,
          slots: { default: 'operation_default' },
          params: [
            {
              title: '新增',
              type: 'success',
              icon: 'el-icon-plus',
              hasPermi: 'system:appMenu:add',
              click: (row) => {
                this.handleAdd(row)
              }
            },
            {
              title: '修改',
              type: 'primary',
              icon: 'el-icon-edit',
              hasPermi: 'system:appMenu:edit',
              click: (row) => {
                this.handleEdit(row)
              }
            },
            {
              title: '删除',
              type: 'danger',
              icon: 'el-icon-delete',
              loading: false,
              hasPermi: 'system:appMenu:delete',
              click: (row, item) => {
                this.handleDelete(row, item)
              }
            }
          ]
        }
      ],
      multipleSelection: [],
      addEditVisible: false,
      tType: 2, // 类型：1-PC，2-APP,3-VIP
      type: 'add',
      currentMenu: {}
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      if (!this.$Utils.hasPermi(['system:menu:list'])) {
        this.message.warning(this.$i18n.tc('您没有查看列表的权限！'))
        return
      }
      const res = {
        type: this.tType,
        ...this.searchForm
      }
      this.tableLoading = true
      try {
        const { data } = await this.$api.system.menu.list(res)
        this.dataSource = data
        // this.dataSource = this.$Utils.handleTree(data, 'menuId')
      } finally {
        this.tableLoading = false
      }
    },
    // 新增
    handleAdd(row) {
      this.addEditVisible = true
      this.type = 'add'
      this.currentMenu = row || {}
    },
    // 编辑
    handleEdit(row) {
      this.addEditVisible = true
      this.type = 'edit'
      this.currentMenu = row
    },
    // 删除
    handleDelete(row) {
      this.$confirm(this.$i18n.tc('确定删除？'), this.$i18n.tc('提示'), {
        confirmButtonText: this.$i18n.tc('确定'),
        cancelButtonText: this.$i18n.tc('取消'),
        type: 'warning'
      }).then(async () => {
        await this.$api.system.menu.remove({ menuId: row.menuId })
        this.message.success(this.$i18n.tc('删除成功'))
        this.getData()
      }).catch(() => {})
    },
    // 保存/修改完成
    handleFinish(val) {
      if (this.type === 'add') {
        this.loadChildrenMethod({ ...this.currentMenu })
      } else {
        console.log(val)
        this.$set(this.currentMenu, 'perms', val.perms)
        this.$set(this.currentMenu, 'menuName', val.menuName)
        this.$set(this.currentMenu, 'path', val.path)
        this.$set(this.currentMenu, 'menuType', val.menuType)
        this.$set(this.currentMenu, 'icon', val.icon)
        this.$set(this.currentMenu, 'orderNum', val.orderNum)
        this.$set(this.currentMenu, 'status', val.status)
        this.$set(this.currentMenu, 'siteRankName', val.siteRankName)
      }
    }
  }
}
</script>
