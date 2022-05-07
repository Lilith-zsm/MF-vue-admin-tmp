<!--
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2021-12-30 16:06:04
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-03-05 17:29:55
-->
<template>
  <div class="minusButton">
    <span
      v-for="item in minusButton"
      v-show="item.route === $route.name && !item.open"
      :key="item.label"
      @click="openMiunsDialog(item)"
    >
      <i class="el-icon-close" style="margin-right: 10px" @click.stop="onClose(item.label)" />{{ item.label }}
    </span>
  </div>
</template>
<script>
export default {
  data() {
    return {

    }
  },
  computed: {
    minusButton() {
      return this.$store.state.minusButton.buttonList
    }
  },
  methods: {
    openMiunsDialog(item) {
      this.$store.dispatch('openMiunsDialog', item.label)
    },
    onClose(btn) {
      this.$store.dispatch('delMinusButton', btn)
    }
  }
}
</script>
<style lang="scss" scoped>
.minusButton {
  position: absolute;
  bottom: -12px;
  left: 0px;
  z-index: 500;
  cursor: pointer;
  span {
    padding: 8px 15px;
    box-shadow: 0px 0px 8px #ccc;
    background-color: #fff;
    font-size: 14px;
    border: 1px solid #ccc;
  }
}
</style>
