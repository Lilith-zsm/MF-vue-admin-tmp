<template>
  <div class="common-wrap">
    <condition-form
      ref="conditionForm"
      v-model="searchForm"
      :form-data="formData"
      @handleSearch="handleSearch"
    />
    <div class="common-box">
      <div class="con-button-rows">
        <el-button
          type="success"
          @click="handleSendAnnounce"
        >
          <i class="el-icon-plus" /> {{ $t('发公告') }}
        </el-button>
      </div>
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
    <website-table
      v-if="websiteTableVisible"
      :visible.sync="websiteTableVisible"
      @submit="websiteTableSubmit"
    />
    <view-announcementInfo
      v-if="viewAnnoun.visible"
      :visible.sync="viewAnnoun.visible"
      :form="form"
    />
    <send-announcement
      v-if="sendVisible"
      :visible.sync="sendVisible"
    />
  </div>
</template>
<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import viewAnnouncementInfo from './view'
import conditionForm from '@/components/conditionForm'
import websiteTable from '@/components/websiteTable'
import sendAnnouncement from './sendAnnouncement'
export default {
  name: 'Announcement',
  components: {
    conditionForm,
    websiteTable,
    viewAnnouncementInfo,
    sendAnnouncement
  },
  data() {
    return {
      websiteTableVisible: false,
      formData: [
        {
          type: 'label_date_picker',
          label: '登记时间',
          prop: 'startTime',
          dateType: 'datetimerange',
          xl: 8,
          sm: 12,
          lg: 8
        },
        {
          type: 'label_input_clearable',
          label: '所属网点',
          prop: 'createSiteName',
          disabled: false,
          onClick: () => {
            this.websiteTableVisible = true
          },
          onClear: () => {
            this.$set(this.searchForm, 'createSiteCode', null)
          }
        }
      ],
      form: null,
      viewAnnoun: {
        visible: false
      },
      searchForm: {
        startTime: []
      },
      tableLoading: false,
      dataSource: [],
      // tab的分页控制
      pageVo: {
        total: 0,
        pageSize: 50,
        currentPage: 1
      },
      columns: [
        {
          type: 'checkbox',
          width: 50,
          fixed: 'left'
        },
        {
          title: '序号',
          type: 'seq',
          width: 60,
          fixed: 'left'
        },
        {
          title: '主题',
          field: 'title'
        },
        {
          title: '公告内容',
          field: 'mesContent'
        },
        {
          title: '公告类型',
          field: 'mesClassification'
        },
        {
          title: '接收端',
          field: 'receiveEnd'
        },
        {
          title: '附件',
          field: 'enclosureName'
        },
        {
          title: '发表人',
          prfieldop: 'createByName'
        },
        {
          title: '发表时间',
          field: 'createTime',
          width: '160',
          formatter: row => (row.createTime ? moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '')
        },
        {
          title: '操作',
          field: 'operation',
          slots: { default: 'operation_default' },
          params: [
            {
              title: '查看',
              type: 'success',
              icon: 'el-icon-view',
              click: (row) => {
                // this.handleEdit(row)
              }
            },
            {
              title: '下载附件',
              type: 'success',
              icon: 'el-icon-download',
              click: (row) => {
                // this.handleDelete(row)
              }
            },
            {
              title: '删除',
              type: 'danger',
              icon: 'el-icon-delete',
              click: (row) => {
              }
            }
          ]
        }
        // {
        //   prop: 'controlBtn',
        //   label: '操作',
        //   align: 'center',
        //   width: '150',
        //   fixed: 'right',
        //   render: (h, params) => {
        //     return (
        //       <div>
        //         <el-button icon='el-icon-view' circle title={this.$i18n.tc('查看')} type='success' plain onClick={() => this.onEdit(params.row)}></el-button>
        //         <el-button icon='el-icon-download' circle title={this.$i18n.tc('下载附件')} type='success' plain onClick={() => this.onAnnex(params.row)}></el-button>
        //         <el-button icon='el-icon-delete' circle title={this.$i18n.tc('删除')} type='danger' plain onClick={() => this.onDelete(params.row)}></el-button>
        //       </div>
        //     )
        //   }
        // }
      ],
      sendVisible: false
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    this.getTableList()
    if (this.userInfo.site.typeName !== '中心') {
      this.formData[1].disabled = true
      this.$set(this.searchForm, 'createSiteName', this.userInfo.site.siteNameChinese)
      this.$set(this.searchForm, 'createSiteCode', this.userInfo.site.siteCode)
    }
  },
  methods: {
    // 下载附件
    onAnnex(row) {
      this.$Utils.exportFile(row.enclosureName, row.enclosure)
    },
    // 所属网点
    websiteTableSubmit(val) {
      console.log(val)
      this.$set(this.searchForm, 'createSiteName', val.siteNameChinese)
      this.$set(this.searchForm, 'createSiteCode', val.siteCode)
      this.websiteTableVisible = false
    },
    // 行内修改
    onEdit(row) {
      this.form = row
      this.viewAnnoun.visible = true
    },
    // END
    // 查询
    async getTableList() {
      const formData = { ...this.searchForm }
      const { startTime } = formData
      if (startTime) {
        [
          formData.startTime,
          formData.endTime
        ] = startTime
      }
      this.tableLoading = true
      try {
        const res = await this.$api.common.announcement.list({
          ...formData,
          pageNum: this.pageVo.currentPage,
          pageSize: this.pageVo.pageSize
        })
        this.dataSource = res.rows
        this.pageVo.total = res.total
        this.tableLoading = false
      } catch {
        this.tableLoading = false
      }
    },
    // END
    // 筛选查询
    handleSearch() {
      this.pageVo.currentPage = 1
      this.getTableList()
    },
    // 分页
    handlePageChange(val) {
      const { currentPage, pageSize } = val
      this.pageVo.currentPage = currentPage
      this.pageVo.pageSize = pageSize
      this.getTableList()
    },
    handleSelectionChange(val) {
      this.currentSelection = val
    },
    handleSendAnnounce() {
      this.sendVisible = true
    }
  }
}
</script>
<style lang='scss' scoped>
.receiptManagement {
  padding: 10px;
  box-sizing: border-box;
  .receiptManagement-container {
    padding: 10px;
    margin: 10px 0 0;
    background: #fff;
  }
}
</style>

