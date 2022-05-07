<!--
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-04-11 16:12:41
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-04-14 16:14:40
-->
<template>
  <base-dialog
    :title="$t('发布公告')"
    :is-minus-full="true"
    :visible.sync="innerVisible"
  >
    <m-form
      :form-data="formData"
      :column="column"
      :rule="rules"
      label-width="100px"
      :save-btn-loading="loading"
      @handleSave="handleSave"
      @handleCancel="innerVisible = false"
    >
      <div slot="form-editor">
        <editor ref="editor" @submit="getEditorData" />
      </div>
    </m-form>
  </base-dialog>
</template>
<script>
import editor from './quillEditor'
export default {
  components: {
    editor
  },
  props: {
    visible: {
      type: Boolean
    }
  },
  data() {
    return {
      formData: {},
      column: [
        {
          content: [
            {
              type: 'label_input',
              label: '主题',
              prop: 'title',
              disabled: false,
              span: 18
            },
            {
              type: 'label_select',
              label: '公告类型',
              prop: 'subTypeCode',
              disabled: false,
              options: [],
              span: 6
            },
            {
              type: 'label_input_clearable',
              label: '接收对象',
              prop: 'receiverName',
              disabled: false,
              span: 18
            },
            {
              type: 'label_checkbox',
              label: ' ',
              prop: 'pushAppMesFlag',
              disabled: false,
              text: '同步APP',
              span: 6
            },
            {
              type: 'slot',
              label: '公告内容',
              prop: 'editor',
              disabled: false,
              span: 24,
              height: '400px'
            }
          ]
        }
      ],
      loading: false
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
    },
    rules() {
      return {
        title: [
          {
            required: true,
            message: '请填写主题',
            trigger: 'change'
          }
        ],
        subTypeCode: [
          {
            required: true,
            message: '请选择公告类型',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    handleSave() {

    },
    getEditorData() {

    }
  }
}
</script>
