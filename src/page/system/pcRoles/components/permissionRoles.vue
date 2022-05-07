
<template>
  <div class="permissionRoles">
    <el-tabs
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-for="(item,key) in treeData"
        :key="key"
        :value="item.id"
        :label="item.label"
      >
        <div class="common-box">
          <vxe-table
            border
            :height="height"
            :data="item.children"
            :loading="loading"
            :resizable="true"
          >
            <vxe-column :title="$t('模块')" width="200px" align="right" header-align="center">
              <template #default="{ row }">
                <span class="label" @click="handleClickLabel(row)">{{ row.label }}</span><vxe-checkbox v-model="row.checked" @change="changeBox($event, row)" />
              </template>
            </vxe-column>
            <vxe-column :title="$t('菜单/按钮')">
              <template #default="{ row }">
                <div v-for="i in row.children" :key="i.id" class="box-column-label" :class="{'noChild': !i.children}">
                  <div class="box-column-menu">
                    <vxe-checkbox v-model="i.checked" :content="i.label" :indeterminate="i.indeterminate" @change="changeBox($event, i)" />
                  </div>
                  <div v-if="i.children" class="box-column-btn">
                    <vxe-checkbox v-for="btn in i.children" :key="btn.id" v-model="btn.checked" :content="btn.label" style="margin: 5px 10px;" @change="changeBox($event, btn)" />
                  </div>
                </div>
              </template>
            </vxe-column>
          </vxe-table>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="box_card_footer">
      <el-button
        type="primary"
        :loading="saveLoading"
        @click="handleSubmit"
      >保 存</el-button>
      <el-button @click="handleCancel">返 回</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    params: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      treeData: [],
      height: 400,
      loading: false,
      ids: [],
      saveLoading: false
    }
  },
  created() {
    this.getRolesTree()
  },
  mounted() {
    this.$nextTick(() => {
      this.height = this.$Utils.setTableHeight(100)
    })
  },
  methods: {
    async getRolesTree() {
      this.loading = true
      try {
        const { data } = await this.$api.system.role.getTree(this.params)
        this.checkedKeys = data.checkedKeys
        this.treeData = data.menus
        this.setMenusSelected(this.treeData)
        for (let i = 0; i < 2; i++) {
          this.checkedParentBox(this.treeData)
        }
        this.loading = false
      } catch {
        this.loading = false
      }
    },
    handleClick() {

    },
    async handleSubmit() {
      const params = {
        menuIds: this.getSelectedId(this.treeData),
        roleId: this.params.roleId
      }
      this.saveLoading = true
      try {
        await this.$api.system.role.addEditRole(params, true)
        this.message.success('操作成功')
        this.handleCancel()
        this.saveLoading = false
      } finally {
        this.saveLoading = false
      }
    },
    handleCancel() {
      this.$emit('roleFuncSubmit')
    },
    setMenusSelected(data) {
      if (!this.checkedKeys) return
      data.forEach(item => {
        if (this.checkedKeys.includes(Number(item.id))) {
          this.$set(item, 'checked', true)
        }
        if (item.children) {
          this.setMenusSelected(item.children)
        }
      })
    },
    checkedParentBox(data) {
      data.forEach(item => {
        if (item.children) {
          const checkedChild = item.children.filter(i => i.checked)
          if (checkedChild.length === 0) {
            this.$set(item, 'checked', false)
          } else {
            this.$set(item, 'checked', true)
          }
          this.checkedParentBox(item.children)
        }
      })
    },
    changeBox({ value }, row) {
      if (row.children) {
        row.children.forEach(item => {
          this.$set(item, 'checked', value)
          this.changeBox({ value }, item)
        })
      }
      this.checkedParentBox(this.treeData)
    },
    getSelectedId(data) {
      data.forEach(item => {
        if (item.checked) {
          this.ids.push(item.id)
        }
        if (item.children) {
          this.getSelectedId(item.children)
        }
      })
      return this.ids
    },
    handleClickLabel(row) {
      this.$set(row, 'checked', !row.checked)
      this.changeBox({ value: row.checked }, row)
    }
  }
}
</script>
<style lang="scss" scoped>
.box-column-label {
  border-bottom: 1px solid #e8eaec;
  padding: 5px 0 10px;
  position: relative;
  &::before{
    content: '';
    display: block;
    position: absolute;
    top: -1px;
    height: 1px;
    background-color: #e8eaec;
    width: 100%;
  }
  > div {
    display: inline-block;
    vertical-align: middle;
  }
  .box-column-menu {
    width: 15%;
  }
  .box-column-btn {
    width: 80%;
    border-left: 1px solid #e8eaec;
    padding-left: 3%;
  }
  &:last-child {
    border: 0
  }
  &:first-child {
    &::before{
      height: 0;
    }
  }
  &.noChild {
    display: inline-block;
    vertical-align: middle;
    border: 0;
    margin-right: 20px;
    .box-column-menu {
      width: auto;
      border: 0;
    }
    &::before{
      height: 0;
    }
  }
}
.permissionRoles {
  background-color: #ffffff;
}
.box_card_footer {
  height: 40px;
  text-align: center;
  padding-top: 10px;
  background-color: #ffffff;
}
/deep/ .vxe-header--column {
  background-color: #eff3f8 !important;
  padding: 6px 0 !important;
  color: #333;
}
/deep/ .vxe-body--column {
  padding: 6px 0 !important;
}
/deep/ .vxe-checkbox--label {
  color: #606266 !important;
}
.label {
    margin-right: 10px;
    cursor: pointer;
    vertical-align: middle;
  }
</style>
