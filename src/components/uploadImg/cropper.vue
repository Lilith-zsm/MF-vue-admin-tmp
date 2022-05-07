<template>
  <div :class="$options.name">
    <base-dialog
      title="图片裁剪"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
    >
      <div
        class="cropper-container"
      >
        <div class="cropper-el">
          <vue-cropper
            ref="cropper"
            :img="cropperImg"
            :output-size="option.size"
            :output-type="option.outputType"
            :info="true"
            :full="option.full"
            :can-move="option.canMove"
            :can-move-box="option.canMoveBox"
            :fixed-box="option.fixedBox"
            :original="option.original"
            :auto-crop="option.autoCrop"
            :auto-crop-width="option.autoCropWidth"
            :auto-crop-height="option.autoCropHeight"
            :center-box="option.centerBox"
            :high="option.high"
            :info-true="option.infoTrue"
            :enlarge="option.enlarge"
            :fixed="option.fixed"
            :fixed-number="option.fixedNumber"
            @realTime="realTime"
          />
        </div>
        <!-- 预览 -->
        <div
          class="prive-el"
        >
          <div
            class="prive-style"
            :style="{
              'width': '605px',
              'height': '300px',
              'overflow': 'hidden',
              'margin': '0 25px',
              'display':'flex',
              'align-items' : 'center'}"
          >
            <div
              class="preview"
              :style="previews.div"
            >
              <img
                :src="previews.url"
                :style="previews.img"
              >
            </div>
          </div>
          <el-button
            v-if="option.img"
            icon="el-icon-upload2"
            @click="uploadBth"
          >{{ $t('重新上传') }}</el-button>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="handleClose"
        >{{ $t('取消') }}</el-button>
        <el-button
          type="primary"
          @click="saveImg"
        >{{ $t('确定') }}</el-button>
      </span>
    </base-dialog>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
export default {
  name: 'Cropper',
  components: {
    VueCropper
  },
  props: {
    visible: Boolean,
    imgType: {
      type: String,
      default: 'blob'
    },
    cropperImg: {
      type: String,
      default: ''
    },
    outputType: { // 裁剪生成图片的格式 默认jpg
      type: String,
      default: 'jpg'
    },
    autoCropWidth: { // 默认生成截图框宽度
      type: Number,
      default: 300
    },
    autoCropHeight: {// 默认生成截图框高度
      type: Number,
      default: 300
    },
    fixedNumber: { // 截图框的宽高比例
      type: Array,
      default: () => {
        return [9, 16]
      }
    },
    images: { // 默认图片
      type: String,
      default: ''
    }
  },
  data () {
    return {
      previews: {},
      option: {
        img: '', // 裁剪图片的地址
        size: 1, // 裁剪生成图片的质量
        full: true, // 是否输出原图比例的截图 默认false
        outputType: this.outputType, // 裁剪生成图片的格式 默认jpg
        canMove: true, // 上传图片是否可以移动
        fixedBox: false, // 固定截图框大小 不允许改变
        original: false, // 上传图片按照原始比例渲染
        canMoveBox: true, // 截图框能否拖动
        autoCrop: true, // 是否默认生成截图框
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: this.autoCropWidth, // 默认生成截图框宽度
        autoCropHeight: this.autoCropHeight, // 默认生成截图框高度
        centerBox: false, // 截图框是否被限制在图片里面
        high: false, // 是否按照设备的dpr 输出等比例图片
        enlarge: 1, // 图片根据截图框输出比例倍数
        mode: 'contain', // 图片默认渲染方式
        maxImgSize: 2000, // 限制图片最大宽度和高度
        infoTrue: false, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        fixed: true, // 是否开启截图框宽高固定比例  (默认:true)
        fixedNumber: this.fixedNumber // 截图框的宽高比例
      }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  methods: {
    // 裁剪时触发的方法，用于实时预览
    realTime (data) {
      this.previews = data
    },
    // 重新上传
    uploadBth () {
      this.$emit('update-cropper')
    },
    // 取消关闭弹框
    handleClose () {
      this.dialogVisible = false
    },
    // 获取裁剪之后的图片，默认blob，也可以获取base64的图片
    saveImg () {
      if (this.imgType === 'blob') {
        this.$refs.cropper.getCropBlob(data => {
          this.$emit('upload-img', data)
        })
      } else {
        this.$refs.cropper.getCropData(data => {
          this.uploadFile = data
          this.$emit('upload-img', data)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.Cropper {
  .cropper-el {
    height: 300px;
    width: 300px;
  }
  .cropper-container {
    display: flex;
    justify-content: space-between;
    .prive-el {
      height: 164px;
      width: 94px;
      flex: 1;
      text-align: center;
      .prive-style {
        margin: 0 auto;
        flex: 1;
        -webkit-flex: 1;
        display: flex;
        display: -webkit-flex;
        justify-content: center;
        -webkit-justify-content: center;
        overflow: hidden;
        background: #ededed;
        margin-left: 40px;
      }
      .preview {
        overflow: hidden;
      }
      .el-button {
        margin-top: 20px;
      }
    }
  }
}
</style>
