<template>
  <div>
    <base-dialog
      :title="form? $t('修改子类别') : $t('新增子类别')"
      :visible.sync="innerVisible"
      width="65%"
      :is-minus-full="true"
      :close-on-click-modal="false"
    >
      <el-row>
        <el-col style="text-align: left;">
          <my_form
            :form-data="formData"
            :column="column"
            :go-back="false"
            :options="options"
            :rule="rule"
            :close-hide="true"
            label-width="80px"
            @handleSave="saveFormdata"
            @handleCancel="innerVisible = false"
          >
            <div slot="form-photo">
              <el-upload
                class="upload"
                :action="importParams.url"
                :show-file-list="false"
                :limit="1"
                :file-list="importParams.fileList"
                :multiple="false"
                :on-progress="handleProgress"
                :on-success="handleSuccess"
                :on-error="handleError"
              >
                <el-input
                  slot="trigger"
                  v-model="formData.enclosureName"
                  style="width:450px"
                  readonly
                  placeholder="请选择图片"
                  suffix-icon="el-icon-search"
                />
                <img v-if="importParams.dialogImageUrl" :src="importParams.dialogImageUrl" class="avatar">
              </el-upload>
              <!-- <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="importParams.dialogImageUrl" alt="">
              </el-dialog> -->
            </div>
          </my_form>
        </el-col>
      </el-row>
    </base-dialog>
    <business-select
      v-if="businessVisible"
      :visible.sync="businessVisible"
      @submit="businessSubmit"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import businessSelect from '@/components/businessSelect'
import { addLookUpSub, putLookUpSub, importFileUrl } from '@/api/common/base/lookUp'
export default {
  components: {
    businessSelect
  },
  props: {
    form: {
      type: Object,
      default: null
    },
    visible: {
      type: Boolean
    },
    mainName: {
      type: String,
      default: ''
    },
    mainCode: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      businessVisible: false,
      dialogVisible: false,
      options: {
        isScroller: true,
        scrollMaxHeight: 'calc(100vh - 350px)'
      },
      importParams: {
        url: importFileUrl,
        fileList: [],
        dialogImageUrl: ''
      },
      subNameVisible: false,
      websiteTableVisible: false,
      statusIden: '1',
      formData: {
        status: '1'
      },
      rule: {
        mainName: {
          required: true,
          message: '请选择主类别',
          trigger: 'change'
        },
        subName: {
          required: true,
          message: '请输入子类别',
          trigger: 'blur'
        }
      },
      column: [
        {
          title: '',
          content: [
            {
              label: '主类别',
              type: 'label_input_clearable',
              disabled: false,
              placeholder: '请选择主类别',
              prop: 'mainName',
              handleClear: () => {
                this.$Set(this.formData, 'mainCode', null)
              },
              handleClick: () => {
                this.businessVisible = true
              },
              xl: 24,
              lg: 24,
              md: 24,
              sm: 24
            },
            {
              label: '子类别名称（中）',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入子类别名称（中）',
              prop: 'subName',
              xl: 24,
              lg: 24,
              md: 24,
              sm: 24
            },
            {
              label: '子类别名称（英）',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入子类别名称（英）',
              prop: 'subNameEn',
              xl: 24,
              lg: 24,
              md: 24,
              sm: 24
            },
            {
              label: '子类别名称（泰）',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入子类别名称（泰）',
              prop: 'subNameTh',
              xl: 24,
              lg: 24,
              md: 24,
              sm: 24
            },
            {
              label: '值',
              type: 'label_input',
              disabled: false,
              placeholder: '请输入值',
              prop: 'subValue',
              xl: 24,
              lg: 24,
              md: 24,
              sm: 24
            },
            {
              label: '备注',
              type: 'label_input',
              disabled: false,
              genre: 'textarea',
              placeholder: '请输入备注',
              prop: 'remark',
              height: 'aotu',
              xl: 24,
              lg: 24,
              md: 24,
              sm: 24
            },
            // {
            //   label: '上传图片',
            //   type: 'slot',
            //   prop: 'photo',
            //   xl: 24,
            //   lg: 24,
            //   md: 24,
            //   sm: 24
            // },
            {
              label: '启用标识',
              text: '',
              type: 'label_switch',
              disabled: false,
              activeValue: '1',
              inactiveValue: '0',
              activeText: '启用',
              inactiveText: '禁用',
              prop: 'status'
            }
          ]
        }
      ],
      mainParams: {}
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
    if (this.form) {
      this.formData = {
        ...this.form
      }
    } else {
      this.$set(this.formData, 'mainName', this.mainName)
      this.$set(this.formData, 'mainCode', this.mainCode)
    }
  },
  methods: {
    businessSubmit(val) {
      this.$set(this.formData, 'mainName', val.mainName)
      this.$set(this.formData, 'mainCode', val.mainCode)
      this.businessVisible = false
    },
    // 正在上传
    handleProgress () {
      this.dialogVisible = true
    },
    // 上传成功
    handleSuccess (response, file, fileList) {
      // console.log(fileList)
      // console.log(response)
      // console.log(file)
      // this.fileList = [...this.fileList, {
      //   ...file,
      //   name: file.name
      // }]
      console.log(response)
      console.log(file)
      this.$set(this.importParams, 'dialogImageUrl', response.data[0])
      this.$set(this.formData, 'enclosureName', file.name)
    },
    // 上传失败
    handleError (err, file) {
      this.$message.error(JSON.parse(err.message).msg)
    },
    // 保存
    async saveFormdata () {
      this.$emit('save', this.formData)
      if (!this.form) {
        const res = await addLookUpSub(this.formData)
        if (res.code === 200) {
          this.$message({
            message: this.$i18n.tc(res.msg),
            type: 'success'
          })
          this.innerVisible = false
          this.$emit('onSubmit')
        }
      } else {
        const res = await putLookUpSub(this.formData)
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
