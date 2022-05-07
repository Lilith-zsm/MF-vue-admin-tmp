<template>
  <base-dialog title="物品导入" :visible.sync="innerVisible" width="1000px" top="20px" class="dialog">
    <div v-loading="processing">
      <div class="my-Table">
        <div id="common-operation-btns">
          <el-button type="success" icon="el-icon-download" @click="onDownload">{{ $t('模板下载') }}</el-button>
          <el-upload
            class="upload"
            :action="importParams.url"
            :show-file-list="false"
            :file-list="importParams.fileList"
            :multiple="false"
            :before-upload="beforeUpload"
            :on-success="onUploadSuccess"
            :on-error="onUploadError"
          >
            <el-button type="warning" icon="el-icon-check">{{ $t('选择文件') }}</el-button>
          </el-upload>
          <el-button type="primary" :loading="loading" icon="el-icon-document-checked" @click="onSave">{{ $t('保存') }}</el-button>
        </div>
        <div class="table-list">
          <my_table
            ref="table_liust"
            :data-source="data"
            :options="options"
            :columns="columns"
            :page-vo="{}"
          />
        </div>
      </div>
    </div>
  </base-dialog>
</template>
<script>
// addListadd
import { importClient1, exportTemplate } from '@/api/ccs/base/customerProfile'
import { mapGetters } from 'vuex'
export default {
  props: {
    visible: Boolean
  },
  data() {
    return {
      data: [],
      columns: [
        {
          prop: 'ids',
          label: '序号'
        },
        {
          prop: 'message',
          label: '导入日志',
          width: 180,
          color: '#e6550d'
        },
        {
          prop: 'name',
          label: '名称(中)'
        },
        {
          prop: 'nameEn',
          label: '名称(英)'
        },
        {
          prop: 'nameTh',
          label: '名称(泰)'
        },
        {
          prop: 'transportTypeName1',
          label: '运输方式名称'
        },
        {
          prop: 'subCode',
          label: '子品名编号',
          width: '150'
        },
        {
          prop: 'subName',
          label: '名称(中)'
        },
        {
          prop: 'subNameEn',
          label: '名称(英)'
        },
        {
          prop: 'subNameTh',
          label: '名称(泰)',
          width: '150'
        },
        {
          prop: 'chinaUnitOfMeasurement',
          label: '计量单位'
        },
        {
          prop: 'thailandCurrency',
          label: '币别',
          width: '150'
        },
        {
          prop: 'thailandBasePriceBegin',
          label: '申报基准最低价格'
        },
        {
          prop: 'thailandBasePriceEnd',
          label: '申报基准最高价格',
          width: '150'
        },
        {
          prop: 'thailandCustomsCode',
          label: '泰国海关编码',
          width: '150'
        },
        {
          prop: 'statisticalCode',
          label: '泰国统计编号',
          width: '150'
        },
        {
          prop: 'tariffSequence',
          label: '泰国税号',
          width: '150'
        },
        {
          prop: 'thailandRegulationType',
          label: '泰国监管类型',
          width: '150'
        },
        {
          prop: 'thailandZeroTariff',
          label: '是否零税',
          width: '150'
        },
        {
          prop: 'zeroTaxConditionName',
          label: '零税条件',
          width: '150'
        },
        {
          prop: 'thailandTariffRate',
          label: '泰国关税税率',
          width: '150'
        },
        {
          prop: 'thailandOtherTaxRatea',
          label: '泰国消费税税率A',
          width: '150'
        },
        {
          prop: 'thailandOtherTaxRateb',
          label: '泰国VAT税率B',
          width: '150'
        },
        {
          prop: 'thailandCustomsRemarks',
          label: '泰国关务备注',
          width: '150'
        }
      ],
      options: {
        mutiSelect: false,
        serial: true,
        height: `calc(100vh - 293px)`
      },
      importParams: {
        url: importClient1,
        fileList: []
      },
      loading: false,
      processing: false
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
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
    this.getClientEmpList()
  },
  methods: {
    /**
         * 下载模板
         */
    onDownload() {
      exportTemplate().then(res => {
        this.$Utils.exportFile(this.$i18n.tc('客户模板'), res.request.responseURL)
      }).catch(() => {})
    },
    /**
         * 导入文件前的操作
         */
    beforeUpload(file) {
      // 上传前配置
      const excelfileExtend = '.xls,.xlsx'// 设置文件格式
      const fileExtend = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
      if (excelfileExtend.indexOf(fileExtend) <= -1) {
        this.$message.error(this.$i18n.tc('文件格式错误'))
        return false
      }
      this.processing = true
      this.importParams.fileList = [file]
    },
    /**
      * 导入文件成功后的回调
      */
    onUploadSuccess(response) {
      this.processing = false
      if (response && response.data.length > 0) {
        this.data = response.data
      }
    },
    /**
         * 导入文件失败后的回调
         */
    onUploadError() {
      this.processing = false
      this.$message.error(this.$i18n.tc('导入失败'))
    },
    /**
         * 批量保存
         */
    // onSave() {
    //   if (this.data.length < 1) {
    //     this.$message({
    //       message: this.$i18n.tc('请先导入数据!'),
    //       type: 'warning'
    //     })
    //     return
    //   }
    //   this.loading = true
    //   // this.data = this.data.map(item => ({
    //   //     ...item,
    //   //     createBy: this.userInfo.userId,
    //   //     createByName: this.userInfo.userName,
    //   //     cusName: this.cusName,
    //   //     cusCode: this.cusCode,
    //   //     orderSource: 'web'
    //   // }))
    //   addListadd(this.data).then(res => {
    //     this.$message({
    //       message: this.$i18n.tc('保存成功'),
    //       type: 'success'
    //     })
    //     this.innerVisible = false
    //     this.$emit('onSubmit')
    //   }).catch((res) => {
    //     this.loading = false
    //     if (res.data.data) {
    //       this.data = res.data.data
    //     }
    //   })
    // },
    // 获取客户信息
    getClientEmpList() {
      // getClientEmpList(
      //   {
      //     nickName: this.userInfo.userName
      //   }
      // ).then(res => {
      //   if (res.rows && res.rows.length > 0) {
      //     const [data] = res.rows
      //     this.cusCode = data.cusCode
      //     this.cusName = data.cusName
      //   }
      // })
    }
  }
}
</script>
<style lang="scss" scoped>
.toolbar {
    margin-top: 0;
}
.upload {
    display: inline-block;
    margin: 0 10px;
}
.dialog {
  /deep/ .el-dialog__body {
    padding: 0 10px 10px;
  }
}
</style>
