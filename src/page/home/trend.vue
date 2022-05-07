<template>
  <div :class="[prefixCls, reverseColor && 'reverse-color' ]">
    <span>
      <slot name="term" />
      <span :class="[flag]"><i :class="`trend-icon el-icon-caret-${flag}`" /></span>
      <span class="item-text">
        <slot />
      </span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'Trend',
  props: {
    prefixCls: {
      type: String,
      default: 'chart-trend'
    },
    /**
       * 上升下降标识：up|down
       */
    flag: {
      type: String,
      required: true
    },
    /**
       * 颜色反转
       */
    reverseColor: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
  .chart-trend {
    display: inline-block;
    font-size: 14px;
    line-height: 22px;
    .trend-icon {
      font-size: 12px;
      &.el-icon-caret-top {
        color: #f5222d;
      }
      &.el-icon-caret-bottom {
        color: #52c41a;
      }
    }
  }
</style>
