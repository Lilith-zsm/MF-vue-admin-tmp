<template>
  <div class="common-wrap">
    <div class="table-box con-padding">
      <el-row :gutter="20">
        <!-- 左侧树形 -->
        <el-col :xl="6" :md="8" :sm="12">
          <div class="con-margin-b">
            <el-button
              type="success"
              :disabled="!hasCurrentSite"
              @click="append"
            ><i class="el-icon-plus" /> {{ $t('新增') }}</el-button>
            <el-button
              :disabled="!hasCurrentSite"
              type="primary"
              @click="edit"
            ><i class="el-icon-edit" /> {{ $t('编辑') }}</el-button>
            <el-button
              :disabled="!hasCurrentSite || currentSite.id === 0"
              type="danger"
              @click="remove"
            ><i class="el-icon-delete" /> {{ $t('删除') }}</el-button>
          </div>
          <el-input
            v-model="filterText"
            class="con-margin-b"
            :placeholder="$t('输入关键字进行过滤')"
          />
          <el-tree
            ref="tree1"
            :data="leftWebsiteData"
            node-key="id"
            highlight-current
            default-expand-all
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            :props="{ children: 'children', label: 'siteNameChinese' }"
            @node-click="handleNodeClick"
          >
            <div slot-scope="{ data }" class="custom-tree-node">
              <span>{{ data.siteNameChinese }}</span>
            </div>
          </el-tree>
        </el-col>
        <!-- 组织架构详细信息 -->
        <el-col :xl="18" :md="16" :sm="12">
          <my_form
            ref="my_form"
            :form-data="formData"
            :column="column"
            :rule="type === 'detail' ? {} : rule"
            :disabled="type==='detail' || !hasCurrentSite"
            :save-btn-loading="loading"
            :cancel-btn-visible="false"
            :reset-btn-visible="true"
            :options="options"
            @handleReset="handleReset"
            @handleSave="handleSave"
            @handleChange="handleChange"
          >
            <!-- 上级网点slot -->
            <template v-slot:form-parentId>
              <el-popover
                v-model="websiteVisible"
                placement="bottom"
                width="400"
                trigger="click"
              >
                <el-tree
                  ref="tree"
                  :data="parentWebsiteData"
                  node-key="id"
                  highlight-current
                  default-expand-all
                  :expand-on-click-node="false"
                  :props="{
                    children: 'children',
                    label: 'siteNameChinese',
                  }"
                  @node-click="websiteSubmit"
                >
                  <div slot-scope="{ data }" class="custom-tree-node">
                    <span>{{ data.siteNameChinese }}</span>
                    <span style="float:right;color:#abb8d7;">
                      {{ data.siteCode }}
                    </span>
                  </div>
                </el-tree>
                <el-input
                  slot="reference"
                  v-model="formData.parentName"
                  class="el-input__box"
                  placeholder=""
                  clearable
                  readonly
                  :disabled="type==='edit' && currentSite.id === 0"
                >
                  <i slot="suffix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </template>
            <!-- 所属城市 -->
            <template v-slot:form-city>
              <select-area-tree
                ref="receiverCityTree"
                v-model="city"
              />
            </template>
            <!-- 照片 -->
            <template slot="form-pic">
              <el-upload
                :limit="limitValue"
                :multiple="true"
                :action="importFileUrl"
                :file-list="fileList"
                :auto-upload="false"
                :before-upload="handleBeforeUpload"
                :on-preview="handlePictureCardPreview"
                :on-change="handleOnChange"
                :on-remove="handleRemove"
                :on-exceed="handleOnExceed"
                :on-error="handleOnError"
                list-type="picture-card"
                :class="{disabled:uploadDisabled}"
              >
                <i
                  slot="default"
                  class="el-icon-plus"
                />
              </el-upload>
            </template>
          </my_form>
        </el-col>
      </el-row>
    </div>
    <!-- 网点表格 -->
    <website-table
      v-if="websiteTableVisible"
      :visible.sync="websiteTableVisible"
      @submit="websiteTableSubmit"
    />
    <base-dialog :title="$t('查看')" top="30px" :visible.sync="dialogVisible1">
      <img class="pic-show" :src="currentPic" alt="">
    </base-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import * as _api from '@/api/system/organization'
import websiteTable from '@/components/websiteTable'
// import { getSubName } from '@/api/system/other'
import selectAreaTree from '@/components/selectAreaTree'
export default {
  name: 'SystemWebsite',
  components: {
    websiteTable,
    selectAreaTree
  },
  data() {
    return {
      limitValue: 1,
      uploadDisabled: false,
      fileList: [],
      importFileUrl: _api.importFileUrl,
      currentPic: '',
      dialogVisible1: false,
      city: [],
      type: 'add',
      loading: false,
      hasCurrentSite: false,
      filterText: '',
      parentWebsiteData: [],
      leftWebsiteData: [],
      // codCurrencyArr: [],
      siteRankArr: [],
      // supervisorModeArr: [],
      // typeArr: [],
      warehouseTypeArr: [],
      websiteVisible: false,
      websiteTableVisible: false,
      currentSite: {},
      formData: {},
      options: {
        isScroller: true,
        scrollMaxHeight: 'calc(100vh - 163px)'
      },
      column: [
        {
          title: '查看组织架构',
          content: [
            {
              label: '组织编号',
              type: 'label_input',
              disabled: false,
              prop: 'siteCode'
            },
            {
              label: '组织简称',
              type: 'label_input',
              prop: 'siteNameChinese'
            },
            // {
            //   label: '组织（中）',
            //   type: 'label_input',
            //   prop: 'siteNameChinese'
            // },
            // {
            //   label: '组织名称（泰）',
            //   type: 'label_input',
            //   prop: 'siteNameChinese'
            // },
            // {
            //   label: '组织名称（英）',
            //   type: 'label_input',
            //   prop: 'siteNameChinese'
            // },
            {
              label: '上级组织',
              type: 'slot',
              prop: 'parentId'
            },
            {
              label: '组织类型',
              type: 'label_select',
              disabled: false,
              prop: 'siteRankCode',
              labelName: 'subName',
              labelVal: 'subCode',
              options: [],
              change: true
            },
            {
              label: '网点电话',
              type: 'label_input',
              prop: 'phone'
            },
            {
              label: '网点邮箱',
              type: 'label_input',
              prop: 'email'
            },
            {
              label: '负责人',
              type: 'label_input',
              prop: 'leader'
            },
            {
              label: '负责人手机',
              type: 'label_input',
              prop: 'mobile'
            },

            // {
            //   label: '本币币别',
            //   type: 'label_select',
            //   disabled: false,
            //   prop: 'codCurrency',
            //   labelName: 'subName',
            //   labelVal: 'subCode',
            //   options: []
            // },
            // {
            //   label: '类型',
            //   type: 'label_select',
            //   disabled: false,
            //   prop: 'typeCode',
            //   labelName: 'subName',
            //   labelVal: 'subCode',
            //   options: []
            // },
            // {
            //   label: '默认发件地',
            //   type: 'label_input',
            //   prop: 'sendAddr'
            // },
            {
              label: '所属财务中心',
              type: 'label_input_clearable',
              prop: 'finCenterSiteName',
              handleClear: () => {
                this.searchForm.finCenterSiteName = null
              },
              handleClick: () => {
                this.websiteTableVisible = true
              }
            },
            // {
            //   label: '代收货款限额',
            //   type: 'label_input',
            //   prop: 'loanPaymentQuota'
            // },
            // {
            //   label: '管理方式',
            //   type: 'label_select',
            //   disabled: false,
            //   prop: 'supervisorModeCode',
            //   labelName: 'subName',
            //   labelVal: 'subCode',
            //   options: []
            // },
            // {
            //   label: '分拣码',
            //   type: 'label_input',
            //   prop: 'sortingCode'
            // },
            // {
            //   label: '派送范围',
            //   type: 'label_input',
            //   prop: 'deliveryScope'
            // },
            {
              label: '所属国家',
              type: 'label_select',
              disabled: false,
              prop: 'country',
              options: [],
              change: true
            },
            // {
            //   label: '所属城市',
            //   type: 'slot',
            //   prop: 'city'
            // },
            {
              label: '所属城市',
              type: 'label_select',
              disabled: true,
              prop: 'city',
              options: []
            },
            {
              label: '地址',
              type: 'label_input',
              prop: 'address'
            },
            {
              label: '所属公司',
              type: 'label_input',
              prop: 'keyworkName'
            },
            {
              label: '邮编',
              type: 'label_input',
              prop: 'region'
            },
            // {
            //   label: '仓库类型',
            //   type: 'label_select',
            //   disabled: false,
            //   prop: 'warehouseTypeCode',
            //   labelName: 'subName',
            //   labelVal: 'subCode',
            //   options: [],
            //   required: false
            // },
            // {
            //   label: '仓库面积',
            //   type: 'label_input',
            //   disabled: false,
            //   prop: 'warehouseArea'
            // },
            // {
            //   label: '仓库容积',
            //   type: 'label_input',
            //   disabled: false,
            //   prop: 'warehouseVolume'
            // },
            // {
            //   label: '仓库编码',
            //   type: 'label_input',
            //   disabled: false,
            //   prop: 'warehouseCode'
            // },
            {
              label: '备注',
              type: 'label_input',
              prop: 'remark',
              xl: 12,
              lg: 8
            },
            {
              label: '财务中心',
              type: 'label_switch',
              prop: 'finCenterFlag',
              activeValue: '0',
              inactiveValue: '1'
            },
            // {
            //   label: '分拨中心标识',
            //   type: 'label_switch',
            //   prop: 'allocateCenterFlag'
            // },
            // {
            //   label: '允许到付',
            //   type: 'label_switch',
            //   prop: 'reachPayFlag'
            // },
            // {
            //   label: '允许代收',
            //   type: 'label_switch',
            //   prop: 'loanFlag'
            // },
            {
              label: '是否启用',
              type: 'label_switch',
              prop: 'status',
              activeValue: '0',
              inactiveValue: '1'
            },
            {
              label: '图标',
              type: 'slot',
              height: '100',
              prop: 'pic'
            }
          ]
        }
      ]
    }
  },
  computed: {
    rule() {
      return {
        siteCode: {
          required: true, message: '请输入网点编号', trigger: 'blur'
        },
        siteNameChinese: {
          required: true, message: '请输入网点名称', trigger: 'blur'
        },
        siteRankCode: {
          required: true, message: '请选择机构级别', trigger: 'change'
        },
        // codCurrency: {
        //   required: true, message: '请选择本币币别', trigger: 'change'
        // },
        // typeCode: {
        //   required: true, message: '请选择类型', trigger: 'change'
        // },
        sendAddr: {
          required: true, message: '请输入默认发件地', trigger: 'blur'
        },
        finCenterSiteCode: {
          required: true, message: '请选择所属财务中心', trigger: 'change'
        }
        // supervisorModeCode: {
        //   required: true, message: '请选择管理方式', trigger: 'change'
        // }
      }
    }
  },
  watch: {
    'formData.country' (val) {
      this.column[0].content.find(item => item.prop === 'city').disabled = !val
      if (val) {
        _api.getCity({ countryCode: val }).then(res => {
          if (res.code === 200) {
            this.column[0].content.find(item => item.prop === 'city').options = res.rows.map(it => ({
              label: it.cityName,
              value: it.cityCode
            }))
          }
        })
      }
    },
    filterText(val) {
      this.currentSite = {}
      this.$refs.tree1.filter(val)
    },
    type(val) {
      switch (val) {
      case 'add':
        // 表单的标题
        this.column[0].title = this.$i18n.tc('新增')
        this.column[0].content.find(it => it.prop === 'siteCode').disabled = false
        break
      case 'edit':
        // 表单的标题
        this.column[0].title = this.$i18n.tc('编辑')
        this.column[0].content.find(it => it.prop === 'siteCode').disabled = true
        if (this.currentSite.id === 0) {
          this.column[0].content.find(it => it.prop === 'siteRankCode').disabled = true
          // this.column[0].content.find(it => it.prop === 'codCurrency').disabled = true
        } else {
          this.column[0].content.find(it => it.prop === 'siteRankCode').disabled = false
          // this.column[0].content.find(it => it.prop === 'codCurrency').disabled = false
        }
        break
      case 'detail':
        // 表单的标题
        this.column[0].title = this.$i18n.tc('查看')
        break
      }
    }
  },
  mounted() {
    this.getDataDict()
    this.getData()
    this.setOptions()
  },
  methods: {
    changeCountry(val) {
      console.log(val)
    },
    setOptions() {
      _api.getCountry().then(res => {
        console.log(res)
        if (res.code === 200) {
          this.column[0].content.find(item => item.prop === 'country').options = res.rows.map(it => ({
            label: it.countryName,
            value: it.countryCode
          }))
        }
      })
    },
    // 获取树形数据
    async getData() {
      // if (!this.$Utils.hasPermi(['system:site:list'])) {
      //   this.$message.warning(this.$i18n.tc('您没有查看列表的权限！'))
      //   return
      // }
      // const params = {}
      // const { data } = await _api.list(params)
      // const data1 = this.$Utils.handleTree(data, 'id', 'parentId', 'children', -1)
      // this.leftWebsiteData = data1
      // this.parentWebsiteData = data1
    },
    // 树形节点点击事件
    handleNodeClick(data) {
      this.handleReset()
      this.currentSite = data
      this.hasCurrentSite = true
      this.type = 'detail'
      this.formData = _.cloneDeep(data)
      if (data.picture) {
        this.fileList = [{
          name: '图标',
          url: data.picture
        }]
        this.uploadDisabled = true
      } else {
        this.uploadDisabled = false
      }
      if (this.formData.siteRankCode === '002004') {
        // 机构级别是仓库
        this.dealWarehouseValue(false)
      } else {
        this.dealWarehouseValue(true)
      }
    },
    // 初始化表单
    handleReset() {
      this.$refs.my_form.$refs.form.resetFields()
      for (const i in this.formData) {
        this.formData[i] = null
      }
      this.city = []
      this.fileList = []
      // this.formData.status = '1'
    },
    // 新增按钮
    append() {
      this.handleReset()
      this.formData.siteRankCode = this.siteRankArr[0].subCode
      this.formData.siteRankName = this.siteRankArr[0].subName
      this.formData.parentId = this.currentSite.id
      this.formData.parentName = this.currentSite.siteNameChinese
      this.type = 'add'
    },
    // 编辑按钮
    edit() {
      this.type = 'edit'
    },
    // 查询组织架构详情
    async getInfo(id) {
      const { data } = await _api.getInfo(id)
      this.formData = data
      if (data.picture) {
        this.fileList = [{
          name: '图标',
          url: data.picture
        }]
      }
      if (this.formData.siteRankCode === '002004') {
        // 机构级别是仓库
        this.dealWarehouseValue(false)
      } else {
        this.dealWarehouseValue(true)
      }
      if (id) {
        // 默认左侧树形高亮该id的网点
        this.$nextTick(() => {
          this.$refs.tree1.setCurrentKey(`${id}`)
        })
      }
    },
    handleChange(prop) {
      console.log(prop)

      switch (prop) {
      // 机构级别
      case 'siteRankCode':
        if (this.formData.siteRankCode === '002004') {
          // 是仓库
          this.dealWarehouseValue(false)
        } else {
          this.dealWarehouseValue(true)
        }
        break
      case 'country':
        this.formData.city = ''
        break
      }
    },
    // 保存表单
    handleSave() {
      this.dealData().then(async () => {
        if (this.type === 'add') {
          // 新增
          this.loading = true
          const data = await _api.add(this.formData).catch(res => {
            this.loading = false
          })
          if (data.code === 200) {
            this.loading = false
            this.$message.success(this.$i18n.tc('新增成功'))
            this.getData()
            this.type = 'detail'
            this.getInfo(this.currentSite.id)
          } else {
            this.loading = false
          }
        } else {
          // 编辑
          this.loading = true
          const data = await _api.edit(this.formData).catch(res => {
            this.loading = false
          })
          if (data.code === 200) {
            this.loading = false
            this.$message.success(this.$i18n.tc('修改成功'))
            this.getData()
            this.type = 'detail'
            this.getInfo(this.currentSite.id)
          } else {
            this.loading = false
          }
        }
      })
    },
    // 组织架构选项值对仓库相关输入框的diabled影响
    dealWarehouseValue(isDisabled = false) {
      // this.column[0].content.find(it => it.prop === 'warehouseTypeCode').rules = { required: !isDisabled, message: this.$i18n.tc('请选择仓库类型'), trigger: 'change' }
      // this.column[0].content.find(it => it.prop === 'warehouseCode').rules = { required: !isDisabled, message: this.$i18n.tc('请选择仓库类型'), trigger: 'change' }
      // this.column[0].content.find(it => it.prop === 'warehouseTypeCode').disabled = isDisabled
      // this.column[0].content.find(it => it.prop === 'warehouseCode').disabled = isDisabled
      // this.column[0].content.find(it => it.prop === 'warehouseArea').disabled = isDisabled
      // this.column[0].content.find(it => it.prop === 'warehouseVolume').disabled = isDisabled
    },
    // 处理表单数据
    dealData() {
      return new Promise((resolve, reject) => {
        this.formData.siteRankName = this.formData.siteRankCode ? this.$Utils.matchValue(this.siteRankArr, this.formData.siteRankCode, 'subCode', 'subName') : ''
        // this.formData.typeName = this.formData.typeCode ? this.$Utils.matchValue(this.typeArr, this.formData.typeCode, 'subCode', 'subName') : ''
        // this.formData.supervisorModeName = this.formData.supervisorModeCode ? this.$Utils.matchValue(this.supervisorModeArr, this.formData.supervisorModeCode, 'subCode', 'subName') : ''
        // this.formData.warehouseTypeName = this.formData.warehouseTypeCode ? this.$Utils.matchValue(this.warehouseTypeArr, this.formData.warehouseTypeCode, 'subCode', 'subName') : ''
        // this.formData.city = this.city.length ? this.city[0] : ''
        if (this.fileList.length) {
          this.formData.picture = this.fileList[0].url
        }
        resolve()
      })
    },
    // 删除按钮
    remove() {
      this.$confirm(`${this.$i18n.tc('是否确定删除改组织架构')}？`, this.$i18n.tc('提示'), {
        confirmButtonText: this.$i18n.tc('确定'),
        cancelButtonText: this.$i18n.tc('取消'),
        type: 'warning'
      }).then(() => {
        _api.remove(this.currentSite.id).then(res => {
          if (res.code === 200) {
            this.$message.success(this.$i18n.tc('删除成功'))
            this.getData()
          }
        })
      }).catch(() => {})
    },
    // 表单上级网点选择
    websiteSubmit(val) {
      console.log('网点', val)
      this.formData.parentId = val.id
      this.formData.parentName = val.siteNameChinese
      this.websiteVisible = false
    },
    // 树形过滤节点
    filterNode(value, data) {
      if (!value) return true
      return data.siteNameChinese.indexOf(value) !== -1
    },
    // 获取数据字典
    async getDataDict() {
      const str = '002,008,020,001,053'
      const { data } = await getSubName({
        name: str,
        code: str
      })
      this.siteRankArr = data['002'] // 机构级别
      // this.codCurrencyArr = data['008'] // 本币币别
      // this.supervisorModeArr = data['020'] // 管理方式
      // this.typeArr = data['001'] // 类型
      // this.warehouseTypeArr = data['053'] // 仓库类型
      this.column[0].content.find(it => it.prop === 'siteRankCode').options = data['002'] // 机构级别
      // this.column[0].content.find(it => it.prop === 'codCurrency').options = data['008'] // 本币币别
      // this.column[0].content.find(it => it.prop === 'supervisorModeCode').options = data['020'] // 管理方式
      // this.column[0].content.find(it => it.prop === 'typeCode').options = data['001'] // 类型
      // this.column[0].content.find(it => it.prop === 'warehouseTypeCode').options = data['053'] // 仓库类型
    },
    // 表单所属财务中心选择
    websiteTableSubmit(val) {
      console.log('所属财务中心', val)
      this.formData.finCenterSiteCode = val.siteCode
      this.formData.finCenterSiteName = val.siteNameChinese
      this.websiteTableVisible = false
    },

    // 文件超出个数限制时的钩子
    handleOnExceed(files, fileList) {
      this.$message({
        message: this.$i18n.tc('仅支持上传1张图片！'),
        type: 'warning'
      })
    },
    // 上传图片之前
    handleBeforeUpload(file) {
      var fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (fileType !== 'jpg' && fileType !== 'png' && fileType !== 'jpeg') {
        this.$message.error(this.$i18n.tc('只支持jpeg, jpg, png格式!'))
        return false
      }
      return true
    },
    // 图片蒙层查看图标
    handlePictureCardPreview(file) {
      this.currentPic = file.url
      this.dialogVisible1 = true
    },
    // 图片蒙层删除图标
    handleRemove(file) {
      const newFileList = this.fileList.filter(it => it.url !== file.url)
      this.fileList = newFileList
      if (this.fileList.length < this.limitValue) {
        this.uploadDisabled = false
      }
    },
    handleOnChange(file, fileList) {
      const formData = new FormData()
      formData.append('attachmentUrl', file.raw)
      formData.append('attachmentType', '证件图片')
      formData.append('businessCode', 'CUSTOMER')
      _api.getUploadCustomerPro(formData).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: this.$i18n.tc('文件上传成功')
          })
          console.log('上传到服务器的文件返回的数据是：', res.data)
          this.fileList.push({
            url: res.data[0].attachmentUrl,
            name: res.data[0].id
          })
          if (this.fileList.length >= this.limitValue) {
            this.uploadDisabled = true
          }
        } else {
          this.$message({
            type: 'error',
            message: this.$i18n.tc('文件上传失败')
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleOnError() {
      this.$message.error('图片上传失败，请重新上传！')
    }
  }
}
</script>

<style lang="scss" scoped>
.table-box {
  background: #fff;
  overflow: hidden;
  height: calc(100vh - 114px);
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
/deep/ .el-tree {
  height: calc(100vh - 207px);
  overflow: auto;
}
/deep/ .el-cascader--mini {
  width: 100%;
}
/deep/.disabled .el-upload--picture-card {
  display: none!important;
}
/deep/.disabled .el-upload-list__item.is-success .el-upload-list__item-status-label{
  display: none!important;
}
.pic-show{
  width: 100%;
}
</style>
