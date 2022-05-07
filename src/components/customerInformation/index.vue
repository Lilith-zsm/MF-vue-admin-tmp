<template>
  <div id="EInformationContent">
    <base-dialog :title="$t('客户信息')" :visible.sync="dialogVisible" width="700px">
      <condition-form ref="conditionForm" v-model="searchForm" :form-data="formData" />
      <el-row style="margin-bottom: 10px">
        <el-col :span="20" style="text-align: left;margin-left: 20px;">
          <el-button type="primary" @click="getData"><i class="el-icon-search" /> {{ $t('查询') }}</el-button>
          <el-button type="danger" @click="onClear"> {{ $t('清空') }}</el-button>
        </el-col>
      </el-row>
      <my_table ref="mutipleTable" :data-source="dataSource" :options="tableOptions" :page-vo="pageVo" :columns="tableColumns" @handleRowClick="rowClick" @handleSelectionChange="handleSelectionChange" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" @selectable="onselectable" />
      <div v-if="mutiSelectVisible" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="SelectClick">{{ $t('确定') }}</el-button>
        <el-button @click="onCancel">{{ $t('取消') }}</el-button>
      </div>
    </base-dialog>
    <!-- 网点表格 -->
    <website-table v-if="websiteTableVisible" :visible.sync="websiteTableVisible" @submit="websiteTableSubmit" />
  </div>
</template>

<script>
import * as _api from '@/api/dms/bas/mdm'
import websiteTable from '@/components/websiteTable'
import { mapGetters } from 'vuex'
import store from '@/store'

export default {
  name: 'CustomerInformation',
  components: {
    websiteTable
  },
  props: {
    customerData: {
      type: Array,
      default: () => {
        return []
      }
    },
    visible: {
      type: Boolean
    },
    blongCode: {
      type: String,
      default: () => {
        return store.state.user.userInfo.site.siteCode
      }
    },
    admIden: {
      type: String,
      default: ''
    },
    setCat: {
      type: String,
      default: ''
    },
    mutiSelectVisible: {
      type: Boolean
    }
  },
  data() {
    return {
      searchForm: {},
      // 查询设置
      filterTitle: {
        title: '',
        form_width: '90px'
      },
      // 查询字段设置
      formData: [
        {
          label: '客户名称：',
          type: 'label_input',
          placeholder: '请输入',
          prop: 'cusAbbverviation',
          xl: 6,
          sm: 6
        },
        {
          label: '客户编号：',
          type: 'label_input',
          placeholder: '请输入',
          prop: 'cusCode',
          xl: 6,
          sm: 6
        },
        {
          label: '网点编码：',
          type: 'label_input_clearable',
          placeholder: '请输入',
          prop: 'blongCode',
          disabled: false,
          onClick: (val) => {
            console.log(val)
            // 禁用状态没有点击事件
            if (!val.disabled) {
              this.websiteTableVisible = true
            }
          },
          onClear: () => {
            console.log('133')
          },
          xl: 6,
          sm: 6
        }
      ],
      // 表格初始化
      pageVo: {
        total: 0,
        status: true,
        pageSize: 15,
        currentPage: 1
      },
      // 表格参数配置
      tableOptions: {
        height: '300px',
        stripe: true, // 是否为斑马纹 table
        loading: false, // 是否添加表格loading加载动画
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        serial: true, // 是否支持序号
        mutiSelect: false // 是否支持列表项选中功能
      },
      // 表格展示的列
      tableColumns: [
        {
          prop: 'ids',
          align: 'center',
          label: '序号'
        },
        {
          prop: 'cusCode',
          label: '客户编号',
          align: 'center',
          width: '150px'
        },
        {
          prop: 'cusAbbverviation',
          label: '客户名称',
          align: 'center'
        }
      ],
      // 表格值集
      dataSource: [],
      // 网点弹框
      websiteTableVisible: false,
      blongCode1: '',
      // 多选数据
      valList: []
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
    },
    ...mapGetters(['userInfo']),
    siteCode() {
      return this.userInfo.site.siteCode
    }
  },
  created() {
  },
  mounted() {
    // console.log(this.customerData)
    // 编码默认为当前登录的编码
    this.$set(this.searchForm, 'blongCode', store.state.user.userInfo.site.siteCode)
    if (this.mutiSelectVisible) {
      this.tableOptions.mutiSelect = this.mutiSelectVisible
    }
    if (store.state.user.userInfo.site.typeCode !== '001001') {
      this.formData.forEach(item => {
        if (item.prop === 'blongCode') {
          item.disabled = true
        }
      })
    }
    this.getData()
  },
  methods: {
    onselectable(row, index) {
      console.log(row, index)
    },
    // 查询数据
    async getData() {
      const params = {
        ...this.searchForm,
        pageNum: this.pageVo.currentPage,
        pageSize: this.pageVo.pageSize,
        parm: 3,
        admIden: this.admIden,
        setCat: this.setCat,
        siteCode: this.searchForm.blongCode
      }
      const { rows, total } = await _api.getClientInfoList(params)
      this.dataSource = rows
      this.pageVo.total = total
      if (this.customerData) {
        console.log(this.customerData)
        const list = this.dataSource.filter(it => this.customerData.some(ele => ele.code === it.cusCode))
        console.log(list)
        this.$nextTick(() => {
          list.forEach(row => {
            this.$refs['mutipleTable'].$children[0].toggleRowSelection(row, true)
          })
        })
      }
    },
    // 网点弹框
    websiteTableSubmit(val) {
      this.$set(this.searchForm, 'blongeName', val.siteNameChinese)
      this.$set(this.searchForm, 'blongCode', val.siteCode)
      this.websiteTableVisible = false
    },
    // 清空按钮
    onClear() {
      // 清空
      for (const i in this.searchForm) {
        this.searchForm[i] = null
        // 如果网点类型不为001001的时候默认不清空网点编号
        if (store.state.user.userInfo.site.typeCode !== '001001') {
          this.$set(this.searchForm, 'blongCode', store.state.user.userInfo.site.siteCode)
        }
      }
      this.getData()
    },
    // 页码改变事件
    handleCurrentChange(val) {
      this.pageVo.currentPage = val
      this.$refs.comFilter.submitForm('submit')
    },
    // 页数改变事件
    handleSizeChange(val) {
      this.pageVo.pageSize = val
      this.$refs.comFilter.submitForm('submit')
    },
    // 多选框触发事件
    handleSelectionChange(val) {
      console.log('val:', val)
      this.valList = val
    },
    SelectClick() {
      this.$emit('submit', this.valList)
    },
    onCancel() {
      this.dialogVisible = false
    },
    rowClick(row) {
      if (this.mutiSelectVisible) {
        return false
      } else {
        this.$emit('submit', row)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding: 0px 0px 20px !important;
}
/deep/ .el-table__body-wrapper {
  max-height: 300px;
  overflow-y: auto;
}
#filter {
  padding: 0px;
  margin-bottom: 0px;
}
.table {
  margin: 0 15px;
}
</style>
