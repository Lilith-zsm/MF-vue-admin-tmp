<template>
  <div>
    <base-dialog
      :title="orderList ? $t('修改航班') : $t('新增航班')"
      :visible.sync="innerVisible"
      width="800px"
      :is-minus-full="true"
      :close-on-click-modal="false"
    >
      <el-row>
        <el-col style="text-align: left;">
          <my_form
            :form-data="formData"
            :column="column"
            :options="options"
            :go-back="false"
            :rule="rule"
            :close-hide="true"
            label-width="80px"
            @handleCancel="innerVisible = false"
            @handleSave="saveFormdata"
          />
        </el-col>
      </el-row>
    </base-dialog>
    <warehouse-select
      v-if="warehouseVisible"
      :visible.sync="warehouseVisible"
      @submit="warehouseSubmit"
    />
  </div>
</template>
<script>
import warehouseSelect from '@/components/warehouseSelect'
import { putRoute, addRoute } from '@/api/common/base/route'
import { mapGetters } from 'vuex'
export default {
  components: {
    warehouseSelect
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
      warehouseVisible: false,
      websiteTableVisible: false,
      businessVisible: false,
      statusIden: '1',
      formData: {},
      rule: {
        flightCode: {
          required: true,
          message: '请输入航班编号',
          trigger: 'blur'
        },
        flightName: {
          required: true,
          message: '请输入航班名称(中)',
          trigger: 'blur'
        }
      },
      options: {
        xl: 8,
        lg: 8,
        md: 8,
        sm: 8
      },
      column: [
        {
          title: '',
          content: [
            {
              label: '航班编号',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入航班编号',
              prop: 'flightCode'
            },
            {
              label: '航班名称(中)',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入航班名称(中)',
              prop: 'flightName'
            },
            {
              label: '航班名称(英)',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入航班名称(英)',
              prop: 'flightNameEn'
            },
            {
              label: '航班名称(泰)',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入航班名称(泰)',
              prop: 'flightNameTh'
            },
            {
              label: '上架仓库',
              type: 'label_input_clearable',
              disabled: false,
              placeholder: '请选择上架仓库',
              prop: 'warehouseName',
              handleClick: () => {
                this.warehouseVisible = true
              },
              handleClear: () => {
                this.$set(this.formData, 'warehouseCode', null)
              }
            },
            {
              label: '备注',
              type: 'label_input',
              genre: 'textarea',
              disabled: false,
              placeholder: '请输入备注',
              prop: 'remark',
              xl: 20,
              lg: 20,
              md: 20,
              sm: 20
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
    console.log(this.formData, '加载')
    if (this.$props.orderList) {
      this.formData = {
        ...this.$props.orderList
      }
    }
  },
  methods: {
    warehouseSubmit(val) {
      this.$set(this.formData, 'warehouseName', val.warehouseName)
      this.$set(this.formData, 'warehouseCode', val.warehouseCode)
      this.warehouseVisible = false
    },
    // 保存
    async saveFormdata () {
      this.$emit('save', this.formData)
      this.column[0].content.map(item => {
        if (item.prop === 'warehouseCode') {
          return this.$set(this.formData, 'warehouseName', this.$Utils.matchValue(item.options, this.formData.warehouseCode, 'value', 'label'))
        }
      })
      if (!this.$props.orderList) {
        this.$set(this.formData, 'createSiteName', this.userInfo.site.siteNameChinese)
        const res = await addRoute(this.formData)
        if (res.code === 200) {
          this.$message({
            message: this.$i18n.tc(res.msg),
            type: 'success'
          })
          this.innerVisible = false
          this.$emit('onSubmit')
        }
      } else {
        const res = await putRoute(this.formData)
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
}
</script>
