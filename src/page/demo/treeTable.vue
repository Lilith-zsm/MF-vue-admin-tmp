<!--
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2021-12-30 16:06:04
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-03-11 17:36:00
-->
<template>
  <div class="common-wrap">
    <div class="common-box">
      <div class="con-button-rows">
        <el-button type="success">树形表格</el-button>
      </div>
      <m-table
        ref="commonTable"
        row-id="menuId"
        :data-source="dataSource"
        :loading="tableLoading"
        :tree-config="{
          children: 'children',
          lazy: true,
          hasChild: 'hasChild',
          loadMethod: loadChildrenMethod,
          expandRowKeys: expandRowKeys
        }"
        :columns="columns"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: 'TreeTable',
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
          slots: { default: 'switch_default' },
          params: {
            openValue: '0',
            closeValue: '1',
            disabled: !this.$Utils.hasPermi(['system:menu:edit']),
            change: ({ value }, row) => {
              this.handleChangeStatus(row, value)
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
              hasPermi: 'system:menu:add'
            },
            {
              title: '修改',
              type: 'primary',
              icon: 'el-icon-edit',
              hasPermi: 'system:menu:edit'
            },
            {
              title: '删除',
              type: 'danger',
              icon: 'el-icon-delete',
              hasPermi: 'system:menu:delete'
            }
          ]
        }
      ],
      multipleSelection: [],
      addEditVisible: false,
      tType: 1, // 类型：1-PC，2-APP,3-VIP
      type: 'add',
      currentMenu: {},
      expandRowKeys: []
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
        isParentRecursion: 1,
        parentId: 0,
        ...this.searchForm
      }
      this.tableLoading = true
      try {
        const { data } = await this.$api.system.menu.list(res)
        this.dataSource = data.map((item, index) => {
          return {
            ...item,
            hasChild: true
          }
        })
      } finally {
        this.tableLoading = false
      }
    },
    loadChildrenMethod({ row }) {
      // 异步加载子节点
      return new Promise(async resolve => {
        const { data } = await this.$api.system.menu.listByParentId(row.menuId)
        if (!data || data.length === 0) {
          this.$set(row, 'hasChild', false)
        }
        const childs = data.map(item => {
          return {
            ...item,
            hasChild: row.menuType === 'M'
          }
        })
        resolve(childs)
      })
    }
  }
}
</script>
