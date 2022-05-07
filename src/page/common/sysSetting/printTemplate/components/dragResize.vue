<template>
  <div class="">
    <div ref="Templates_A" :style="{'width':`${dragOption.width}${dragOption.widthUnit}`,'height':`${dragOption.height}${dragOption.heightUnit}`,'position': 'relative','background':'#ffffff'}">
      <vue-drag-resize
        v-for="(item,index) in dragData"
        :key="index"
        :prevent-active-behavior="false"
        :parent-limitation="item.parentLimitation"
        :aspect-ratio="item.aspectRatio"
        :sticks="item.sticks"
        :is-active="item.isActive"
        :w="item.w"
        :h="item.h"
        :minw="item.minw"
        :minh="item.minh"
        :x="item.x"
        :y="item.y"
        @deactivated="onDeactivated"
        @activated="onAactivated(item,index)"
        @resizing="onResize"
        @resizestop="onResize"
        @dragging="onDrage"
        @dragstop="onDrage"
      >
        <div>
          <i v-if="item.error" class="iconfont icon-jinggao" />
          <!-- 元素删除 -->
          <!-- <i
          v-if="item.isActive"
          class="el-icon-circle-close"
          style="
						position: absolute;
						right: 4px;
						top: -9px;
						font-size: 18px;
						color: #409EFF;
						z-index: 1;
						background: #ffffff;
						border-radius: 50%;
					"
          @click="onRemove"
        /> -->
          <!-- 自定义元素 -->
          <textarea
            v-if="item.type === 'editable'"
            :ref="`editable${index}`"
            v-model="item.value"
            autosize
            resize="none"
            :placeholder="$t('点击编辑')"
            :style="{...item.styleObject, overflow: 'hidden'}"
          />
          <!-- 自定义元素 -->
          <div
            v-if="item.type === 'field' || item.type === 'printSet'"
            :ref="`drag${index}`"
            :style="item.styleObject"
            @dblclick="onDblclickField(item,index)"
          >{{ item.fieldName }}</div>
          <!-- 线 -->
          <div
            v-if="item.type === 'divider_horizontal' || item.type === 'divider_vertical'"
            :style="item.styleObject"
          />
          <!-- 二维码 -->
          <div
            v-if="item.type === 'qr_code'"
            :style="item.styleObject"
          >
            <img src="@/assets/img/qr_code.png" :style="item.styleObject">
          </div>
          <!-- 条形码 -->
          <div
            v-if="item.type === 'bar_code'"
            :style="item.styleObject"
          >
            <!-- :style="item.styleObject" -->
            <barcode
              :value="item.fieldCode || 'XXXXXX1234567890'"
              :display-value="item.styleObj.displayValue"
              :text-align="item.styleObj.textAlign"
              :margin="0"
              :height="item.styleObj.height"
              :width="1"
              :line-color="item.styleObj.color"
              :font-size="item.styleObj.fontSize"
              :font="item.styleObj.fontFamily"
              :font-options="`${item.styleObj.fontWeight} ${item.styleObj.fontStyle}`"
            />
          </div>
          <!-- 图片 -->
          <div
            v-if="item.type === 'img'"
            :style="item.styleObject"
          >
            <img :src="item.base64" :style="item.styleObject">
          </div>
          <!-- 表格 -->
          <div
            v-if="item.type === 'table'"
            @dblclick="onDblclickTable(item,index)"
          >
            <table border="0" cellpadding="0" cellspacing="0" :style="{...item.styleObject, border:'none', height:'auto'}">
              <tbody>
                <tr>
                  <td
                    v-for="(tableItem, tableIndex) in item.fieldList"
                    :key="tableIndex"
                    :style="{
                      'borderWidth':`${item.styleObject.borderWidth}`,
                      'borderStyle':`${item.styleObject.borderStyle}`,
                    }"
                    :width="`${tableItem.width}%`"
                  >
                    {{ $t(tableItem.fieldName) }}
                  </td>
                </tr>
                <tr>
                  <td
                    v-for="(tableItem, tableIndex) in item.fieldList"
                    :key="tableIndex"
                    :style="{
                      'borderWidth':`${item.styleObject.borderWidth}`,
                      'borderStyle':`${item.styleObject.borderStyle}`,
                    }"
                    :width="`${tableItem.width}%`"
                  >
                    {{ tableItem.fieldCode }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </vue-drag-resize>
    </div>
  </div>
</template>
<script>
// https://github.com/kirillmurashov/vue-drag-resize
import VueDragResize from 'vue-drag-resize'

export default {
  name: 'MsdDragResize',
  components: {
    'vue-drag-resize': VueDragResize
  },
  props: {
    dragData: {
      type: Array,
      default: () => {
        return [
          // {
          //   parentLimitation: true, // 是否超出父级元素,设置为true，则限制操作组件不能超出父级元素
          //   isActive: false, // 是否激活状态,处于激活状态的组件才能进行拖拽与缩放等操作，状态呈现激活状态
          //   w: 300, // 组件宽度
          //   h: 35, // 组件高度
          //   aspectRatio: false, // 是否等比
          //   minw: 250, // 最小宽度
          //   minh: 35, // 最小高度
          //   x: 1, // 初始X位置
          //   y: 1, // 初始Y位置
          //   type: 'editable', // 组件类型
          //   value: '' // 值
          // }
        ]
      }
    },
    // 数据列表
    dragOption: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
    }
  },
  watch: {
    dragData: {
      handler(nVal, oVal) {

      },
      deep: true
    }
  },
  mounted() {
    // 删除事件
    document.onkeydown = (e) => {
      if (window.event.keyCode === 46) {
        this.onRemove()
      } else if ([37, 38, 39, 40, 83, 67, 86].includes(window.event.keyCode)) {
        this.$emit('handleChangeDragKeyCode', e, window.event.keyCode)
      }
    }
  },
  methods: {
    // 每当用户单击组件外部的任何位置时调用
    onDeactivated() {
      this.$emit('handleDeactivated')
    },
    // 单击组件时调用
    onAactivated(item, index) {
      if (item.type === 'editable') {
        this.$refs[`editable${index}`][0].focus()
      }
      this.$emit('handleActivated', index)
    },
    // 缩放事件
    onResize(newRect) {
      this.$emit('handleResize', newRect)
    },
    // 拖拽事件
    onDrage(newRect) {
      this.$emit('handleDrag', newRect)
    },
    // 删除元素
    onRemove() {
      console.log('onRemoveonRemoveonRemove')
      this.$emit('handleRemove')
    },
    // 双击
    onDblclickTable(item, index) {
      this.$emit('handleDblclick', index)
    },
    // 字段双击复制
    onDblclickField(item, index) {
      if (window.getSelection) {
        const selection = window.getSelection()
        selection.removeAllRanges()
        var range = document.createRange()
        const dom = this.$refs[`drag${index}`][0]
        range.selectNodeContents(dom)
        selection.addRange(range)
        document.execCommand('Copy')
        selection.removeAllRanges()
        this.$message.info(this.$i18n.tc('已复制到剪切板'))
      }
    }
  }
}
</script>

<style lang="scss">
.icon-jinggao{
  position: absolute;
  right: -5px;
  top: -12px;
  font-size: 20px;
  color: red;
  z-index: 1;
}
</style>
