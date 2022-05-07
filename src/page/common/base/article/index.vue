<template>
  <div class="common-wrap">
    <condition-form
      ref="conditionForm"
      v-model="searchForm"
      :form-data="formData"
    />
    <div class="common-box">
      <div id="common-operation-btns">
        <el-button
          type="primary"
          @click="onSearch"
        ><i class="el-icon-search" /> {{ $t('查询') }}</el-button>
        <el-button
          type="danger"
          @click="onClear"
        ><i class="el-icon-close" /> {{ $t('清空') }}</el-button>
        <el-button
          type="success"
          @click="addTable"
        ><i class="el-icon-plus" /> {{ $t('新增主品名') }}</el-button>
        <el-button
          type="primary"
          :disabled="currentSelection.length < 1 || currentSelection.length > 1"
          @click="onUpdate"
        ><i class="el-icon-edit" /> {{ $t('编辑主品名') }}</el-button>
        <el-button
          type="success"
          @click="addSubProduct"
        ><i class="el-icon-plus" /> {{ $t('新增子品名') }}</el-button>
        <el-button
          type="primary"
          :disabled="currentSelection.length < 1 || currentSelection.length > 1 || !currentSelection[0].subId"
          @click="onUpdateSub"
        ><i class="el-icon-edit" /> {{ $t('编辑子品名') }}</el-button>
        <el-button
          type="danger"
          :disabled="currentSelection.length < 1"
          :loading="deleteLoading"
          @click="deleteTable"
        >
          <i class="el-icon-delete" /> {{ $t('批量删除') }}
        </el-button>
        <el-button
          type="info"
          @click="onExport"
        ><i class="el-icon-download" /> {{ $t('导出') }}</el-button>
        <el-button type="info"><i class="el-icon-upload2" /> {{ $t('导入') }}</el-button>
      </div>
      <div class="table">
        <el-table
          ref="comTable"
          v-loading="options.loading"
          :stripe="options.stripe"
          :data="dataSource"
          :row-class-name="tableRowClassName"
          :height="options.height"
          border
          highlight-current-row
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="50px"
          />
          <el-table-column
            type="index"
            width="50"
            :label="$t('序号')"
          />
          <el-table-column
            prop="code"
            :label="$t('主品名编号')"
            :sortable="true"
            :show-overflow-tooltip="true"
            width="150"
          />
          <el-table-column
            prop="name"
            :label="$t('主品名名称(中)')"
            :sortable="true"
            :show-overflow-tooltip="true"
            width="150"
          />
          <el-table-column
            prop="nameEn"
            :label="$t('主品名名称(英)')"
            :sortable="true"
            :show-overflow-tooltip="true"
            width="150"
          />
          <el-table-column
            prop="nameTh"
            :label="$t('主品名名称(泰)')"
            :sortable="true"
            :show-overflow-tooltip="true"
            width="150"
          />
          <el-table-column
            type="index"
            width="100"
            :sortable="true"
            :show-overflow-tooltip="true"
            :label="$t('子品名序号')"
          />
          <el-table-column
            prop="subCode"
            :label="$t('子品名编号')"
            :sortable="true"
            :show-overflow-tooltip="true"
            width="150"
          />
          <el-table-column
            prop="subName"
            :label="$t('子品名名称(中)')"
            :sortable="true"
            :show-overflow-tooltip="true"
            width="150"
          />
          <el-table-column
            prop="subNameEn"
            :label="$t('子品名名称(英)')"
            :sortable="true"
            :show-overflow-tooltip="true"
            width="150"
          />
          <el-table-column
            prop="subNameTh"
            :label="$t('子品名名称(泰)')"
            :sortable="true"
            :show-overflow-tooltip="true"
            width="150"
          />
          <el-table-column
            prop="singleProduct"
            :label="$t('是否单一品名')"
            :sortable="true"
            :show-overflow-tooltip="true"
            width="150"
          />
          <el-table-column
            prop="remark"
            :label="$t('备注')"
            :sortable="true"
            :show-overflow-tooltip="true"
          />
          <!-- <el-table-column prop="total" label="主子标识" :sortable="true" :show-overflow-tooltip="true"/> -->
          <el-table-column
            prop="transportType1"
            :label="$t('EK(每立方计)')"
            align="center"
          >
            <el-table-column
              prop="minKg1"
              :label="$t('最低公斤数')"
              :sortable="true"
              :show-overflow-tooltip="true"
              width="150"
            >
              <!-- <template slot-scope="scoped">{{ scoped.row.sendADTO.votes }}</template> -->
            </el-table-column>
            <el-table-column
              prop="maxKg1"
              :label="$t('最高公斤数')"
              :sortable="true"
              :show-overflow-tooltip="true"
              width="150"
            >
              <!-- <template slot-scope="scoped">{{ scoped.row.sendADTO.pieces }}</template> -->
            </el-table-column>
            <el-table-column
              prop="minThb1"
              :label="$t('最低泰铢')"
              :sortable="true"
              :show-overflow-tooltip="true"
              width="150"
            >
              <!-- <template slot-scope="scoped">{{ scoped.row.sendADTO.weight }}</template> -->
            </el-table-column>
            <el-table-column
              prop="minRmb1"
              :label="$t('最低人民币')"
              :sortable="true"
              :show-overflow-tooltip="true"
              width="150"
            >
              <!-- <template slot-scope="scoped">{{ scoped.row.sendADTO.insuredFee }}</template> -->
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="transportType2"
            :label="$t('BY SEA(每立方计)')"
            align="center"
          >
            <el-table-column
              prop="minKg2"
              :label="$t('最低公斤数')"
              :sortable="true"
              :show-overflow-tooltip="true"
              width="150"
            >
              <!-- <template slot-scope="scoped">{{ scoped.row.sentADTO.votes }}</template> -->
            </el-table-column>
            <el-table-column
              prop="maxKg2"
              :label="$t('最高公斤数')"
              :sortable="true"
              :show-overflow-tooltip="true"
              width="150"
            >
              <!-- <template slot-scope="scoped">{{ scoped.row.sentADTO.pieces }}</template> -->
            </el-table-column>
            <el-table-column
              prop="minThb2"
              :label="$t('最低泰铢')"
              :sortable="true"
              :show-overflow-tooltip="true"
              width="150"
            >
              <!-- <template slot-scope="scoped">{{ scoped.row.sentADTO.weight }}</template> -->
            </el-table-column>
            <el-table-column
              prop="minRmb2"
              :label="$t('最低人民币')"
              :sortable="true"
              :show-overflow-tooltip="true"
              width="150"
            >
              <!-- <template slot-scope="scoped">{{ scoped.row.sentADTO.insuredFee }}</template> -->
            </el-table-column>
          </el-table-column>
          <!-- <el-table-column prop="total" label="材质" :show-overflow-tooltip="true" :sortable="true"/> -->
          <!-- <el-table-column prop="total" label="工业标准TIS" :sortable="true" :show-overflow-tooltip="true" width="150"/> -->
          <!-- <el-table-column prop="total" label="食品药物化妆品FDA" :show-overflow-tooltip="true" width="150"/> -->
          <el-table-column
            prop="thailandZeroTariff"
            :show-overflow-tooltip="true"
            :sortable="true"
            :label="$t('零关税')"
          />
          <el-table-column
            prop="quotationProduct"
            :show-overflow-tooltip="true"
            :sortable="true"
            :label="$t('报价品名')"
          />
          <el-table-column
            prop="subCreateTime"
            :show-overflow-tooltip="true"
            :sortable="true"
            :label="$t('录入时间')"
          />
          <el-table-column
            prop="subCreateByName"
            :show-overflow-tooltip="true"
            :sortable="true"
            :label="$t('录入人')"
          />
          <el-table-column
            prop="sendADTO"
            label="产地证品名资料"
            align="center"
          >
            <el-table-column
              prop="originCertificate"
              :show-overflow-tooltip="true"
              :sortable="true"
              :label="$t('产地证')"
            >
              <!-- <template slot-scope="scoped">{{ scoped.row.sendADTO.votes }}</template> -->
            </el-table-column>
            <el-table-column
              prop="originTruckName"
              :show-overflow-tooltip="true"
              :sortable="true"
              :label="$t('汽运品名')"
              width="150"
            >
              <!-- <template slot-scope="scoped">{{ scoped.row.sendADTO.pieces }}</template> -->
            </el-table-column>
            <el-table-column
              prop="originTruckNameUnit"
              :show-overflow-tooltip="true"
              :sortable="true"
              :label="$t('汽运品名单位')"
              width="150"
            >
              <!-- <template slot-scope="scoped">{{ scoped.row.sendADTO.weight }}</template> -->
            </el-table-column>
            <el-table-column
              prop="originTruckNameCode"
              :show-overflow-tooltip="true"
              :sortable="true"
              :label="$t('汽运品名编号')"
              width="150"
            >
              <!-- <template slot-scope="scoped">{{ scoped.row.sendADTO.insuredFee }}</template> -->
            </el-table-column>
            <el-table-column
              prop="originShippingName"
              :show-overflow-tooltip="true"
              :sortable="true"
              :label="$t('海运品名')"
              width="150"
            >
              <!-- <template slot-scope="scoped">{{ scoped.row.sendADTO.insuredFee }}</template> -->
            </el-table-column>
            <el-table-column
              prop="originShippingNameUnit"
              :show-overflow-tooltip="true"
              :sortable="true"
              :label="$t('海运品名单位')"
              width="150"
            >
              <!-- <template slot-scope="scoped">{{ scoped.row.sendADTO.insuredFee }}</template> -->
            </el-table-column>
            <el-table-column
              prop="originShippingNameCode"
              :show-overflow-tooltip="true"
              :sortable="true"
              :label="$t('海运品名编号')"
              width="150"
            >
              <!-- <template slot-scope="scoped">{{ scoped.row.sendADTO.insuredFee }}</template> -->
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="thailandCustomsCode"
            :show-overflow-tooltip="true"
            :sortable="true"
            :label="$t('泰国海关编码')"
            width="150"
          />
          <el-table-column
            prop="thailandRegulationType"
            :show-overflow-tooltip="true"
            :sortable="true"
            :label="$t('泰国监管类型Type')"
            width="150"
          />
          <el-table-column
            prop="supplierName"
            :show-overflow-tooltip="true"
            :sortable="true"
            :label="$t('供应商名称')"
            width="150"
          />
          <el-table-column
            prop="productDescription"
            :show-overflow-tooltip="true"
            :sortable="true"
            :label="$t('货品描述')"
            width="150"
          />
          <el-table-column
            prop="modelNumber"
            :show-overflow-tooltip="true"
            :sortable="true"
            :label="$t('货号')"
            width="150"
          />
          <el-table-column
            prop="controlBtn"
            :show-overflow-tooltip="true"
            align="center"
            fixed="right"
            :label="$t('操作')"
            width="150"
          >
            <template slot-scope="scoped">
              <el-button
                icon="el-icon-edit-outline"
                circle
                :title="$t('修改主品名')"
                type="success"
                plain
                @click="onEdit(scoped.row)"
              />
              <el-button
                icon="el-icon-edit"
                circle
                :disabled="scoped.row.subId ? false : true"
                :title="$t('修改子品名')"
                type="success"
                plain
                @click="onEditSub(scoped.row)"
              />
              <el-button
                icon="el-icon-delete"
                circle
                :title="$t('删除')"
                type="danger"
                plain
                @click="onDelete(scoped.row)"
              />
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            v-if="!!dataSource.length && pageVo.status"
            id="common-pagination"
            style="text-align: right;margin-right: 25px;padding: 10px 0 0"
            :current-page.sync="pageVo.currentPage"
            :page-sizes="[15, 30, 50, 100]"
            :page-size="pageVo.pageSize"
            layout="total, prev, pager, next,sizes,jumper"
            :total="pageVo.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <add-main
      v-if="order.visible"
      :visible.sync="order.visible"
      :order-list="form"
      @onSubmit="onSubmit"
    />
    <add-sub
      v-if="subProductVisible"
      :visible.sync="subProductVisible"
      :form="subForm"
      @onSubmit="onSubmitSubProduct"
    />
  </div>
</template>
<script>
import addMain from './addMain'
import addSub from './addSub'
import { getArticleList, deleteArticle, exportArticle } from '@/api/common/base/article'
import conditionForm from '@/components/conditionForm'

export default {
  name: 'Article',
  components: {
    addMain,
    addSub,
    conditionForm
  },
  data () {
    return {
      subProductVisible: false,
      deleteLoading: false,
      websiteTableVisible: false,
      formData: [
        {
          type: 'label_input',
          label: '主品名编号',
          prop: 'code'
        }
      ],
      order: {
        visible: false
      },
      options: {
        stripe: true, // 是否为斑马纹 table
        loading: false, // 是否添加表格loading加载动画
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        serial: true, // 是否支持序号
        mutiSelect: true // 是否支持列表项选中功能
      }, // table 的参数
      dataSource: [],
      // tab的分页控制
      pageVo: {
        pageSize: 15,
        total: 0,
        currentPage: 1,
        status: true
      },
      operates: {
        type: 'success',
        width: '100',
        fixed: 'right',
        show: true
      },
      currentSelection: [],
      loading: false,
      searchForm: {},
      form: {},
      subForm: {}
    }
  },
  mounted () {
    this.computedTableHeight()
    this.getContractingList(this.searchForm)
  },
  methods: {
    // 导出
    onExport () {
      const ids = []
      if (this.currentSelection) {
        this.currentSelection.map((item) => {
          if (item.id) {
            ids.push(item.id)
          }
          return ids
        })
      }
      const id = ids.join(',')
      exportArticle({ id }).then((res) => {
        this.$Utils.exportFile(this.$i18n.tc('历史品名维护导出'), res.request.responseURL)
      })
    },
    // END
    // 删除
    deleteTable () {
      // 删除loading
      this.deleteLoading = true
      const id = []
      // 将每行的id存入数组
      if (this.currentSelection) {
        this.currentSelection.map((item) => {
          if (item.id) {
            id.push(item.id)
          }
          return id
        })
      }
      this.$confirm(this.$i18n.tc('此操作将永久删除该数据, 是否继续?', '提示'), {
        confirmButtonText: this.$i18n.tc('确定'),
        cancelButtonText: this.$i18n.tc('取消'),
        type: 'warning'
      }).then(async () => {
        const res = await deleteArticle(id)
        if (res.code === 200) {
          this.$message({
            message: this.$i18n.tc(`${res.msg}`),
            type: 'success'
          })
          this.getContractingList(this.searchForm)
          this.deleteLoading = false
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$i18n.tc('已取消删除')
        })
        this.deleteLoading = false
      })
    },
    // END
    // 编辑主品名
    onUpdate () {
      [this.form] = this.currentSelection
      this.order.visible = true
    },
    // 编辑子品名
    onUpdateSub () {
      [this.subForm] = this.currentSelection
      this.subProductVisible = true
    },
    // 删除
    onDelete (row) {
      console.log(row)
      this.$confirm(this.$i18n.tc('此操作将永久删除该数据, 是否继续?', '提示'), {
        confirmButtonText: this.$i18n.tc('确定'),
        cancelButtonText: this.$i18n.tc('取消'),
        type: 'warning'
      }).then(async () => {
        // ids = id;
        const id = []
        id.push(row.id)
        const res = await deleteArticle(id)
        if (res.code === 200) {
          this.$message({
            message: this.$i18n.tc(res.msg),
            type: 'success'
          })
          this.getContractingList(this.searchForm)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$i18n.tc('已取消删除')
        })
      })
    },
    // END
    // 新增
    addTable () {
      this.form = null
      this.order.visible = true
    },
    // END
    // 新增子品名
    addSubProduct () {
      this.subForm = null
      this.subProductVisible = true
    },
    // END
    // 编辑子品名
    onEditSub (row) {
      this.subForm = row
      this.subProductVisible = true
    },
    // END
    // 编辑
    onEdit (row) {
      this.form = row
      this.order.visible = true
    },
    // END
    onSubmit () {
      this.getContractingList(this.searchForm)
    },
    onSubmitSubProduct () {
      this.getContractingList(this.searchForm)
    },
    // 查询方法
    getContractingList (searchForm = this.searchForm) {
      this.options.loading = true
      getArticleList({
        ...searchForm,
        pageNum: this.pageVo.currentPage,
        pageSize: this.pageVo.pageSize
      }).then((res) => {
        if (res.code === 200) {
          this.dataSource = res.rows
          console.log(this.dataSource)
          this.pageVo.total = res.total
          this.options.loading = false
        }
      })
    },
    // END
    // 筛选查询
    onSearch () {
      this.pageVo.currentPage = 1
      this.getContractingList(this.searchForm)
    },
    // 点击清空
    onClear () {
      for (const i in this.searchForm) {
        this.searchForm[i] = null
      }
      this.pageVo.currentPage = 1
      this.getContractingList(this.searchForm)
    },
    // END
    // 页码改变
    handleCurrentChange (val) {
      this.pageVo.currentPage = val
      this.getContractingList(this.searchForm)
    },
    handleSizeChange (val) {
      this.pageVo.pageSize = val
      this.getContractingList(this.searchForm)
    },
    handleSelectionChange (val) {
      this.currentSelection = val
    },
    tableRowClassName ({ row }) {
      if (row.uploaded === '0') {
        return 'warning-row'
      } else if (row.uploaded === '1') {
        return 'success-row'
      }
      return ''
    },
    // END
    // 计算表格高度
    computedTableHeight () {
      this.$nextTick(() => {
        console.log(this.$Utils.setTableHeight())
        console.log(this.$Utils.setTableHeight(this))
        this.options.height = this.$Utils.setTableHeight(38)
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.condition-search-form {
  text-align: left;
}
.order-page {
  padding: 20px 15px;
  .my_Table {
    background: white;
    padding: 25px;
    min-height: 56vh;
  }
}
.receiptManagement {
  padding: 10px;
  box-sizing: border-box;
  .receiptManagement-container {
    padding: 10px;
    margin: 6px 0 0;
    background: #fff;
  }
}
.tableBtnSty {
  cursor: pointer;
  color: rgba(74, 144, 226, 1);
  font-weight: 500;
  font-family: PingFangSC-Medium, PingFang SC;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.el-table .warning-row {
  background: rgb(156, 205, 205);
}

.el-table .success-row {
  background: rgb(255, 255, 225);
}
.table {
  .el-table th {
    background-color: #eff3f8;
    border-bottom: 1px solid #ccc;
  }
  .el-table--border td,
  .el-table--border th,
  .el-table__body-wrapper
    .el-table--border.is-scrolling-left
    ~ .el-table__fixed {
    border-color: #e4e8f3;
  }
  /deep/ .el-divider {
    margin: 0 9px 0 3px;
  }
  .borderLeft {
    border-left: 1px solid #e4e8f3;
  }
  .el-table--scrollable-x .el-table__body-wrapper {
    z-index: 2;
  }
  .el-table--mini th {
    padding: 2px 0;
  }
}
// .pagination {
//   height: 38px;
// }
</style>
