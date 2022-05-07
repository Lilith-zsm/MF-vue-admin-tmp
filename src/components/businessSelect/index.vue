<template>
  <div id="websiteContent">
    <base-dialog
      :title="$t('选择主类别')"
      :visible.sync="dialogVisible"
      width="700px"
      center
    >
      <condition-form
        ref="conditionForm"
        v-model="searchForm"
        :form-data="formData"
      />
      <el-row style="margin-bottom: 10px">
        <el-col
          :span="20"
          style="text-align: left;margin-left: 20px;"
        >
          <el-button
            type="primary"
            @click="onSearch"
          ><i class="el-icon-search" /> {{ $t('查询') }}</el-button>
          <el-button
            type="danger"
            @click="onClear"
          > <i class="el-icon-close" /> {{ $t('清空') }}</el-button>
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
    </base-dialog>
  </div>
</template>

<script>
import { getLookUpList } from '@/api/common/base/lookUp'

export default {
  name: 'DestinationSelect',
  props: {
    visible: {
      type: Boolean
    }
  },
  data() {
    return {
      searchForm: {},
      // 查询设置
      filterTitle: {
        title: '',
        form_width: '100px'
      },
      // 查询字段设置
      formData: [
        {
          label: '主类别编码：',
          type: 'label_input',
          prop: 'mainCode',
          xl: 8,
          lg: 8,
          md: 8,
          sm: 8
        },
        {
          label: '主类别名称：',
          type: 'label_input',
          prop: 'mainName',
          xl: 8,
          lg: 8,
          md: 8,
          sm: 8
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
        height: '350px',
        stripe: true, // 是否为斑马纹 table
        loading: false, // 是否添加表格loading加载动画
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        serial: true, // 是否支持序号
        mutiSelect: false // 是否支持列表项选中功能
      },
      // 表格展示的列
      tableColumns: [
        {
          label: '序号',
          prop: 'ids',
          align: 'center'
        },
        {
          prop: 'mainCode',
          label: '主类别编号',
          align: 'center',
          width: '150px'
        },
        {
          prop: 'mainName',
          label: '主类别名称',
          align: 'center'
        }
      ],
      // 表格值集
      dataSource: []
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
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    // 查询数据
    async getData() {
      this.tableOptions.loading = true
      const params = {
        ...this.searchForm,
        pageNum: this.pageVo.currentPage,
        pageSize: this.pageVo.pageSize
      }
      const res = await getLookUpList(params)
      this.dataSource = res.rows
      this.pageVo.total = res.total
      this.tableOptions.loading = false
    },
    onSearch () {
      this.pageVo.currentPage = 1
      this.getData(this.searchForm)
    },
    onClear () {
      for (const i in this.searchForm) {
        this.searchForm[i] = null
      }
      this.pageVo.currentPage = 1
      this.getData(this.searchForm)
    },
    // 页码改变事件
    handleCurrentChange(val) {
      this.pageVo.currentPage = val
      this.getData(this.searchForm)
    },
    // 页数改变事件
    handleSizeChange(val) {
      this.pageVo.pageSize = val
      this.getData(this.searchForm)
    },
    // 多选框触发事件
    handleSelectionChange(val) {
      console.log('val:', val)
    },
    rowClick(row) {
      this.$emit('submit', row)
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
