<template>
  <div id="websiteContent">
    <base-dialog
      :title="$t('选择目的地')"
      :visible.sync="dialogVisible"
      width="1000px"
      center
    >
      <condition-form
        ref="conditionForm"
        v-model="searchForm"
        :form-data="formData"
      />
      <el-row style="margin-bottom: 10px">
        <el-col :span="20" style="text-align: left;margin-left: 20px;">
          <el-button type="primary" @click="onSearch"><i class="el-icon-search" /> {{ $t('查询') }}</el-button>
          <el-button type="danger" @click="onClear"> {{ $t('清空') }}</el-button>
        </el-col>
      </el-row>
      <my_table
        ref="comTable"
        :data-source="dataSource"
        :options="tableOptions"
        :page-vo="pageVo"
        :columns="tableColumns"
        @handleRowClick="rowClick"
        @handleSelectionChange="handleSelectionChange"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      />
      <div
        v-if="mutiSelectVisible"
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="onSubmit"
        >{{ $t('确定') }}</el-button>
        <el-button @click="onCancel">{{ $t('取消') }}</el-button>
      </div>
    </base-dialog>
  </div>
</template>

<script>
import { getSubName } from '@/api/dms/bas/mdm'
import { getDestinationInfoList } from '@/api/dms/bas/mdm'

export default {
  name: 'DestinationSelect',
  props: {
    visible: {
      type: Boolean
    },
    mutiSelectVisible: {
      type: Boolean,
      default: false
    },
    destinationList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      currentSelection: [],
      searchForm: {},
      // 查询字段设置
      formData: [
        {
          label: '目的地编号：',
          type: 'label_input',
          prop: 'regionCode'
          // xl: '2',
          // sm: '4'
        },
        {
          label: '目的地名称：',
          type: 'label_input',
          prop: 'regionName'
        },
        {
          label: '目的地类型：',
          type: 'label_select',
          prop: 'destinationTypeCode',
          options: []
        }
      ],
      // 表格初始化
      pageVo: {
        total: 0,
        status: true,
        pageSize: 50,
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
          label: '序号',
          align: 'center'
        },
        {
          prop: 'regionCode',
          label: '目的地编号',
          align: 'center',
          width: '150px'
        },
        {
          prop: 'regionName',
          label: '目的地名称',
          align: 'center'
        },
        {
          prop: 'destinationTypeName',
          label: '目的地类型',
          align: 'center'
        }
      ],
      // 表格值集
      dataSource: []
    }
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('update:visible', val)
      }
    }
  },
  mounted () {
    this.getData(this.searchForm)
    this.getSelectData()
    if (this.mutiSelectVisible) {
      this.tableOptions.mutiSelect = this.mutiSelectVisible
    }
  },
  methods: {
    /**
     * 获取数据字典
     */
    getLookUpData() {
      return new Promise((resove, reject) => {
        getSubName({
          name: 'DESTINATION',
          code: '051'
        }).then((res) => {
          resove(res.data)
        }).catch(err => { reject(err) })
      })
    },
    // 加载数字字典
    async getSelectData() {
      const data = await this.getLookUpData()
      this.selectData = {
        ...this.selectData,
        ...data
      }
      if (this.formData.length > 0) {
        this.formData.forEach(item => {
          if (item.prop === 'destinationTypeCode') {
            this.$set(item, 'options', this.selectData.DESTINATION)
          }
        })
      }
    },
    // 查询数据
    async getData () {
      this.tableOptions.loading = true
      const params = {
        ...this.searchForm,
        pageNum: this.pageVo.currentPage,
        pageSize: this.pageVo.pageSize
      }
      const res = await getDestinationInfoList(params)
      this.dataSource = res.rows
      this.pageVo.total = res.total
      if (this.destinationList) {
        const list = this.dataSource.filter(it => this.destinationList.some(ele => ele.code === it.regionCode))
        this.tableOptions.loading = false
        console.log(list)
        this.$nextTick(() => {
          list.forEach(row => {
            this.$refs['comTable'].$children[0].toggleRowSelection(row, true)
          })
        })
      }
    },
    // 筛选
    onSearch () {
      this.pageVo.currentPage = 1
      this.getData(this.searchForm)
    },
    onClear() {
      for (const i in this.searchForm) {
        this.searchForm[i] = null
      }
      this.pageVo.currentPage = 1
      this.getData(this.searchForm)
    },
    // 页码改变事件
    handleCurrentChange (val) {
      this.pageVo.currentPage = val
      this.getData(this.searchForm)
    },
    // 页数改变事件
    handleSizeChange (val) {
      this.pageVo.pageSize = val
      this.getData(this.searchForm)
    },
    // 多选框触发事件
    handleSelectionChange (val) {
      this.currentSelection = val
      console.log('val:', val)
    },
    rowClick (row) {
      this.$emit('submit', row)
    },
    // 取消按钮触发
    onCancel () {
      this.dialogVisible = false
    },
    // 确认时按钮触发
    onSubmit () {
      this.$emit('submit', this.currentSelection)
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
