<template>
  <div>
    <base-dialog
      :title="$t('绑定角色')"
      :visible.sync="innerVisible"
      width="50%"
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
            @handleCancel="innerVisible=false"
            @handleChange="handleChange"
            @handleSave="saveFormdata"
          />
        </el-col>
      </el-row>
    </base-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getCountry } from '@/api/common'
import { addEmpInfo } from '@/api/common/base/empInfo'
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
      formData: {},
      options: {
        isScroller: true,
        scrollMaxHeight: 'calc(100vh - 350px)'
      },
      rule: {
        empCode: {
          required: true,
          message: '请输入员工编号',
          trigger: 'blur'
        }
      },
      column: [
        {
          title: '',
          content: [
            {
              label: '选择角色',
              type: 'label_select',
              disabled: false,
              placeholder: '请选择角色',
              change: true,
              options: [
                {
                  label: '管理员',
                  value: '管理员'
                },
                {
                  label: '普通用户',
                  value: '普通用户'
                }
              ],
              multiple: true,
              xl: 24,
              lg: 24,
              md: 24,
              sm: 24,
              prop: 'deliveryIdentification'
            }
          ]
        }
      ]
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
    this.getCountry()
  },
  methods: {
    handleChange(prop, val) {
      console.log(prop)
      console.log(val)
    },
    // 加载国家数据
    async getCountry () {
      const country = await getCountry()
      if (country.code === 200) {
        if (this.column[0].content.length > 0) {
          this.column[0].content.forEach(item => {
            if (item.prop === 'salespersonNationalityCode') {
              this.$set(item, 'options', country.data)
            }
          })
        }
      }
    },
    // 保存
    async saveFormdata () {
      this.$emit('save', this.formData)
      const res = await addEmpInfo(this.formData)
      if (res.code === 200) {
        this.$message({
          message: this.$i18n.tc(res.msg),
          type: 'success'
        })
        this.innerVisible = false
        this.$emit('onSubmit')
      }
    }
  }
}
</script>
