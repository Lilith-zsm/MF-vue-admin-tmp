<template>
  <base-dialog width="500px" title="权限设置" :visible.sync="innerVisible" :is-minus-full="false">
    <el-tree
      ref="tree"
      node-key="id"
      show-checkbox
      :data="treeData"
      :empty-text="$t('加载中，请稍后')"
      :props="{children: 'children',label: 'label'}"
    >
      <div slot-scope="{ data }" class="custom-tree-node">
        <span>{{ data.label }}</span>
        <span style="float:right;color:#abb8d7;">{{ data.id }}</span>
      </div>
    </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="innerVisible = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" :loading="saveLoading" @click="handleSave('right')">{{ $t('确定') }}</el-button>
    </span>
  </base-dialog>
</template>
<script>
export default {
  components: {
  },
  props: {
    editData: {
      type: [String, Number],
      default: ''
    },
    visible: {
      type: Boolean
    }
  },
  data() {
    return {
      treeData: [],
      checkedKeys: [],
      saveLoading: false
    }
  },
  computed: {
    innerVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      const res = await this.$api.system.role.getTree({ roleId: this.editData, type: 2 })
      this.treeData = res.data.menus
      if (res.data.checkedKeys.length) {
        this.checkedKeys = res.data.checkedKeys
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(res.data.checkedKeys)
        })
      }
    },
    // 保存
    async handleSave() {
      this.saveLoading = true
      const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      const params = {
        menuIds: checkedKeys,
        roleId: this.editData
      }
      try {
        await this.$api.system.role.addEditRole(params, checkedKeys)
        this.message.success('操作成功')
        this.$emit('onSubmit')
      } catch {
        this.saveLoading = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-tree-node{
  width: 100%;
  padding-right: 10px;
  display: flex;
  justify-content: space-between;
}
</style>

