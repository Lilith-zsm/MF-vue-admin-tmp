<template>
  <div>
    <base-dialog
      :title="orderList? $t('修改主类别') : $t('新增主类别')"
      :visible.sync="innerVisible"
      width="45%"
      :is-minus-full="true"
      :close-on-click-modal="false"
    >
      <el-row>
        <el-col style="text-align: left;">
          <my_form
            :form-data="formData"
            :column="column"
            :go-back="false"
            :options="options"
            :rule="rule"
            :close-hide="true"
            label-width="80px"
            @handleSave="saveFormdata"
            @handleCancel="innerVisible = false"
          >
            <div slot="form-hide" />
          </my_form>
        </el-col>
      </el-row>
    </base-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { addLookUpMain } from '@/api/common/base/lookUp'
export default {
  components: {
  },
  props: {
    orderList: {
      type: Object,
      default: null
    },
    visible: {
      type: Boolean
    }
  },
  data () {
    return {
      options: {
        isScroller: true,
        scrollMaxHeight: 'calc(100vh - 350px)'
      },
      subNameVisible: false,
      websiteTableVisible: false,
      businessVisible: false,
      statusIden: '1',
      formData: {},
      rule: {
        mainName: {
          required: true,
          message: '请输入主类别名称（中）',
          trigger: 'blur'
        }
      },
      column: [
        {
          title: '',
          content: [
            {
              label: '主类别名称（中）',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入主类别名称（中）',
              prop: 'mainName',
              xl: 24,
              lg: 24,
              md: 24,
              sm: 24
            },
            {
              label: '主类别名称（英）',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入主类别名称（英）',
              prop: 'mainNameEn',
              xl: 24,
              lg: 24,
              md: 24,
              sm: 24
            },
            {
              label: '主类别名称（泰）',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入主类别名称（泰）',
              prop: 'mainNameTh',
              xl: 24,
              lg: 24,
              md: 24,
              sm: 24
            }
          ]
        }
      ],
      mainParams: {}
    }
  },
  computed: {
    innerVisible: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('update:visible', val)
      }
    },
    ...mapGetters(['userInfo'])
  },
  mounted () {
    if (this.orderList) {
      this.formData = {
        ...this.orderList
      }
    }
  },
  methods: {
    // 保存
    async saveFormdata () {
      this.$emit('save', this.formData)
      if (!this.$props.orderList) {
        const res = await addLookUpMain(this.formData)
        if (res.code === 200) {
          this.$message({
            message: this.$i18n.tc(res.msg),
            type: 'success'
          })
          this.innerVisible = false
          this.$emit('onSubmit')
        }
      } else {
        // const res = await updateEmpInfo(this.formData)
        // if (res.code === 200) {
        //   this.$message({
        //     message: this.$i18n.tc(res.msg),
        //     type: 'success'
        //   })
        //   this.innerVisible = false
        //   this.$emit('onSubmit')
        // }
      }
    }
  }
}
</script>
