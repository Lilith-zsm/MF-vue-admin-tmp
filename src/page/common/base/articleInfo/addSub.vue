<template>
  <div>
    <base-dialog
      :title="form? $t('修改子品名') : $t('新增子品名')"
      :visible.sync="innerVisible"
      width="90%"
      :is-minus-full="true"
      :close-on-click-modal="false"
    >
      <el-row>
        <el-col style="text-align: left;">
          <my_form
            :form-data="formData"
            :column="column"
            :go-back="false"
            :options="optionsForm"
            :rule="rule"
            :close-hide="true"
            label-width="80px"
            @handleSave="saveFormdata"
            @handleCancel="innerVisible = false"
          >
            <div slot="form-price">
              <el-input
                v-model="formData.chinaBasePriceBegin"
                type="number"
                style="width:40%;"
              />
              <span style="margin-left:5px;margin-right:5px;">{{ $t('至') }}</span>
              <el-input
                v-model="formData.chinaBasePriceEnd"
                type="number"
                style="width:40%;"
              />
            </div>
            <div slot="form-priceTr">
              <el-input
                v-model="formData.thailandBasePriceBegin"
                type="number"
                style="width:40%;"
              />
              <span style="margin-left:5px;margin-right:5px;">{{ $t('至') }}</span>
              <el-input
                v-model="formData.thailandBasePriceEnd"
                type="number"
                style="width:40%;"
              />
            </div>
            <div slot="form-photo">
              <el-upload
                :limit="5"
                :file-list="fileList"
                :on-success="onSuccess"
                :on-remove="handleRemove"
                :data="{bizId: form ? formData.originBizId : bizId, bizCode: 'SubProduct'}"
                :action="importFileUrl"
                list-type="picture-card"
              >
                <i
                  slot="default"
                  class="el-icon-plus"
                />
              </el-upload>
            </div>
            <div slot="form-title">
              <span style="color:red;">{{ $t('图片至少上传一张,图片类型只能为gif,png,jpg,jpeg,且大小不超过500k') }}</span>
              <div>{{ $t('请不要在商品图片上添加商品外的其它信息,如水印,优惠信息等,被电商平台发现会做相应处理。') }}</div>
            </div>
          </my_form>
        </el-col>
      </el-row>
    </base-dialog>
    <el-dialog :close-on-click-modal="false" :visible.sync="dialogVisible">
      <img
        width="100%"
        style="height:200px;"
        :src="dialogImageUrl"
        alt=""
      >
    </el-dialog>
    <!-- 供应商 -->
    <supplier-select
      v-if="supplierVisible"
      :documentary-type="'2'"
      :visible.sync="supplierVisible"
      @submit="supplierSubmit"
    />
  </div>
</template>
<script>
import { importFileUrl, getUploadList, getUploadImgList, deleteUpload } from '@/api/ccs/base/customerProfile'
import { addArticleSub, putArticleSub, getArticData, getArticDataSub } from '@/api/common/base/article'
import supplierSelect from '@/components/supplierSelect'
import { mapGetters } from 'vuex'
export default {
  components: {
    supplierSelect
  },
  props: {
    form: {
      type: Object,
      default: null
    },
    visible: {
      type: Boolean
    }
  },
  data () {
    return {
      supplierVisible: false,
      optionsForm: {
        isScroller: true,
        scrollMaxHeight: 'calc(100vh - 350px)'
      },
      fileList: [],
      disabled: false,
      dialogVisible: false,
      dialogImageUrl: '',
      bizId: '',
      fileImg: '',
      importFileUrl: importFileUrl,
      imageUrl: '',
      websiteTableVisible: false,
      businessVisible: false,
      statusIden: '1',
      formData: {
        customInfoList: []
      },
      rule: {
        thailandRegulationType: {
          required: true,
          message: '请选择泰国监管类型Type',
          trigger: 'change'
        },
        parentCode: {
          required: true,
          message: '请选择主品名编号',
          trigger: 'change'
        },
        cusName: {
          required: true,
          message: '请选择所属客户',
          trigger: 'change'
        }
        // subName: {
        //   required: true,
        //   message: '请输入子类别名称',
        //   trigger: 'blur'
        // }
      },
      column: [
        {
          title: '商品CARGO信息',
          content: [
            {
              label: '子品名编号',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入子品名编号',
              prop: 'code'
            },
            {
              label: '中文名称',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入中文名称',
              prop: 'name'
            },
            {
              label: '泰文名称',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入泰文名称',
              prop: 'nameTh'
            },
            {
              label: '英文名称',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入英文名称',
              prop: 'nameEn'
            },
            {
              label: '主品名编号',
              type: 'label_select',
              disabled: false,
              labelName: 'code',
              labelVal: 'code',
              options: [],
              placeholder: '请选择主品名编号',
              prop: 'parentCode'
            },
            {
              label: '报价名称',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入报价名称',
              prop: 'quotationProduct'
            },
            // {
            //   label: '供应商名称',
            //   type: 'label_input_clearable',
            //   disabled: false,
            //   placeholder: '请选择供应商名称',
            //   handleClick: () => {
            //     this.supplierVisible = true
            //   },
            //   handleClear: () => {
            //     this.$set(this.formData, 'supplierCode', null)
            //   },
            //   prop: 'supplierName'
            // },
            // {
            //   label: '货号',
            //   type: 'label_input_number',
            //   disabled: false,
            //   placeholder: '请输入货号',
            //   prop: 'modelNumber'
            // },
            {
              label: '单一品名',
              type: 'label_select',
              disabled: false,
              options: [
                {
                  label: 'Y',
                  value: 'Y'
                },
                {
                  label: 'N',
                  value: 'N'
                }
              ],
              placeholder: '请选择单一品名',
              prop: 'singleProduct'
            },
            // {
            //   label: '货品描述',
            //   type: 'label_input',
            //   genre: 'textarea',
            //   disabled: false,
            //   placeholder: '请输入货品描述',
            //   prop: 'productDescription',
            //   xl: 20,
            //   lg: 20,
            //   md: 20,
            //   sm: 20,
            //   height: 'aotu'
            // },
            {
              label: '备注',
              type: 'label_input',
              genre: 'textarea',
              disabled: false,
              placeholder: '请输入备注',
              prop: 'remark',
              xl: 20,
              lg: 20,
              md: 20,
              sm: 20,
              height: 'aotu'
            }
          ]
        },
        {
          title: '商品电商仓储信息',
          content: [
            {
              label: '仓库品类码',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入仓库品类码',
              prop: 'warehouseCategoryCode'
            },
            {
              label: '商品名称',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入商品名称',
              prop: 'productName'
            },
            {
              label: '规格型号',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入规格型号(113克/支)',
              prop: 'specificationModel'
            },
            {
              label: '生产日期',
              type: 'label_date_picker',
              dateType: 'datetime',
              format: 'yyyy-MM-dd HH:mm:ss',
              disabled: false,
              placeholder: '请选择生产日期',
              prop: 'productionDate'
            },
            {
              label: '电商平台编码',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入电商平台编码',
              prop: 'commercePlatformCode'
            },
            {
              label: '商品SN码',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入商品SN码',
              prop: 'productSnCode'
            },
            {
              label: '品牌',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入品牌',
              prop: 'brand'
            },
            {
              label: '保质天数',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入保质天数(700天)',
              prop: 'shelfLife'
            },
            {
              label: '商家编码',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入商家编码',
              prop: 'merchantCode'
            },
            {
              label: '生产厂家',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入生产厂家',
              prop: 'manufacturer'
            },
            {
              label: '净重',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入净重(113克/支)',
              prop: 'netWeight'
            },
            {
              label: '原产国',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入原产国(千克)',
              prop: 'countryOfOrigin'
            },
            {
              label: '包装方式',
              type: 'label_select',
              disabled: false,
              options: [
                {
                  label: '纸盒',
                  value: '01'
                }
              ],
              placeholder: '请选择包装方式',
              prop: 'packing'
            },
            {
              label: '毛重',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入毛重(113克/支)',
              prop: 'grossWeight'
            },
            {
              label: '单位',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入单位(千克)',
              prop: 'unit'
            }
          ]
        },
        {
          title: '中国关务信息',
          content: [
            {
              label: '中国海关编码',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入中国海关编码',
              prop: 'chinaCustomsCode'
            },
            {
              label: '计量单位',
              type: 'label_select',
              disabled: false,
              options: [
                {
                  label: '千克',
                  value: '01'
                }
              ],
              placeholder: '请选择计量单位',
              prop: 'chinaUnitOfMeasurement'
            },
            {
              label: '申报基准价格',
              type: 'slot',
              prop: 'price'
            },
            // {
            //   label: '海关价格',
            //   type: 'label_input',
            //   disabled: false,
            //   placeholder: '请输入海关价格',
            //   prop: 'remark',
            //   span: 8
            // },
            {
              label: '币种',
              type: 'label_select',
              disabled: false,
              placeholder: '请选择币种',
              options: [
                {
                  label: '人名币',
                  value: 'RMB'
                },
                {
                  label: '美元',
                  value: 'USD'
                },
                {
                  label: '泰铢',
                  value: 'THB'
                }
              ],
              prop: 'chinaCurrency'
            },
            {
              label: '中国监管类型Type',
              type: 'label_select',
              disabled: false,
              options: [
                {
                  label: 'A',
                  value: '01'
                },
                {
                  label: 'B',
                  value: '01'
                },
                {
                  label: 'B',
                  value: '01'
                }
              ],
              placeholder: '请选择中国监管类型Type',
              prop: 'chinaRegulationType'
            },
            {
              label: '中国关税税率',
              type: 'label_input_number',
              disabled: false,
              placeholder: '请输入中国关税税率',
              prop: 'chinaTariffRate'
            },
            {
              label: '其它税率A',
              type: 'label_input_number',
              disabled: false,
              placeholder: '请输入其它税率A',
              prop: 'chinaOtherTaxRatea'
            },
            {
              label: '其它税率B',
              type: 'label_input_number',
              disabled: false,
              placeholder: '请输入其它税率B',
              prop: 'chinaOtherTaxRateb'
            },
            {
              label: '规格型号(材质)',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入规格型号(材质)',
              prop: 'chinaSpecificationModel'
            },
            {
              label: '中国关务备注',
              type: 'label_input',
              genre: 'textarea',
              disabled: false,
              placeholder: '请输入中国关务备注',
              prop: 'chinaCustomsRemarks',
              xl: 20,
              lg: 20,
              md: 20,
              sm: 20,
              height: 'aotu'
            }
          ]
        },
        {
          title: '泰国关务信息',
          content: [
            {
              label: '泰国海关编码',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入泰国海关编码',
              prop: 'thailandCustomsCode'
            },
            {
              label: '计量单位',
              type: 'label_select',
              disabled: false,
              options: [
                {
                  label: '千克',
                  value: '01'
                }
              ],
              placeholder: '请选择计量单位',
              prop: 'thailandUnitOfMeasurement'
            },
            {
              label: '申报基准价格',
              type: 'slot',
              prop: 'priceTr'
            },
            {
              label: '币种',
              type: 'label_select',
              disabled: false,
              options: [
                {
                  label: '人名币',
                  value: 'RMB'
                },
                {
                  label: '美元',
                  value: 'USD'
                },
                {
                  label: '泰铢',
                  value: 'THB'
                }
              ],
              placeholder: '请选择币种',
              prop: 'thailandCurrency'
            },
            {
              label: '泰国监管类型Type',
              type: 'label_select',
              disabled: false,
              options: [
                {
                  label: 'General',
                  value: '01'
                },
                {
                  label: 'A',
                  value: '02'
                },
                {
                  label: 'A+',
                  value: '03'
                }
              ],
              placeholder: '请选择泰国监管类型Type',
              prop: 'thailandRegulationType'
            },
            {
              label: '零关税',
              text: '',
              type: 'label_checkbox',
              trueLabel: '1',
              falseLabel: '0',
              disabled: false,
              placeholder: '请选择零关税',
              prop: 'thailandZeroTariff',
              xl: 2,
              lg: 2,
              md: 2,
              sm: 2
            },
            {
              label: '泰国关税税率',
              type: 'label_input_number',
              disabled: false,
              placeholder: '请输入泰国关税税率',
              prop: 'thailandTariffRate',
              xl: 5,
              lg: 5,
              md: 5,
              sm: 5
            },
            {
              label: '泰国消费税税率 A（含政府其他）',
              type: 'label_input_number',
              disabled: false,
              placeholder: '请输入泰国消费税税率 A',
              prop: 'thailandOtherTaxRatea',
              span: 8
            },
            {
              label: '泰国VAT税率 B',
              type: 'label_input_number',
              disabled: false,
              placeholder: '请输入泰国VAT税率 B',
              prop: 'thailandOtherTaxRateb'
            },
            {
              label: '规格型号（材质）',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入规格型号（材质）',
              prop: 'thailandSpecificationModel'
            },
            {
              label: '泰国关务备注',
              type: 'label_input',
              genre: 'textarea',
              disabled: false,
              placeholder: '请输入泰国关务备注',
              prop: 'thailandCustomsRemarks',
              height: 'aotu',
              xl: 20,
              lg: 20,
              md: 20,
              sm: 20
            }
          ]
        },
        {
          title: '产地证信息',
          content: [
            {
              label: '产地证',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入产地证',
              prop: 'originCertificate',
              xl: 10,
              lg: 10,
              md: 10,
              sm: 10
            },
            {
              label: '汽运品名',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入汽运品名',
              prop: 'originTruckName',
              xl: 10,
              lg: 10,
              md: 10,
              sm: 10
            },
            {
              label: '汽运品名单位',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入汽运品名单位',
              prop: 'originTruckNameUnit',
              xl: 10,
              lg: 10,
              md: 10,
              sm: 10
            },
            {
              label: '汽运品名编号',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入汽运品名编号',
              prop: 'originTruckNameCode',
              xl: 10,
              lg: 10,
              md: 10,
              sm: 10
            },
            {
              label: '海运品名',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入海运品名',
              prop: 'originShippingName',
              xl: 10,
              lg: 10,
              md: 10,
              sm: 10
            },
            {
              label: '海运品名单位',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入海运品名单位',
              prop: 'originShippingNameUnit',
              xl: 10,
              lg: 10,
              md: 10,
              sm: 10
            },
            {
              label: '海运品名编号',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入海运品名编号',
              prop: 'originShippingNameCode',
              xl: 10,
              lg: 10,
              md: 10,
              sm: 10
            },
            {
              label: '报价品名',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入报价品名',
              prop: 'originQuotationProduct',
              xl: 10,
              lg: 10,
              md: 10,
              sm: 10
            }
          ]
        },
        {
          title: '商品图片信息',
          content: [
            {
              label: '',
              type: 'slot',
              prop: 'photo',
              height: 'aotu',
              xl: 20,
              lg: 20,
              md: 20,
              sm: 20
            },
            {
              label: '',
              type: 'slot',
              prop: 'title',
              height: 'aotu'
            }
          ]
        },
        {
          title: '其它国家关务信息',
          tableOption: {
            tableKey: 'customInfoList',
            addBtnVisible: true,
            onAddTableLine: this.onAddTableLine
          },
          tableColumn: [
            {
              label: '国家编码',
              type: 'label_input',
              disabled: false,
              prop: 'countryCode'
            },
            {
              label: '海关编码',
              type: 'label_input',
              disabled: false,
              prop: 'customsCode'
            },
            {
              label: '税率',
              type: 'label_input_number',
              disabled: false,
              prop: 'tariffRate'
            }
          ]
        }
      ],
      customInfoList: [
        {}
      ],
      mainParams: {},
      selectData: {}
    }
  },
  computed: {
    innerVisible: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('update:visible', val)
      }
    },
    ...mapGetters(['userInfo'])
  },
  mounted () {
    this.getSelectData()
    this.updateForm()
    if (!this.form) {
      this.bizId = (function() { // 获取唯一值
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0; var v = c === 'x' ? r : (r & 0x3 | 0x8)
          return v.toString(16)
        })
      })()
    }
  },
  methods: {
    // 供应商信息
    supplierSubmit(val) {
      console.log(val)
      this.$set(this.formData, 'supplierName', val.personName)
      this.$set(this.formData, 'supplierCode', val.supplierCode)
      this.supplierVisible = false
    },
    // 表单表格添加行
    onAddTableLine() {
      this.formData.customInfoList.push({})
    },
    // 图片删除
    async handleRemove(file, fileList) {
      console.log(file, '删除')
      const id = []
      id.push(file.id)
      const res = await deleteUpload(id)
      console.log(res)
    },
    // 图片上传成功
    onSuccess(response, file, fileList) {
      console.log(response)
      console.log(file)
      console.log(fileList)
    },
    // END
    // 加载修改数据
    async updateForm () {
      if (this.form) {
        const res = await getArticDataSub(this.form.subId)
        console.log(res, 'res')
        if (res.code === 200) {
          this.formData = {
            ...res.data
          }
          this.customInfoList = this.formData.customInfoList
          // 请求查询文件接口
          const uploadRes = await getUploadList({ bizId: res.data.originBizId, bizCode: res.data.originBizCode })
          console.log(uploadRes, '图片信息')
          uploadRes.rows.forEach(async item => {
            // 查询文件详情接口
            const uploadImg = await getUploadImgList(item.id)
            const params = {
              id: item.id,
              name: '',
              url: uploadImg.request.responseURL
            }
            this.fileList.push(params)
          })
        }
      }
    },
    // 加载数字字典
    async getSelectData () {
      const data = await getArticData()
      console.log(data, '564564')
      if (this.column[0].content.length > 0) {
        this.column[0].content.forEach(item => {
          if (item.prop === 'parentCode') {
            this.$set(item, 'options', data.rows)
          }
        })
      }
    },
    // 保存
    async saveFormdata () {
      this.$emit('save', this.formData)
      console.log(this.fileImg)
      this.column[1].content.map(item => {
        if (item.prop === 'packing') {
          return this.$set(this.formData, 'packingName', this.$Utils.matchValue(item.options, this.formData.packing, 'value', 'label'))
        }
      })
      if (!this.form) {
        // 如果有图片
        if (this.fileImg) {
          this.$set(this.formData, 'originBizCode', 'SubProduct')
          this.$set(this.formData, 'originBizId', this.bizId)
        }
        // this.$set(this.formData, 'customInfoList', this.dataSource)
        const res = await addArticleSub(this.formData)
        if (res.code === 200) {
          this.$message({
            message: this.$i18n.tc(res.msg),
            type: 'success'
          })
          this.innerVisible = false
          this.$emit('onSubmit')
        }
      } else {
        // this.$set(this.formData, 'customInfoList', this.dataSource)
        const res = await putArticleSub(this.formData)
        if (res.code === 200) {
          this.$message({
            message: this.$i18n.tc(res.msg),
            type: 'success'
          })
          this.innerVisible = false
          this.$emit('onSubmit')
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.form {
  .el-scrollbar {
    height: 100%;
  }
  /deep/ .el-scrollbar__wrap {
    overflow-x: hidden;
    scrollbar-color: transparent transparent;
    scrollbar-track-color: transparent;
    -ms-scrollbar-track-color: transparent;
    -ms-overflow-style: none;
  }
}
// .avatar-uploader .el-upload {
//   border: 1px dashed #d9d9d9;
//   border-radius: 6px;
//   cursor: pointer;
//   position: relative;
//   overflow: hidden;
// }
// .avatar-uploader .el-upload:hover {
//   border-color: #409eff;
// }
// .avatar-uploader-icon {
//   font-size: 28px;
//   color: #8c939d;
//   width: 178px;
//   height: 178px;
//   line-height: 178px;
//   text-align: center;
//   border: 1px dashed #c0ccda;
//   background-color: #fbfdff;
// }
// .avatar {
//   width: 178px;
//   height: 178px;
//   display: block;
// }
/deep/ .pagination {
  height: 0;
}
</style>
