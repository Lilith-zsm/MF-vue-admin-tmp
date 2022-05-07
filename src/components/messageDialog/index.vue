<template>
  <div class="receiptManagement">
    <base-dialog title="消息" :visible.sync="innerVisible" width="500px">
      <el-tabs v-model="activeName" class="conTab">
        <el-tab-pane :label="$t('预警')" name="warning" style="font-size: 20px;" />
        <el-tab-pane :label="$t('待办')" name="agency" style="font-size: 20px;" />
        <el-tab-pane :label="$t('通知')" name="notice" style="font-size: 20px;" />
      </el-tabs>
      <component :is="activeName" :warning-data="warningData" :agency-data="agencyData" :notice-data="noticeData" @onScrollNotice="onScrollNotice" @onScrollWarning="onScrollWarning" @onScrollAgency="onScrollAgency" />
    </base-dialog>
  </div>
</template>
<script>
import { getMesssageList } from '@/api/message/messageDialog'
import notice from './notice'
import warning from './warning'
import agency from './agency'

export default {
  components: {
    notice,
    warning,
    agency
  },
  props: {
    visible: Boolean,
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeName: 'warning',
      // 预警
      warningData: {
        warningArry: [],
        warningtotal: 0
      },
      // agencyData:{}   noticeData:{}
      // 待办
      agencyData: {
        agencyArry: [],
        agencytotal: 0
      },
      // 通知
      noticeData: {
        noticeArry: [],
        noticetotal: 0
      },
      // 所有消息数据
      DataList: [],
      // 分页
      pageVo: {
        total: 0,
        status: true,
        pageSizeWarning: 15,
        pageSizeAgency: 15,
        pageSizeNotice: 15,
        currentPage: 1
      }
    }
  },
  computed: {
    innerVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  mounted() {
    this.getMesssageList()
  },
  methods: {
    getMesssageList() {
      this.getWarningData()
      this.getAgencyData()
      this.getNoticeData()
      // getMesssageList({
      //   newsCategory: '1',
      //   pageNum: this.pageVo.currentPage,
      //   pageSize: this.pageVo.pageSize
      // }).then(res => {
      //   this.warningData = res.rows
      // this.DataList.forEach(item => {
      //   if (item.newsCategory === '1') {
      //     this.warningData.push(item)
      //   } else if (item.newsCategory === '2') {
      //     this.agencyData.push(item)
      //   } else if (item.newsCategory === '3') {
      //     this.noticeData.push(item)
      //   }
      // })
      //   console.log(res.rows)
      // })
    },
    // newsCategory 消息大类 1预警 2待办 3通知
    getWarningData() {
      getMesssageList({
        newsCategory: '1',
        pageNum: this.pageVo.currentPage,
        pageSize: this.pageVo.pageSizeWarning
      }).then(res => {
        this.warningData.warningArry = res.rows
        this.warningData.warningtotal = res.total
      })
    },
    // newsCategory 消息大类 1预警 2待办 3通知
    getAgencyData() {
      getMesssageList({
        newsCategory: '2',
        pageNum: this.pageVo.currentPage,
        pageSize: this.pageVo.pageSizeAgency
      }).then(res => {
        this.agencyData.agencyArry = res.rows
        this.agencyData.agencytotal = res.total
      })
    },
    // newsCategory 消息大类 1预警 2待办 3通知
    getNoticeData() {
      getMesssageList({
        newsCategory: '3',
        pageNum: this.pageVo.currentPage,
        pageSize: this.pageVo.pageSizeNotice
      }).then(res => {
        this.noticeData.noticeArry = res.rows
        this.noticeData.noticetotal = res.total
      })
    },

    onScrollWarning(val) {
      console.log(val.innerVisible)
      if (val.innerVisible) {
        this.innerVisible = false
      } else {
        this.pageVo.pageSizeWarning = val.countscroll
        this.getWarningData()
        val.loading = false
        console.log(val, '滚')
      }
    },
    onScrollNotice(val) {
      this.pageVo.pageSizeNotice = val.countscroll
      this.getNoticeData()
      val.loading = false
      console.log(val, '滚')
    },
    onScrollAgency(val) {
      this.pageVo.pageSizeAgency = val.countscroll
      this.getAgencyData()
      val.loading = false
      console.log(val, '滚')
    },
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>
<style lang="scss" scoped>
.receiptManagement {
  /deep/ .el-tabs__item {
    font-size: 18px !important;
  }
}
</style>
