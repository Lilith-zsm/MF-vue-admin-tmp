<template>
  <div class="common-wrap">
    <condition-form
      ref="conditionForm"
      v-model="searchForm"
      :form-data="formData"
      @handleSearch="handleSearch"
    />
    <div class="common-box">
      <m-table
        ref="commonTable"
        :data-source="dataSource"
        :loading="tableLoading"
        :page-vo="pageVo"
        :columns="columns"
        @handleSelectionChange="handleSelectionChange"
        @handlePageChange="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'SystemLogManageOprLog',
  components: {},
  data() {
    return {
      searchForm: {
        tableDate: ''
      },
      multipleSelection: [],
      // 查询字段设置
      formData: [
        {
          label: '模块名',
          type: 'label_input',
          placeholder: '请输入',
          prop: 'module'
        },
        {
          prop: 'tableDate',
          type: 'label_date_picker',
          dateType: 'date',
          label: '创建日期',
          format: 'yyyy-MM-dd'
        },
        {
          prop: 'createTimeBegin',
          type: 'label_time_picker',
          label: '创建时间',
          format: 'HH:mm:ss'
        }
      ],
      // 表格初始化
      pageVo: {
        total: 0,
        pageSize: 50,
        currentPage: 1
      },
      // 表格参数配置
      tableLoading: false,
      // 表格展示的列
      columns: [
        {
          title: '序号',
          type: 'seq',
          width: 60,
          fixed: 'left'
        },
        {
          field: 'project',
          title: '项目名'
        },
        {
          field: 'service',
          title: '服务名'
        },
        {
          field: 'module',
          title: '模块名'
        },
        {
          field: 'className',
          title: '类名称'
        },
        {
          field: 'methodName',
          title: '方法名'
        },
        {
          field: 'operateUrl',
          title: '请求方式'
        },
        {
          field: 'operate',
          title: '业务操作'
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: 150,
          formatter: ({ cellValue }) => {
            return this.$Utils.formatterTimeZones(cellValue)
          }
        },
        {
          field: 'requestObject',
          title: '业务操作对象',
          width: 160
        },
        {
          field: 'result',
          title: '业务操作结果',
          width: 160
        },
        {
          field: 'errorMsg',
          title: '错误信息'
        },
        {
          field: 'executionDuration',
          title: '执行时长'
        },
        {
          field: 'empCode',
          title: '员工工号'
        },
        {
          field: 'empName',
          title: '员工姓名'
        }
      ],
      // 表格值集
      dataSource: []
    }
  },
  created() {
    // 默认查询当天
    const startTime = moment().format('YYYY-MM-DD')
    this.$set(this.searchForm, 'tableDate', startTime)
    this.$set(this.searchForm, 'createTimeBegin', ['00:00:00', '23:59:59'])
    this.getData()
  },
  methods: {
    // 获取数据
    async getData() {
      if (!this.$Utils.hasPermi(['system:loginLog:query'])) {
        this.message.warning('您没有查看列表的权限！')
        return
      }
      this.tableLoading = true
      const params = {
        ...this.searchForm,
        pageNum: this.pageVo.currentPage,
        pageSize: this.pageVo.pageSize
      }
      try {
        const { rows, total } = await this.$api.system.log.oprList(params)
        this.tableLoading = false
        this.dataSource = rows
        this.pageVo.total = total
      } catch {
        this.tableLoading = false
      }
    },
    // 查询按钮
    handleSearch() {
      this.getData()
    },
    // 分页
    handlePageChange(val) {
      const { currentPage, pageSize } = val
      this.pageVo.currentPage = currentPage
      this.pageVo.pageSize = pageSize
      this.getData()
    },
    handleSelectionChange(val) {
      console.log(val)
    }
  }
}
</script>

<style lang="scss" scoped>
.main-box {
  background: #fff;
}
</style>
