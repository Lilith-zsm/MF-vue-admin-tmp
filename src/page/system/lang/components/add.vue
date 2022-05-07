<template>
  <div>
    <base-dialog
      :title="!form?$t('新增多语言'):$t('修改多语言')"
      :visible.sync="innerVisible"
      width="400px"
      :is-minus-full="false"
      :close-on-click-modal="false"
    >
      <el-row>
        <el-col style="text-align: left;">
          <m-form
            :form-data="formData"
            :column="column"
            :rule="rule"
            :save-btn-loading="saveBtnLoading"
            label-width="120px"
            @handleSave="saveFormdata"
            @handleCancel="innerVisible = false"
          />
        </el-col>
      </el-row>
    </base-dialog>
    <website-table
      v-if="websiteTableVisible"
      :visible.sync="websiteTableVisible"
      @submit="websiteTableSubmit"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import websiteTable from '@/components/websiteTable'
export default {
  components: {
    websiteTable
  },
  props: {
    form: {
      type: Object,
      default: null
    },
    visible: {
      type: Boolean
    }
  },
  data () {
    return {
      websiteTableVisible: false,
      formData: {
        visible: 1
      },
      rule: {
        strid: {
          required: true,
          message: '请输入中文',
          trigger: 'blur'
        },
        siteName: {
          required: true,
          message: '请输入所属网点',
          trigger: 'change'
        }
      },
      column: [
        {
          title: '',
          content: [
            {
              label: '中文',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入中文',
              prop: 'strid',
              span: 24
            },
            {
              label: '英文',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入英文',
              prop: 'lan1',
              span: 24
            },
            {
              label: '印尼文',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入印尼文',
              prop: 'lan2',
              span: 24
            },
            {
              label: '马来文',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入马来文',
              prop: 'lan3',
              span: 24
            },
            {
              label: '分组类型',
              type: 'label_select',
              options: [
                {
                  label: '菜单',
                  value: 1
                },
                {
                  label: '表格',
                  value: 2
                },
                {
                  label: '按钮',
                  value: 3
                },
                {
                  label: '其它',
                  value: 4
                }
              ],
              disabled: false,
              placeholder: '请选择分组类型',
              prop: 'grouptype',
              span: 24
            },
            {
              label: '是否可见',
              type: 'label_switch',
              prop: 'visible',
              activeValue: 1,
              inactiveValue: 0,
              span: 12
            },
            {
              label: 'APP标识',
              type: 'label_switch',
              prop: 'app',
              activeValue: '1',
              inactiveValue: '0',
              span: 12
            }
          ]
        }
      ],
      saveBtnLoading: false
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
    if (this.form) {
      this.formData = {
        ...this.form
      }
    }
  },
  methods: {
    // 保存
    async saveFormdata () {
      this.saveBtnLoading = true
      try {
        !this.form ? await this.$api.system.lang.add(this.formData) : await this.$api.system.lang.edit(this.formData)
        this.saveBtnLoading = false
        this.innerVisible = false
        this.$emit('onSubmit')
      } catch {
        this.saveBtnLoading = false
      }
    }
  }
}
</script>
