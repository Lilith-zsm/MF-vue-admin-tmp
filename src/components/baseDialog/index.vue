<template>
  <div>
    <el-dialog
      ref="dialog"
      v-dialogDrag
      :title="$t(title)"
      :visible.sync="innerVisible"
      :width="width"
      top="0px"
      :fullscreen="fullscreen"
      :close-on-click-modal="false"
      :modal="false"
      class="my-dialog-body"
      :style="{'top': offsetTop(), 'left': !isCollapse ? maxLeftMenuWidth+'px' : minLeftMenuWidth +'px','height': getHeight}"
      @close="onClose"
      @open="onOpen"
    >
      <slot />
      <template slot="footer">
        <slot name="footer" />
      </template>
      <div v-show="isMinusFull" class="right-small-icon">
        <i class="el-icon-minus" @click="addMinusButton" />
        <i :class="!fullscreen ? 'el-icon-full-screen' : 'el-icon-copy-document'" @click="onFullscreen" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    visible: Boolean,
    title: {
      type: String,
      default: function() {
        return ''
      }
    },
    width: {
      type: String,
      default: function() {
        return '1000px'
      }
    },
    isMinusFull: {
      type: Boolean,
      default: function() {
        return true
      }
    },
    isFullscreen: {
      type: Boolean,
      default: function() {
        return false
      }
    }
  },
  data() {
    return {
      fullscreen: false,
      height: 'auto',
      flag: {
        num: 0
      }
    }
  },
  computed: {
    ...mapGetters(['isCollapse', 'minLeftMenuWidth', 'maxLeftMenuWidth']),
    innerVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },
    minusButton() {
      return this.$store.state.minusButton.buttonList
    },
    getHeight() {
      const obj = this.minusButton.find(item => item.label === this.title)
      return !obj ? 'auto' : obj.open ? 'auto' : 0
    }
  },
  watch: {
    minusButton: {
      handler(val) {
        const index = val.findIndex(item => item.label === this.title)
        if (index < 0) {
          this.innerVisible = false
        }
      },
      deep: true
    }
  },
  destroyed() {
    this.$store.dispatch('delMinusButton', this.title)
  },
  mounted() {
    this.fullscreen = this.isFullscreen
  },
  methods: {
    addMinusButton() {
      const obj = {
        route: this.$route.name,
        label: this.title
      }
      this.flag.title = this.title
      this.$store.dispatch('addMinusButton', obj)
      this.$store.dispatch('closeMiunsDialog', obj)
    },
    // 打开全屏
    onFullscreen() {
      this.fullscreen = !this.fullscreen
      this.$emit('handleFullScreen', this.fullscreen)
    },
    onClose() {
      this.$store.dispatch('delMinusButton', this.title)
      this.$emit('close', true)
    },
    onOpen() {
      this.$emit('onOpen')
    },
    offsetTop() {
      const commonHeader =
      document.querySelector('#common-header')
        ? document.querySelector('#common-header').clientHeight
        : 0
      return (commonHeader + 32) + 'px'
    }
  }
}
</script>
<style lang="scss" scoped>
.my-dialog-body {
  display: flex;
  align-items: center;
  overflow: hidden;
  transition: all 0.3s ease 0s;
  /deep/ .el-dialog{
    .el-dialog__body {
      padding: 5px 10px 10px;
      overflow-y: auto;
      max-height: calc(100vh - 220px);
      &::-webkit-scrollbar{
        width:5px;
        background-color:transparent;
      }
      &::-webkit-scrollbar-thumb{
          background:#ddd;
      }
    }
    &.is-fullscreen {
      .el-dialog__body {
        max-height: calc(100vh - 140px);
      }
    }
  }
  &::after {
    content: '';
    display: block;
    position:absolute;
    width: 100%;
    height: 100%;
    background-color: rgba($color: #000000, $alpha: 0.4);
    left: 0;
    top: 0;
    z-index: -1;
  }
  .right-small-icon {
    position: absolute;
    top: 10px;
    right: 42px;
    color: #fff;
    font-size: 20px;
    i {
      margin: 0 10px;
      cursor: pointer;
    }
  }
}
</style>
