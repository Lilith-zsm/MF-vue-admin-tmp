<template>
  <div :class="$options.name">
    <div v-for="item in resultImgList" :key="item" class="upload-img">
      <img
        :src="item"
        height="80px"
      >
    </div>
    <el-upload
      v-show="!resultImg"
      ref="fileUpload"
      class="upload-el"
      accept="image/*"
      name="pic"
      action=""
      :http-request="uploadHttpRequest"
      :on-change="selectChange"
      :show-file-list="false"
      :multiple="multiple"
      :auto-upload="fixedNumber.length === 0"
    >
      <div>
        <span
          class="icon upload-icon"
        />
        <el-button>{{ $t('选择图片') }}</el-button>
      </div>
      <div
        v-if="fixedNumber.length > 0"
        slot="tip"
        class="el-upload__tip"
      >
        {{ $t('图片大小不超过5M，推荐图片尺寸宽高比') }}{{ ratio }}
      </div>
    </el-upload>
    <figure
      v-show="resultImg"
      class="result-img"
    >
      <img
        :src="resultImg"
        @click="openImage"
      >
      <el-button
        icon="el-icon-upload2"
        @click="updateCropper"
      >{{ $t('重新上传') }}</el-button>
    </figure>
    <cropper
      v-if="showCropper"
      v-loading="loading"
      :visible.sync="showCropper"
      :cropper-img="cropperImg"
      :fixed-number="fixedNumber"
      :output-type="outputType"
      :auto-crop-width="autoCropWidth"
      :auto-crop-height="autoCropHeight"
      @update-cropper="updateCropper"
      @colse-dialog="closeDialog"
      @upload-img="uploadImg"
    />
    <!-- 图片展示 -->
    <el-image ref="image" style="position: absolute" :preview-src-list="srcList">
      <div slot="error" class="image-slot">
        <i />
      </div>
    </el-image>
  </div>
</template>

<script>
import cropper from './cropper.vue'
export default {
  name: 'UploadImg',
  components: {
    cropper
  },
  props: {
    fixedNumber: { // 截图框的宽高比例
      type: Array,
      default: () => {
        return []
      }
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
    images: { // 默认图片
      type: String,
      default: ''
    },
    multiple: { // 是否多选
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      cropperImg: '', // 需要裁剪的图片
      showCropper: false, // 是否显示裁剪框
      uploadFile: '', // 裁剪后的文件
      resultImg: '', // 上传成功，后台返回的路径
      loading: false,
      srcList: [],
      fileName: null,
      resultImgList: []
    }
  },
  computed: {
    ratio() {
      return this.fixedNumber.length > 0 ? this.fixedNumber.join(':') : ''
    }
  },
  mounted() {
    this.resultImg = this.images ? process.env.VUE_APP_GATEWAY_URL + this.images : ''
  },
  methods: {
    // submit 之后会触发此方法
    async httpRequest () {
      const formData = new FormData()
      formData.append('file', this.uploadFile, this.fileName)
      this.loading = true
      try {
        const { data } = await this.$api.common.file.upload(formData)
        this.resultImg = process.env.VUE_APP_GATEWAY_URL + data.url
        this.$emit('handleUpload', data.url)
        this.showCropper = false
      } finally {
        this.loading = false
      }
    },
    // 多个文件上传
    async uploadHttpRequest(file) {
      const formData = new FormData()
      formData.append('file', file.file)
      const { data } = await this.$api.common.file.upload(formData)
      this.resultImgList.push(process.env.VUE_APP_GATEWAY_URL + data.url)
    },
    // 选择文件
    selectChange (file) {
      if (this.fixedNumber.length > 0) {
        const { raw, name } = file
        this.openCropper(raw)
        this.fileName = name
      }
    },
    /**
     * @param {file} 上传的文件
      */
    openCropper (file) {
      var files = file
      const isLt5M = files.size > (5 << 20)
      if (isLt5M) {
        this.$message.error(this.$i18n.tc('请上传5M内的图片'))
        return false
      }
      var reader = new FileReader()
      reader.onload = e => {
        let data
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        this.cropperImg = data
      }
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(files)
      this.showCropper = true
    },
    // 上传图片
    uploadImg (file) {
      this.uploadFile = file
      this.httpRequest()
    },
    // 更新图片
    updateCropper () {
      this.$refs.fileUpload.$children[0].$el.click()
    },
    // 关闭窗口
    closeDialog () {
      this.showCropper = false
    },
    // 查看图片
    openImage() {
      this.srcList = [this.resultImg]
      this.$refs.image.showViewer = true
    }
  }
}
</script>

<style lang="scss" scoped>
.UploadImg {
  .el-upload {
    display: block;
    width: 100px;
    margin: 30px auto 0;
  }
  .upload-icon {
    display: block;
    margin: 0 auto;
    height: 44px;
    width: 52px;
    background-image: url(~@/assets/img/upload-image.png);
    background-position: 100% 100%;
    margin-bottom: 10px;
  }
  .result-img {
    img {
      display: block;
      margin-bottom: 10px;
      cursor: pointer;
      max-height: 50px;
    }
  }
  .upload-img {
    display: inline-block;
    vertical-align: middle;
  }
}
</style>
