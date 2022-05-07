<template>
  <base-dialog title="称重协议" :visible.sync="innerVisible">
    <div>尊敬的客户：</div>
    <p>您好！请仔细阅读以下称重协议，在充分阅读并理解协议内容后，再进行确认同意。如有任何疑问的地方，可直接联系我司客服进行咨询。</p>
    <p>1、重量数据只作为参考，账单重量以美凯重量为准；</p>
    <div class="sub-btn"><el-button type="primary" @click="onConfirm">确定</el-button></div>
  </base-dialog>
</template>
<script>
export default {
  props: {
    visible: Boolean,
    initData: {
      type: Object,
      default: function() {
        return {}
      }
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
  methods: {
    onConfirm() {
      this.$emit('confirm')
    }
  }
}
</script>
<style lang="scss" scoped>
.sub-btn {
  text-align: right;
}
p {
  text-indent: 2em;
}
</style>
