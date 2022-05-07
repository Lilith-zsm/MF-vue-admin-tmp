<!--
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-03-23 16:11:22
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-03-23 16:30:30
-->
<template>
  <div class="my-filter-input">
    <div class="my-fc-name">
      <vxe-input v-model="option.data.name" :type="option.data.type" :placeholder="$t('请输入')" />
    </div>
    <div class="my-fc-footer">
      <vxe-button status="primary" @click="confirmEvent">{{ $t('确认') }}</vxe-button>
      <vxe-button @click="resetEvent">{{ $t('重置') }}</vxe-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterInput',
  props: {
    params: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      size: 'mini', // 被所有子组件继承 size
      column: null,
      option: null
    }
  },
  created () {
    this.load()
  },
  methods: {
    load () {
      const { column } = this.params
      const option = column.filters[0]
      this.column = column
      this.option = option
    },
    confirmEvent () {
      const { column } = this.params
      column.params.handleSearch(this.option.data.name)
    },
    resetEvent () {
      const { column } = this.params
      this.option.data.name = null
      column.params.handleSearch(this.option.data.name)
    }
  }
}
</script>

<style scoped>
.my-filter-input {
  width: 260px;
  padding: 5px 15px 10px 15px;
}
.my-filter-input .my-fc-type {
  padding: 8px 0;
}
.my-filter-input .my-fc-footer {
  text-align: center;
  margin-top: 5px;
}
</style>
