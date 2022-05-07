<template>
  <div v-if="isExternal" class="" />
  <i v-else :class="svgClass" />
</template>

<script>
import { isExternal } from '@/utils/mUtils'

export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      default: ''
    }
  },
  computed: {
    isExternal() {
      return isExternal(this.iconClass)
    },
    svgClass() {
      if (this.iconClass) {
        return 'iconfont ' + this.iconClass
      } else {
        return 'iconfont'
      }
    }
  }
}
</script>

<style lang="scss">

</style>
