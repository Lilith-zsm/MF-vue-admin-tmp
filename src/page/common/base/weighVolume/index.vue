<template>
  <div class="common-wrap">
    <condition-form
      ref="conditionForm"
      v-model="searchForm"
      :form-data="formData"
      :hide-btn="true"
      @handleEnter="handleEnter"
    />
    <div class="common-box">
      <div class="con-button-rows">
        <el-button type="success"><i class="el-icon-check" /> {{ $t('提交') }}</el-button>
      </div>
      <m-table
        :data-source="dataSource"
        :options="options"
        :page-vo="pageVo"
        :columns="columns"
      />
    </div>
    <agreement v-if="visible" :visible.sync="visible" @confirm="onConfirm" />
  </div>
</template>
<script>
import agreement from './agreement'
import { mapGetters } from 'vuex'
export default {
  components: {
    agreement
  },
  data() {
    return {
      formData: [
        {
          type: 'label_input',
          label: '长(cm)',
          disabled: false,
          prop: 'boxExtent'
        },
        {
          type: 'label_input',
          label: '宽(cm)',
          disabled: false,
          prop: 'boxBreadth'
        },
        {
          type: 'label_input',
          label: '高(cm)',
          disabled: false,
          prop: 'boxAltitude'
        },
        {
          type: 'label_input',
          label: '重量(KG)',
          disabled: false,
          prop: 'boxWeight'
        },
        {
          type: 'label_input',
          label: '称重单号',
          disabled: false,
          prop: 'orderCode',
          required: true
        }
      ],
      searchForm: {
        orderCode: '',
        boxWeight: 0,
        boxExtent: 0,
        boxBreadth: 0,
        boxAltitude: 0
      },
      dataSource: [],
      options: {
        stripe: true, // 是否为斑马纹 table
        loading: false, // 是否添加表格loading加载动画
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        serial: true, // 是否支持序号
        mutiSelect: true, // 是否支持列表项选中功能
        cusHeight: 38
      },
      pageVo: {
        total: 0,
        status: false,
        pageSize: 50,
        currentPage: 1
      },
      columns: [
        {
          prop: 'ids',
          label: '序号',
          fixed: true
        },
        {
          prop: 'orderCode',
          label: '订单编号',
          fixed: true,
          width: 160
        },
        {
          prop: 'boxExtent',
          label: '长(cm)'
        },
        {
          prop: 'boxBreadth',
          label: '宽(cm)'
        },
        {
          prop: 'boxAltitude',
          label: '高(cm)'
        },
        {
          prop: 'volumnNumber',
          label: '体积(方)'
        },
        {
          prop: 'boxWeight',
          label: '重量'
        },
        {
          prop: 'operation',
          label: '操作',
          width: 180,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            return (
              <div>
                <el-button icon='el-icon-printer' type='text'>打印</el-button>
                <el-button icon='el-icon-delete' type='text' onClick={() => this.handleDelete(params.row)}>删除</el-button>
              </div>
            )
          }
        }
      ],
      visible: false
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
  },
  methods: {
    handleEnter() {
      const { boxExtent, boxBreadth, boxAltitude, orderCode } = this.searchForm
      const findOrderNo = this.dataSource.find(item => item.orderCode === orderCode)
      if (!orderCode) {
        this.message.warning(this.$i18n.tc('单号不能为空'))
        return
      }
      if (findOrderNo) {
        this.message.warning(this.$i18n.tc('单号不能重复'))
        return
      }
      this.searchForm.volumnNumber = (boxExtent * boxBreadth * boxAltitude) / 1000000
      this.dataSource = [...this.dataSource, { ...this.searchForm, cusCode: this.userInfo.cusCode }]
      this.$refs.conditionForm.resetForm()
    },
    handleDelete(row) {
      const index = this.dataSource.findIndex(item => item.orderCode === row.orderCode)
      if (index > -1) {
        this.dataSource.splice(index, 1)
      }
    },
    async onConfirm() {
      await this.$api.prefix.add(this.dataSource)
      this.dataSource = []
      this.message.success(this.$i18n.tc('保存成功'))
      this.visible = false
    },
    onSubmit() {
      this.visible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.common-wrap {
  /deep/ .el-input--mini .el-input__inner {
    background-color: #000;
  }
}
</style>
