<template>
  <div class="template_design">
    <div class="left">
      <el-button type="primary" @click="handlePreview()">{{ $t('预览') }}</el-button>
      <el-button type="primary" @click="handleSave()">{{ $t('保存') }}</el-button>
      <el-collapse :value="['1','2','3']">
        <el-collapse-item title="模板信息" name="1">
          <el-form ref="form" label-width="83px" label-position="right" :inline="true">
            <el-form-item
              :label="$t('模板名称')"
            >
              <el-input v-model="templateData.name" disabled style="width: 150px" />
            </el-form-item>
            <el-form-item
              :label="$t('打印尺寸')"
            >
              <el-select v-model="dragOption.size" clearable style="width: 150px" @change="handleChangeTempSize">
                <el-option v-for="(item, index) in tempSizeArr" :key="index" :label="$t(item.label)" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('宽度')"
            >
              <el-input-number v-model="dragOption.width" :disabled="!!dragOption.size" :min="10" style="width: 150px" controls-position="right" @change="handleChangeTempDrag" />
              mm
              <!-- <el-select v-model="dragOption.widthUnit" style="width: 80px">
                <el-option label="px" value="px" />
                <el-option label="mm" value="mm" />
              </el-select> -->
            </el-form-item>
            <el-form-item
              :label="$t('高度')"
            >
              <el-input-number v-model="dragOption.height" :disabled="!!dragOption.size" :min="10" style="width: 150px" controls-position="right" @change="handleChangeTempDrag" />
              mm
              <!-- <el-select v-model="dragOption.heightUnit" style="width: 80px">
                <el-option label="px" value="px" />
                <el-option label="mm" value="mm" />
              </el-select> -->
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="自定义信息" name="2">
          <el-button v-for="(item,index) in menuList" :key="index" type="primary" plain @click="handleAdd(item.type)">{{ item.name }}</el-button>
          <el-upload
            :ref="`el_upload`"
            class="uploader"
            action=""
            accept=".png,.jpg,.jpeg"
            :show-file-list="false"
            :http-request="(data)=>handlCustomRequestUpload(data)"
          >
            <el-button type="primary" plain>图片</el-button>
          </el-upload>
          <el-button type="primary" plain @click="handleAdd('printSet',{fieldCode:'printDate', fieldName:'打印日期'})"> {{ $t('打印日期') }}</el-button>
        </el-collapse-item>
        <el-collapse-item title="字段信息" name="3">
          <el-button v-for="(item,index) in fieldModuleData" :key="index" :type="item.type==='1'?'primary':'warning'" :title="item.remark" plain @click="handleAdd(item.type==='1'?'field':'table',item)">{{ item.fieldName }}</el-button>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="right">
      <div class="drag_setting">
        <div class="drag_setting_row">
          <span class="drag_setting_item">
            <span class="drag_setting_item_label">{{ $t('字号') }}</span>
            <el-input-number v-model="styleObj.fontSize" controls-position="right" :precision="0" style="width: 90px" @change="handleChangeDragSet($event,'fontSize','num')" />
          </span>
          <span class="drag_setting_item">
            <span class="drag_setting_item_label">{{ $t('字体') }}</span>
            <el-select v-model="styleObj.fontFamily" style="width: 90px" @change="handleChangeDragSet($event,'fontFamily','sel')">
              <el-option v-for="(item, index) in fontFamilyArr" :key="index" :label="$t(item.label)" :value="item.value" />
            </el-select>
          </span>
          <span class="drag_setting_item">
            <span class="drag_setting_item_label">{{ $t('间距') }}</span>
            <el-input-number v-model="styleObj.letterSpacing" controls-position="right" :precision="0" style="width: 90px" @change="handleChangeDragSet($event,'letterSpacing','num')" />
          </span>
          <span class="drag_setting_item">
            <span class="drag_setting_item_label">{{ $t('行高') }}</span>
            <el-input-number v-model="styleObj.lineHeight" controls-position="right" :precision="0" style="width: 90px" @change="handleChangeDragSet($event,'lineHeight','num')" />
          </span>
          <span class="drag_setting_item">
            <span class="drag_setting_item_label">{{ $t('颜色') }}</span>
            <el-input v-model="styleObj.color" style="width: 90px" @change="handleChangeDragSet($event,'color','str')" />
          </span>
          <span class="drag_setting_item drag_setting_Icon" @click="handleChangeDragSet(styleObj.fontWeight === 'bold'? 'normal':'bold','fontWeight','str')">
            <i class="iconfont icon-cuti" :style="{'color':`${styleObj.fontWeight === 'bold'? '#297ab3':''}`}" />
          </span>
          <span class="drag_setting_item drag_setting_Icon" @click="handleChangeDragSet(styleObj.fontStyle === 'oblique'? 'normal':'oblique','fontStyle','str')">
            <i class="iconfont icon-xieti" :style="{'color':`${styleObj.fontStyle === 'oblique'? '#297ab3':''}`}" />
          </span>
          <span class="drag_setting_item drag_setting_Icon" @click="handleChangeDragSet('left','textAlign','str')">
            <i class="iconfont icon-juzuoduiqi" :style="{'color':`${styleObj.textAlign === 'left'? '#297ab3':''}`}" />
          </span>
          <span class="drag_setting_item drag_setting_Icon" @click="handleChangeDragSet('center','textAlign','str')">
            <i class="iconfont icon-juzhongduiqi" :style="{'color':`${styleObj.textAlign === 'center'? '#297ab3':''}`}" />
          </span>
          <span class="drag_setting_item drag_setting_Icon" @click="handleChangeDragSet('right','textAlign','str')">
            <i class="iconfont icon-juyouduiqi" :style="{'color':`${styleObj.textAlign === 'right'? '#297ab3':''}`}" />
          </span>
          <el-button style="float: right" :disabled="activeIndex===-1" type="danger" @click="handleRemove($event)">{{ $t('删除') }}</el-button>
        </div>
        <div class="drag_setting_row">
          <span class="drag_setting_item_label drag_setting_module">{{ $t('边框') }}</span>
          <span class="drag_setting_item">
            <span class="drag_setting_item_label">{{ $t('样式') }}</span>
            <el-select v-model="styleObj.borderStyle" style="width: 90px" @change="handleChangeDragSet($event,'borderStyle','sel')">
              <el-option v-for="(item, index) in borderStyleArr" :key="index" :label="$t(item.label)" :value="item.value" @change="handleChangeDragSet($event,'borderStyle','str')" />
            </el-select>
          </span>
          <span class="drag_setting_item">
            <span class="drag_setting_item_label">{{ $t('宽度') }}</span>
            <el-input-number v-model="styleObj.borderWidth" controls-position="right" :precision="0" style="width: 90px" @change="handleChangeDragSet($event,'borderWidth','num')" />
          </span>
          <span v-if="activeIndex!==-1 && ['field','editable'].includes(dragData[activeIndex].type)">
            <el-divider direction="vertical" />
            <span class="drag_setting_item">
              <el-checkbox v-model="styleObj.wordBreak" true-label="break-all" false-label="normal" @change="handleChangeDragSet($event,'wordBreak','sel')">{{ $t('自动换行') }}</el-checkbox>
            </span>
          </span>
          <span v-if="activeIndex!==-1 && dragData[activeIndex].type === 'img'">
            <el-divider direction="vertical" />
            <span class="drag_setting_item">
              <el-checkbox v-model="styleObj.aspectRatio" @change="handleChangeDragSet($event,'aspectRatio','sel')">{{ $t('等比缩放') }}</el-checkbox>
            </span>
          </span>
          <span v-if="activeIndex!==-1 && dragData[activeIndex].type === 'bar_code'">
            <el-divider direction="vertical" />
            <span class="drag_setting_item_label drag_setting_module">{{ $t('条码') }}</span>
            <span class="drag_setting_item">
              <el-checkbox v-model="styleObj.displayValue" @change="handleChangeDragSet($event,'displayValue','sel')">{{ $t('显示文字') }}</el-checkbox>
            </span>
            <!-- <span class="drag_setting_item drag_setting_Icon" @click="handleChangeDragTransform('left')">
              <i class="iconfont icon-juyouduiqi" />
            </span>
            <span class="drag_setting_item drag_setting_Icon" @click="handleChangeDragTransform('right')">
              <i class="iconfont icon-juyouduiqi" />
            </span> -->
          </span>
        </div>
        <div class="drag_setting_row">
          <span class="drag_setting_item_label drag_setting_module">{{ $t('当前元素') }}</span>
          <span class="drag_setting_item">
            <span class="drag_setting_item_label">{{ $t('上边距') }}</span>
            <el-input-number v-model="styleObj.ymm" controls-position="right" :precision="0" style="width: 90px" @change="handleChangeDragSet($event,'y','num')" />
          </span>
          <span class="drag_setting_item">
            <span class="drag_setting_item_label">{{ $t('左边距') }}</span>
            <el-input-number v-model="styleObj.xmm" controls-position="right" :precision="0" style="width: 90px" @change="handleChangeDragSet($event,'x','num')" />
          </span>
          <span class="drag_setting_item">
            <span class="drag_setting_item_label">{{ $t('宽度') }}</span>
            <el-input-number v-model="styleObj.widthmm" controls-position="right" :precision="0" style="width: 90px" @change="handleChangeDragSet($event,'width','num')" />
          </span>
          <span class="drag_setting_item">
            <span class="drag_setting_item_label">{{ $t('高度') }}</span>
            <el-input-number v-model="styleObj.heightmm" controls-position="right" :precision="0" style="width: 90px" @change="handleChangeDragSet($event,'height','num')" />
          </span>
          <span v-if="activeIndex!==-1 && dragData[activeIndex].type === 'field'">
            <span class="drag_setting_item drag_setting_Icon" @click="handleChangeDragType('bar_code')">
              <i class="iconfont icon-bar-code" />
            </span>
            <span class="drag_setting_item drag_setting_Icon" @click="handleChangeDragType('qr_code')">
              <i class="iconfont icon-qrcode" />
            </span>
          </span>
        </div>
      </div>
      <div class="size_container">
        <div class="size_x">
          <ul class="size_x_list" :style="{'width':`${dragOption.width+1}${dragOption.widthUnit}`}">
            <li v-for="(value,index) in dragOption.width" :key="index" :class="{long: !((index + 1) % 5)}">
              <span v-if="(index + 1) % 10 === 0">{{ (index + 1) / 10 }}</span>
            </li>
          </ul>
          <div class="size_y">
            <ul class="size_y_list" :style="{'height':`${dragOption.height+1}${dragOption.heightUnit}`}">
              <li v-for="(value,index) in dragOption.height" :key="index" :class="{long: !((index + 1) % 5)}">
                <span v-if="(index + 1) % 10 === 0">{{ (index + 1) / 10 }}</span>
              </li>
            </ul>
            <div class="drag_resize">
              <div v-if="activeIndex!==-1" class="sizeDiv" :style="{'height':`${currentDragY}px`,'width':`${currentDragX}px`}" />
              <div v-if="activeIndex!==-1" class="sizeDiv" :style="{'height':`${currentDragY + dragData[activeIndex].h}px`,'width':`${currentDragX}px`}" />
              <drag_resize
                v-if="!isDel"
                ref="dragResize"
                :drag-data="dragData"
                :drag-option="dragOption"
                @handleDeactivated="handleDeactivated"
                @handleActivated="handleActivated"
                @handleResize="handleResize"
                @handleDrag="handleDrag"
                @handleRemove="handleRemove"
                @handleDblclick="handleDblclick"
                @handleChangeDragKeyCode="handleChangeDragKeyCode"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 绑定字段 -->
    <bindFieldDialog
      v-if="bindFieldDialogParams.visible"
      :visible.sync="bindFieldDialogParams.visible"
      :current-row="bindFieldDialogParams.currentRow"
      :field_list="bindFieldDialogParams.fieldList"
      @handleBindField="handleBindField"
    />
  </div>
</template>

<script>
import _ from 'lodash'
import bindFieldDialog from './components/bindFieldDialog.vue'
import drag_resize from './components/dragResize'
import { imageCompressor } from '@/utils/imageCompressor'
export default {
  name: 'PrintTemplateDesign',
  components: {
    drag_resize,
    bindFieldDialog
  },
  data() {
    return {
      templateData: {},
      dragOption: {
        size: 'A4',
        width: 210,
        height: 297,
        heightUnit: 'mm',
        widthUnit: 'mm'
      },
      fieldModuleData: [],
      dragData: [],
      menuList: [
        {
          name: '可编辑元素',
          type: 'editable'
        },
        {
          name: '横线',
          type: 'divider_horizontal'
        },
        {
          name: '竖线',
          type: 'divider_vertical'
        }
        // {
        //   name: '图片',
        //   type: 'img'
        // },
        // {
        //   name: '条形码',
        //   type: 'bar_code'
        // },
        // {
        //   name: '二维码',
        //   type: 'qr_code'
        // },
      ],
      fontFamilyArr: [
        { label: '微软雅黑', value: 'Microsoft YaHei' },
        // { label: '方正舒体', value: 'FZShuTi' },
        // { label: '方正姚体', value: 'FZYaoti' },
        { label: '仿宋', value: 'FangSong' },
        { label: '宋体', value: 'SimSun' },
        { label: '黑体', value: 'SimHei' },
        { label: '楷体', value: 'KaiTi' },
        { label: 'Arial', value: 'Arial' }
        // { label: '隶书', value: 'LiSu' },
        // { label: '幼圆', value: 'YouYuan' },
        // { label: '华文彩云', value: 'STCaiyun' },
        // { label: '华文仿宋', value: 'STFangsong' },
        // { label: '华文琥珀', value: 'STHupo' },
        // { label: '华文楷体', value: 'STKaiti' },
        // { label: '华文隶书', value: 'STLiti' },
        // { label: '华文宋体', value: 'STSong' },
        // { label: '华文细黑', value: 'STXihei' },
        // { label: '华文行楷', value: 'STXingkai' },
        // { label: '华文新魏', value: 'STXinwei' },
        // { label: '华文中宋', value: 'STZhongsong' }
      ],
      borderStyleArr: [
        { label: '无边框', value: 'none' },
        { label: '点状边框', value: 'dotted' },
        { label: '虚线', value: 'dashed' },
        { label: '实线', value: 'solid' },
        { label: '双线', value: 'double' }
      ],
      tempSizeArr: [
        { label: 'A4', value: 'A4' },
        { label: '标签', value: '标签' },
        { label: '条码标签', value: '条码标签' },
        { label: '自定义', value: '' }
      ],
      isDel: false,
      activeIndex: -1,
      currentDragX: 0,
      currentDragY: 0,
      x: 10,
      y: 10,
      styleObj: {},
      copyItem: null,
      bindFieldDialogParams: {
        visible: false
      }
    }
  },
  watch: {
    $route: {
      deep: true,
      handler(val, oldval) {
        this.getInfo()
      }
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.getInfo()
    }
  },
  methods: {
    initData() {
      this.templateData = {}
      this.dragOption = {
        size: 'A4',
        width: 210,
        height: 297,
        heightUnit: 'mm',
        widthUnit: 'mm'
      }
      this.fieldModuleData = []
      this.dragData = []
      this.activeIndex = -1
      this.activeIndex = -1
      this.currentDragX = 0
      this.currentDragY = 0
      this.x = 10
      this.y = 10
      this.styleObj = {}
    },
    async getInfo() {
      if (!this.$route.query.id) {
        return
      }
      this.initData()
      const res = await this.$api.common.sysSetting.printTemplate.getInfo(this.$route.query.id)
      this.templateData = res.data
      if (res.data.content) {
        const content = JSON.parse(res.data.content)
        const { elements, ...dragOption } = content
        this.dragOption = dragOption
        this.dragData = elements
      }
      const result = await this.$api.common.sysSetting.printModule.getInfo(res.data.moduleCode)
      this.fieldModuleData = result.data.fieldList
    },
    handleChangeTempSize(val) {
      switch (val) {
      case 'A4':
        this.dragOption.width = 210
        this.dragOption.height = 297
        break
      case '标签':
        this.dragOption.width = 100
        this.dragOption.height = 150
        break
      case '条码标签':
        this.dragOption.width = 80
        this.dragOption.height = 50
        break
      default:
        break
      }
    },
    handleChangeTempDrag(val) {
      this.onValid()
    },
    handleChangeDragKeyCode(e, keyCode) {
      switch (keyCode) {
      case 37:
        this.handleChangeDragSet(this.dragData[this.activeIndex].x - 1, 'x', 'num')
        e.preventDefault()
        break
      case 38:
        this.handleChangeDragSet(this.dragData[this.activeIndex].y - 1, 'y', 'num')
        e.preventDefault()
        break
      case 39:
        this.handleChangeDragSet(this.dragData[this.activeIndex].x + 1, 'x', 'num')
        e.preventDefault()
        break
      case 40:
        this.handleChangeDragSet(this.dragData[this.activeIndex].y + 1, 'y', 'num')
        e.preventDefault()
        break
      case 83:
        if (e.ctrlKey) {
          this.handleSave()
          e.preventDefault()
        }
        break
      case 67:
        if (e.ctrlKey) {
          this.copyItem = null
          this.copyItem = {
            ...this.dragData[this.activeIndex],
            x: this.dragData[this.activeIndex].x + 5,
            y: this.dragData[this.activeIndex].x + 5
          }
          e.preventDefault()
        }
        break
      case 86:
        if (e.ctrlKey && this.copyItem) {
          this.dragData.push(this.copyItem)
          this.copyItem = {
            ...this.copyItem,
            x: this.copyItem.x + 5,
            y: this.copyItem.x + 5
          }
          e.preventDefault()
        }
        break
      default:

        break
      }
    },
    handleChangeDragSet(val, key, type) {
      let value = val
      let unit = ''
      if (type === 'num') {
        unit = 'px'
      }
      if (key === 'width' || key === 'height' || key === 'x' || key === 'y') {
        value = this.mm2px(value)
      }
      this.$set(this.dragData[this.activeIndex].styleObject, key, `${value}${unit}`)
      this.$set(this.dragData[this.activeIndex].styleObj, key, value)
      // if (key === 'fontSize') {
      //   if (val < 12) {
      //     this.$set(this.dragData[this.activeIndex].styleObject, 'transform', `scale(${val / 12})`)
      //     this.$set(this.dragData[this.activeIndex].styleObj, 'transform', `scale(${val / 12})`)
      //   } else {
      //     this.$set(this.dragData[this.activeIndex].styleObject, 'transform', `none`)
      //     this.$set(this.dragData[this.activeIndex].styleObj, 'transform', `none`)
      //   }
      // }
      if (key === 'width') {
        this.$set(this.dragData[this.activeIndex], 'w', value)
      } else if (key === 'height') {
        this.$set(this.dragData[this.activeIndex], 'h', value)
      } else if (key === 'x') {
        this.$set(this.dragData[this.activeIndex], 'x', value)
      } else if (key === 'y') {
        this.$set(this.dragData[this.activeIndex], 'y', value)
      } else if (key === 'aspectRatio') {
        this.$set(this.dragData[this.activeIndex], 'aspectRatio', value)
      }
      this.handleActivated(this.activeIndex)
    },
    handleChangeDragTransform(type) {
      let rotate = this.dragData[this.activeIndex].rotate || 0
      if (type === 'left') {
        rotate = rotate + 90
      } else {
        rotate = rotate - 90
      }
      // rotate = rotate / 360
      this.dragData[this.activeIndex].rotate = rotate
      this.$set(this.dragData[this.activeIndex].styleObject, 'transform', `rotate(${rotate}deg)`)
      this.$set(this.dragData[this.activeIndex].styleObj, 'transform', `rotate(${rotate}deg)`)
    },
    handleChangeDragType(type) {
      this.$set(this.dragData[this.activeIndex], 'type', type)
      if (type === 'bar_code') {
        // this.$set(this.dragData[this.activeIndex].styleObj, 'displayValue', true)
        // this.$set(this.dragData[this.activeIndex].styleObject, 'displayValue', true)
        // this.$set(this.dragData[this.activeIndex].styleObj, 'width', 167)
        // this.$set(this.dragData[this.activeIndex].styleObject, 'width', '167px')
        // this.$set(this.dragData[this.activeIndex].styleObject, 'w', 167)
        // this.handleActivated(this.activeIndex)
        const row = this.dragData[this.activeIndex]
        const activeIndex = this.activeIndex
        this.handleRemove()
        this.dragData.splice(activeIndex, 0, {
          ...row,
          w: 167,
          minw: 167,
          type: 'bar_code',
          styleObject: {
            ...row.styleObject,
            width: '167px',
            displayValue: true
          },
          styleObj: {
            ...row.styleObj,
            width: 167,
            displayValue: true
          }
        })
        this.handleActivated(activeIndex)
      }
      if (type === 'qr_code') {
        const row = this.dragData[this.activeIndex]
        const activeIndex = this.activeIndex
        this.handleRemove()
        this.dragData.splice(activeIndex, 0, {
          ...row,
          aspectRatio: true,
          w: 50,
          h: 50,
          minw: 50,
          minh: 50,
          type: 'qr_code',
          styleObject: {
            width: '50px',
            height: '50px'
          },
          styleObj: {
            x: this.x,
            y: this.y,
            width: 50,
            height: 50
          }
        })
        this.handleActivated(activeIndex)
      }
    },
    // 每当用户单击组件外部的任何位置时调用
    handleDeactivated() {
      // this.dragData = this.dragData.map((it) => {
      //   return {
      //     ...it,
      //     isActive: false
      //   }
      // })
      // this.activeIndex = -1
    },
    // 单击组件时调用
    handleActivated(index) {
      this.dragData = this.dragData.map((it, i) => {
        return {
          ...it,
          isActive: index === i
        }
      })
      this.activeIndex = index
      this.styleObj = { ...this.dragData[this.activeIndex].styleObj }
      this.currentDragX = this.dragData[this.activeIndex].x
      this.currentDragY = this.dragData[this.activeIndex].y
    },
    // 每当组件调整大小时调用
    handleResize(newRect) {
      this.dragData[this.activeIndex] = {
        ...this.dragData[this.activeIndex],
        w: newRect.width,
        h: newRect.height,
        x: newRect.left,
        y: newRect.top,
        styleObject: {
          ...this.dragData[this.activeIndex].styleObject,
          width: `${newRect.width}px`,
          height: `${newRect.height}px`
        },
        styleObj: {
          ...this.dragData[this.activeIndex].styleObj,
          width: newRect.width,
          height: newRect.height,
          x: newRect.left,
          y: newRect.top,
          widthmm: this.px2mm(newRect.width),
          heightmm: this.px2mm(newRect.height),
          xmm: this.px2mm(newRect.left),
          ymm: this.px2mm(newRect.top)
        }
      }
      this.handleActivated(this.activeIndex)
      this.currentDragX = newRect.left
      this.currentDragY = newRect.top
      // this.onValid()
    },
    // 拖拽时调用
    handleDrag(newRect) {
      this.handleResize(newRect)
    },
    // 新增一个元素
    handleAdd(type, item) {
      this.x = this.x + 5
      this.y = this.y + 5
      switch (type) {
      case 'field':
      case 'printSet':
      {
        this.dragData.push({
          parentLimitation: true,
          isActive: false,
          w: 100,
          h: 20,
          minw: 15,
          minh: 15,
          x: this.x,
          y: this.y,
          type: type,
          fieldCode: item.fieldCode,
          fieldName: item.fieldName,
          styleObject: {
            width: '100px',
            height: '20px',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: '#efefef',
            resize: 'none',
            outline: 'none',
            fontSize: '12px',
            fontFamily: 'Arial',
            letterSpacing: 0,
            lineHeight: '17px'
          },
          styleObj: {
            width: 100,
            height: 20,
            borderWidth: 1,
            borderStyle: 'solid',
            fontSize: 12,
            fontFamily: 'Arial',
            letterSpacing: 0,
            lineHeight: 17,
            x: this.x,
            y: this.y
          }
        })
        break
      }
      case 'editable': {
        this.dragData.push({
          parentLimitation: true,
          isActive: false,
          w: 100,
          h: 20,
          minw: 15,
          minh: 15,
          x: this.x,
          y: this.y,
          type: 'editable',
          placeholder: '请输入',
          value: '',
          styleObject: {
            width: '100px',
            height: '20px',
            padding: 0,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: '#efefef',
            resize: 'none',
            outline: 'none',
            fontSize: '12px',
            fontFamily: 'Arial',
            letterSpacing: 0,
            lineHeight: '17px'
          },
          styleObj: {
            width: 100,
            height: 20,
            padding: 0,
            borderWidth: 1,
            borderStyle: 'solid',
            fontSize: 12,
            fontFamily: 'Arial',
            letterSpacing: 0,
            lineHeight: 17,
            x: this.x,
            y: this.y
          }
        })
        break
      }
      case 'divider_horizontal': {
        this.dragData.push({
          parentLimitation: true,
          isActive: false,
          sticks: ['ml', 'mr'],
          w: 100,
          h: 1,
          minw: 10,
          minh: 1,
          x: this.x,
          y: this.y,
          type: 'divider_horizontal',
          styleObject: {
            width: '100px',
            height: '1px',
            background: '#333333'
          },
          styleObj: {
            x: this.x,
            y: this.y,
            width: 100,
            height: 1
          }
        })
        break
      }
      case 'divider_vertical': {
        this.dragData.push({
          parentLimitation: true,
          isActive: false,
          w: 1,
          h: 100,
          minw: 1,
          minh: 10,
          x: this.x,
          y: this.y,
          sticks: ['tm', 'bm'],
          type: 'divider_vertical',
          styleObject: {
            width: '1px',
            height: '100px',
            background: '#333333'
          },
          styleObj: {
            x: this.x,
            y: this.y,
            width: 1,
            height: 100
          }
        })
        break
      }
      case 'qr_code': {
        this.dragData.push({
          parentLimitation: true,
          isActive: false,
          aspectRatio: true,
          w: 50,
          h: 50,
          minw: 50,
          minh: 50,
          x: this.x,
          y: this.y,
          type: 'qr_code',
          styleObject: {
            width: '50px',
            height: '50px'
          },
          styleObj: {
            x: this.x,
            y: this.y,
            width: 50,
            height: 50
          }
        })
        break
      }
      case 'bar_code': {
        this.dragData.push({
          parentLimitation: true,
          isActive: false,
          w: 150,
          h: 40,
          minw: 100,
          minh: 20,
          x: this.x,
          y: this.y,
          value: '1234567890',
          type: 'bar_code',
          text: '',
          rotate: 0,
          styleObject: {
            width: '150px',
            height: '40px',
            fontSize: '12px',
            fontFamily: 'Arial',
            fontWeight: 'normal',
            fontStyle: 'normal',
            textAlign: 'center',
            displayValue: true
          },
          styleObj: {
            x: this.x,
            y: this.y,
            width: 150,
            height: 40,
            fontSize: 12,
            fontFamily: 'Arial',
            fontWeight: 'normal',
            fontStyle: 'normal',
            textAlign: 'center',
            displayValue: true
          }
        })
        break
      }
      case 'img': {
        this.dragData.push({
          parentLimitation: true,
          aspectRatio: true,
          isActive: false,
          w: item.width,
          h: item.height,
          // minw: 50,
          // minh: 50,
          x: this.x,
          y: this.y,
          type: 'img',
          base64: item.base64,
          styleObject: {
            width: `${item.width}px`,
            height: `${item.height}px`
          },
          styleObj: {
            x: this.x,
            y: this.y,
            width: item.width,
            height: item.height,
            aspectRatio: true
          }
        })
        break
      }
      case 'table': {
        const fieldList = item.fieldList.map(it => ({ fieldCode: it.fieldCode, fieldName: it.fieldName }))
        this.dragData.push({
          // sticks: ['ml', 'mr'],
          parentLimitation: true,
          isActive: false,
          w: 635,
          h: 35,
          minw: 50,
          minh: 35,
          x: this.x,
          y: this.y,
          type: 'table',
          styleObject: {
            borderCollapse: 'collapse',
            bordeSpacing: '0px',
            width: '635px',
            height: '45px',
            borderWidth: '1px',
            borderStyle: 'solid',
            fontSize: '12px',
            fontFamily: 'Arial',
            textAlign: 'center'
          },
          styleObj: {
            x: this.x,
            y: this.y,
            width: 635,
            height: 45,
            borderWidth: 1,
            borderStyle: 'solid',
            fontSize: 12,
            fontFamily: 'Arial',
            textAlign: 'center'
          },
          fieldCode: item.fieldCode,
          fieldName: item.fieldName,
          fieldList: fieldList
        })
        break
      }
      default: {
        break
      }
      }
      const { styleObj } = this.dragData[this.dragData.length - 1]
      this.dragData[this.dragData.length - 1].styleObj = {
        ...styleObj,
        widthmm: this.px2mm(styleObj.width),
        heightmm: this.px2mm(styleObj.height),
        xmm: this.px2mm(styleObj.x),
        ymm: this.px2mm(styleObj.y)
      }
      this.activeIndex = this.dragData.length - 1
      this.handleActivated(this.activeIndex)
    },
    // 删除
    handleRemove() {
      if (this.activeIndex !== -1) {
        this.dragData[this.activeIndex].isActive = false
        this.dragData.splice(this.activeIndex, 1)
        this.styleObj = {}
        this.currentDragX = 0
        this.currentDragY = 0
        this.activeIndex = -1
        this.isDel = true
        this.$nextTick(() => {
          this.isDel = false
        })
      }
    },
    // 图片
    handlCustomRequestUpload(data) {
      // const reader = new FileReader()
      // let imgFile
      // reader.readAsDataURL(data.file)
      // reader.onload = e => {
      //   imgFile = e.target.result
      //   const arr = imgFile.split(',')
      //   this.handleAdd('img', { base64: `${arr[0]},${arr[1]}` })
      // }
      console.log(data)
      imageCompressor(data.file, (base64url, blobData) => {
        const img = new Image()
        img.src = base64url
        img.onload = () => {
          this.handleAdd('img', { base64: base64url, height: img.height, width: img.width })
        }
      })
    },
    // 双击
    handleDblclick(index) {
      this.handleActivated(index)
      const fieldList = _.cloneDeep(this.fieldModuleData.find(it => it.fieldCode === this.dragData[index].fieldCode).fieldList)
      this.bindFieldDialogParams = {
        visible: true,
        currentRow: {
          ...this.dragData[index]
        },
        fieldList: fieldList
      }
    },
    // 绑定字段
    handleBindField(curRow) {
      this.dragData[this.activeIndex] = { ...curRow }
      this.handleActivated(this.activeIndex)
    },
    // 校验
    onValid() {
      let isValid = true
      this.dragData.forEach(item => {
        if ((this.px2mm(item.x + item.w - 1) > this.dragOption.width) || this.px2mm(item.y + item.h - 1) > this.dragOption.height) {
          item.error = true
          isValid = false
        } else {
          item.error = false
        }
      })
      return isValid
    },
    // 保存
    async handleSave(type = 'save') {
      if (!this.onValid()) {
        this.message.warning(this.$i18n.tc('请校验数据'))
        return
      }
      const params = {
        id: this.$route.query.id,
        ...this.templateData,
        version: null,
        content: JSON.stringify({
          ...this.dragOption,
          dpi: this.getDPI(),
          elements: this.dragData
        })
      }
      this.loading = true
      try {
        await this.$api.common.sysSetting.printTemplate.edit(params)
        this.message.success(this.$i18n.tc('保存成功'))
        this.$emit('onSubmit')
        this.loading = false
        if (type === 'preview') {
          this.$router.push({
            name: 'PrintTemplatePreview',
            query: { code: this.templateData.code }
          })
        }
      } catch {
        this.loading = false
      }
    },
    // 获取dpi
    getDPI() {
      let dpi = ''
      if (window.screen.deviceXDPI !== undefined) {
        dpi = window.screen.deviceXDPI
      } else {
        const tmpNode = document.createElement('DIV')
        tmpNode.style.cssText = 'width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden'
        document.body.appendChild(tmpNode)
        dpi = parseInt(tmpNode.offsetWidth)
        tmpNode.parentNode.removeChild(tmpNode)
      }
      return dpi
    },
    // px 转换为 mm
    px2mm(value) {
      const inch = value / this.getDPI()
      return inch * 25.4
    },
    // mm 转换为 px
    mm2px(value) {
      const inch = value * this.getDPI()
      return inch / 25.4
    },
    // 预览
    handlePreview() {
      this.handleSave('preview')
    }
  }
}
</script>

<style  lang="scss" scoped>
.template_design {
  margin: 10px;
  padding: 10px;
  background: #fff;
  .left{
    width: 380px;
    height: 100%;
    max-height: calc(100vh - 115px);
    overflow: auto;
    float: left;
    /deep/.el-input-number .el-input__inner{
      text-align: left;
    }
    /deep/.el-collapse-item{
      margin: 10px 0 0;
    }
    /deep/.el-collapse-item__header{
      height: 38px;
      line-height: 38px;
      padding: 0 10px;
      background-color: #cccccc;
    }
    /deep/.el-collapse-item__content{
      background: #eff3f8;
      padding: 10px;
    }
    /deep/.el-collapse-item__wrap, /deep/.el-collapse{
      border: none;
      .el-button{
        margin: 0 10px 10px 0
      }
    }
    .uploader{
      display: inline-block;
    }
  }
  .right{
    margin-left: 400px;
    .drag_setting{
      background: #eff3f8;
      padding: 5px;
      font-size: 12px;
      .drag_setting_Icon{
        border: 1px solid;
        cursor: pointer;
        padding: 3px 3px 1px;
      }
      .drag_setting_item{
        margin: 0 10px 5px 0;
        display: inline-block;
      }
      .drag_setting_item_label{
        margin-right: 5px;
      }
      .drag_setting_module{
        font-weight: bold;
      }
      .el-divider--vertical{
        height: 18px;
        background-color: #333333;
      }
      /deep/.el-input-number.is-controls-right .el-input__inner{
        padding-left: 5px;
        padding-right: 35px;
        text-align: left;
      }
    }
    .size_container{
      height: calc(100vh - 225px);
      position: relative;
      background: #999999;
      overflow: auto;
      padding-left: 30px;
      .drag_resize{
        position: relative;
      }
      .sizeDiv{
        position: absolute;
        top: 0;
        left: 0;
        border-right: 1px dashed silver;
        border-bottom: 1px dashed silver;
        z-index: 1;
        pointer-events: none;
      }
      li, ul{
        list-style: none;
      }
      ul{
        padding: 0;
        margin: 0;
      }
      .size_x_list{
        margin-block-start: 0;
        background-color: #ddd;
        padding-top: 15px;
        height: 15px;
      }
      .size_x_list li{
        float: left;
        width: 1mm;
        height: 10px;
        border-right: 1px solid #000;
        font-size: 12px;
        box-sizing: border-box;
      }
      .size_x_list li.long{
        height: 15px;
      }
      .size_x_list li span{
        position: relative;
        top: -15px;
        left: -5mm;
        padding-left: 5px;
        width: 10mm;
        display: inline-block;
        text-align: center;
      }
      .size_y_list{
        position: absolute;
        left: 0;
        background-color: #ddd;
        padding-left: 15px;
      }
      .size_y_list li{
        height: 1mm;
        width: 10px;
        border-bottom: 1px solid #000;
        font-size: 12px;
        box-sizing: border-box;
      }
      .size_y_list li.long{
        width: 15px;
      }
      .size_y_list li span{
        position: relative;
        left: -15px;
        top: -2mm;
        padding-top: 5px;
        height: 10mm;
        display: inline-block;
        text-align: center;
      }
    }
  }
  .btn{
    margin: 20px 0 0;
  }
}
</style>
