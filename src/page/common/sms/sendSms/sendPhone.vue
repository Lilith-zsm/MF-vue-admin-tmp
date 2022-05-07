<template>
  <div class="common-box" :style="{height: height}">
    <el-row>
      <el-col :span="8">
        <m-form
          :form-data="formData"
          :column="column"
          :rule="rules"
          label-width="100px"
          :save-btn-loading="loading"
          @handleSave="handleSave"
        />
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formData: {},
      column: [
        {
          content: [
            {
              type: 'label_input',
              label: '接收号码',
              prop: 'iphone',
              span: 24
            },
            {
              type: 'label_input',
              label: '短信内容',
              prop: 'message',
              genre: 'textarea',
              rows: 18,
              height: 'auto',
              span: 24
            }
          ]
        }
      ],
      loading: false,
      height: ''
    }
  },
  computed: {
    rules() {
      return {
        iphone: [
          {
            required: true,
            message: '请输入接收号码',
            trigger: 'change'
          }
        ],
        message: [
          {
            required: true,
            message: '请输入短信内容',
            trigger: 'change'
          }
        ]
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.height = this.$Utils.setContentHeight(50)
    })
  },
  methods: {
    handleSave() {

    }
  }
}
</script>
