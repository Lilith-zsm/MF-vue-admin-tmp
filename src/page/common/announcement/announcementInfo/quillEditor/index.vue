<!--
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2021-09-09 14:06:31
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-04-14 16:13:05
-->
<template>
  <div>
    <quillEditor
      v-model="content"
      :options="editorOption"
      class="quillEditor"
      :content="content"
      @change="onEditorChange($event)"
    />
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { addQuillTitle } from './quillTitle.js'
export default {
  name: 'QuillEditor',
  components: {
    quillEditor
  },
  props: {
  },
  data () {
    return {
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }], // custom button values
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
            [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
            [{ 'direction': 'rtl' }], // text direction
            [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['link', 'image']
          ]
        },
        placeholder: '请输入内容...'
      },
      content: ''
    }
  },
  computed: {

  },
  mounted () {
    document.getElementsByClassName('ql-color')[0].title = '字体颜色'
    document.getElementsByClassName('ql-background')[0].title = '背景颜色'
    addQuillTitle()
  },
  methods: {
    onEditorChange(val) {
      this.$emit('submit', val)
    }
  }
}
</script>
<style scoped>
.quillEditor{
  height:300px;
}
</style>

