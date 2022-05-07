<template>
  <div>
    <base-dialog
      :title="type === 'add' ? $t('新增菜单') : $t('编辑菜单')"
      :visible.sync="dialogVisible"
      width="800px"
    >
      <m-form
        :form-data="form"
        :column="column"
        :rule="rule"
        :options="options"
        :save-btn-loading="saveBtnLoading"
        :cancel-btn-visible="true"
        :save-btn-visible="true"
        @handleChange="handleChange"
        @handleCancel="handleCancel"
        @handleSave="handleSave"
      >
        <!-- 上级菜单slot -->
        <template v-slot:form-parentId="{}">
          <menu-select
            v-if="menuVisibleRefresh"
            v-model="form.parentId"
            :visible.sync="menuVisible"
            :text="menuFilterText"
            @submit="menuSubmit"
          />
        </template>
        <!-- 图标slot -->
        <template v-slot:form-icon="{}">
          <el-upload
            action=""
            list-type="picture-card"
            name="file"
            :limit="1"
            :file-list="fileList"
            :http-request="handleRequest"
            :before-upload="handleBeforeUpload"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-change="handleLimit"
            :on-exceed="handleOnExceed"
            :on-error="handleOnError"
            :class="{disabled:uploadDisabled}"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </template>
      </m-form>
      <!-- 图标表格 -->
      <icon-table
        v-if="iconTableVisible"
        :visible.sync="iconTableVisible"
        @submit="iconTableSubmit"
      />
    </base-dialog>
    <base-dialog :title="$t('查看')" top="30px" :visible.sync="dialogVisible1">
      <img class="pic-show" :src="form.icon" alt="">
    </base-dialog>
  </div>
</template>
<script>
import * as _api from '@/api/system/menu'
import { getDictionary } from '@/api/common'
import menuSelect from '@/components/menuSelect'
import iconTable from '@/components/iconTable'

export default {
  components: {
    menuSelect,
    iconTable
  },
  props: {
    visible: Boolean,
    type: {
      type: String,
      default: () => {
        return 'add'
      }
    },
    tType: {
      type: Number,
      default: () => {
        return 1
      }
    },
    currentMenu: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      dialogVisible1: false,
      uploadDisabled: false,
      fileList: [],
      saveBtnLoading: false,
      iconTableVisible: false,
      menuVisibleRefresh: false,
      menuVisible: false,
      siteRankArr: [],
      menuFilterText: '',
      // 表单数据
      form: {
        parentId: null,
        parentName: null,
        menuType: null,
        type: null,
        status: null,
        component: null,
        createByName: null,
        createTime: null,
        dataScope: null,
        icon: null,
        isFrame: null,
        menuId: null,
        menuName: null,
        orderNum: null,
        children: [],
        params: {},
        path: null,
        componentName: null,
        perms: null,
        remark: null,
        siteRankCode: null,
        updateByName: null,
        updateTime: null,
        visible: null
      },
      // 表单参数
      options: {
        isScroller: true
      },
      // 表单列
      column: [
        {
          title: '菜单信息',
          content: [
            {
              label: '上级菜单',
              type: 'slot',
              prop: 'parentId'
            },
            {
              label: '菜单类型',
              type: 'label_radio_group',
              prop: 'menuType',
              disabled: false,
              change: true,
              xl: 16,
              lg: 16,
              md: 16,
              sm: 16,
              options: [
                { value: 'M', label: this.$i18n.tc('目录') },
                { value: 'C', label: this.$i18n.tc('菜单') },
                { value: 'F', label: this.$i18n.tc('按钮') }
              ]
            },
            {
              label: '显示排序',
              type: 'label_input_number',
              prop: 'orderNum',
              min: 0
            },
            {
              label: '名称',
              type: 'label_input',
              prop: 'menuName'
            },
            {
              label: '组件名称',
              type: 'label_input',
              prop: 'componentName',
              hide: false
            },
            {
              label: '路由名称',
              type: 'label_input',
              prop: 'path',
              hide: false
            },
            {
              label: '权限标识',
              type: 'label_input',
              prop: 'perms',
              maxlength: '50'
            },
            {
              label: '组件路径',
              type: 'label_input',
              prop: 'component',
              hide: false
            },
            {
              label: '机构级别',
              type: 'label_select',
              prop: 'siteRankCode',
              labelName: 'subName',
              labelVal: 'subCode',
              options: []
            },
            {
              label: '菜单状态',
              type: 'label_radio_group',
              prop: 'status',
              hide: false,
              options: [
                { value: '0', label: this.$i18n.tc('启用') },
                { value: '1', label: this.$i18n.tc('停用') }
              ]
            },
            {
              label: '显示状态',
              type: 'label_radio_group',
              prop: 'visible',
              hide: false,
              options: [
                { value: '0', label: this.$i18n.tc('显示') },
                { value: '1', label: this.$i18n.tc('隐藏') }
              ]
            },
            {
              label: '图标',
              type: 'slot',
              prop: 'icon',
              height: '176px',
              xl: 24,
              lg: 24,
              md: 24,
              sm: 24
            }
          ]
        }
      ]
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
    },
    rule() {
      return {
        parentId: [
          { required: true, message: '请选择上级菜单', trigger: 'change' }
        ],
        menuType: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        menuName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入路由名称', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '请选择显示排序', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择菜单状态', trigger: 'change' }
        ],
        visible: [
          { required: true, message: '请选择显示状态', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    // this.setOptions()
    this.initForm()
  },
  methods: {
    // 获取数据字典
    async setOptions() {
      getDictionary({ code: '002' }).then(res => {
        this.siteRankArr = res.data['002']
        this.$Utils.columnFilters(this.column, 'siteRankCode').options = res.data['002']
      })
    },
    // 初始化表单值集
    async initForm() {
      if (this.type === 'add') {
        // 新增
        if (this.currentMenu) {
          this.form.parentId = this.currentMenu.menuId
          this.form.parentName = this.currentMenu.menuName
          this.form.siteRankCode = this.siteRankArr.length ? this.siteRankArr[0]['subCode'] : ''
          this.menuFilterText = this.currentMenu.menuName
          this.form.type = this.tType
        }
        this.$nextTick(() => {
          this.form.menuType = 'M'// 类型（M目录 C菜单 F按钮）
          this.form.status = '0'// 菜单状态（0显示 1隐藏）
          this.form.visible = '0'// 显示状态（0显示 1隐藏）
          this.handleChange('menuType')
        })
        this.menuVisibleRefresh = true
      } else {
        // 编辑
        const { data } = await this.$api.system.menu.getInfo(this.currentMenu.menuId)
        this.form = data
        if (this.form.icon) {
          this.fileList = [{ name: '图标', url: this.form.icon }]
          this.uploadDisabled = true
        }
        this.handleChange('menuType')
        this.menuFilterText = data.parentName
        this.menuVisibleRefresh = true
      }
    },
    handleChange(prop) {
      switch (prop) {
      case 'menuType':
        if (this.form.menuType === 'M') {
          // 目录
          this.column[0].content.find(it => it.prop === 'menuName').label = this.$i18n.tc('目录名称')
          this.column[0].content.find(it => it.prop === 'icon').label = this.$i18n.tc('目录图标')
          this.column[0].content.find(it => it.prop === 'icon').hide = false
          this.column[0].content.find(it => it.prop === 'componentName').hide = true
          this.column[0].content.find(it => it.prop === 'path').hide = false
          this.column[0].content.find(it => it.prop === 'component').hide = true
          this.column[0].content.find(it => it.prop === 'siteRankCode').hide = false
          this.column[0].content.find(it => it.prop === 'status').hide = false
          this.column[0].content.find(it => it.prop === 'visible').hide = false
        } else if (this.form.menuType === 'C') {
          // 菜单
          this.column[0].content.find(it => it.prop === 'menuName').label = this.$i18n.tc('菜单名称')
          this.column[0].content.find(it => it.prop === 'icon').label = this.$i18n.tc('菜单图标')
          this.column[0].content.find(it => it.prop === 'icon').hide = false
          this.column[0].content.find(it => it.prop === 'componentName').hide = false
          this.column[0].content.find(it => it.prop === 'componentName').rules = { required: true, message: this.$i18n.tc('请输入组件名称'), trigger: 'blur' }
          this.column[0].content.find(it => it.prop === 'path').hide = false
          this.column[0].content.find(it => it.prop === 'component').hide = false
          this.column[0].content.find(it => it.prop === 'component').rules = { required: true, message: this.$i18n.tc('请输入组件路径'), trigger: 'blur' }
          this.column[0].content.find(it => it.prop === 'siteRankCode').hide = false
          this.column[0].content.find(it => it.prop === 'status').hide = false
          this.column[0].content.find(it => it.prop === 'visible').hide = false
        } else {
          // 功能
          this.column[0].content.find(it => it.prop === 'menuName').label = this.$i18n.tc('功能名称')
          this.column[0].content.find(it => it.prop === 'icon').hide = true
          this.column[0].content.find(it => it.prop === 'componentName').hide = true
          this.column[0].content.find(it => it.prop === 'path').hide = true
          this.column[0].content.find(it => it.prop === 'component').hide = true
          this.column[0].content.find(it => it.prop === 'siteRankCode').hide = true
          this.column[0].content.find(it => it.prop === 'status').hide = true
          this.column[0].content.find(it => it.prop === 'visible').hide = true
        }
        break
      }
    },
    // 处理表单
    dealData() {
      return new Promise((resolve, reject) => {
        if (this.form.siteRankCode) {
          this.form.siteRankName = this.$Utils.matchValue(this.siteRankArr, this.form.siteRankCode, 'subCode', 'subName')
        }
        if (this.form.menuType === 'F') {
          // 如果是功能，需要把归属于目录和菜单的值去掉。
          this.form.icon = ''
          this.form.componentName = ''
          this.form.path = ''
          this.form.component = ''
          this.form.siteRankCode = ''
          this.form.status = ''
          this.form.visible = ''
        }
        resolve()
      })
    },
    // 保存表单
    async handleSave() {
      this.dealData().then(async () => {
        if (this.type === 'add') {
          // 新增
          this.saveBtnLoading = true
          try {
            await this.$api.system.menu.add(this.form)
            this.$message.success(this.$i18n.tc('新增成功'))
            this.$emit('finish', true)
            this.dialogVisible = false
          } finally {
            this.saveBtnLoading = false
          }
        } else {
          // 编辑
          this.saveBtnLoading = true
          try {
            await this.$api.system.menu.edit(this.form)
            this.$message.success(this.$i18n.tc('修改成功'))
            this.$emit('finish', true)
            this.dialogVisible = false
          } finally {
            this.saveBtnLoading = false
          }
        }
      })
    },
    // 取消按钮
    handleCancel() {
      this.dialogVisible = false
    },
    // 上级菜单
    menuSubmit(val) {
      console.log('上级菜单', val)
      this.form.parentId = val.menuId
      this.form.parentName = val.menuName
      this.menuVisible = false
    },
    // 图标
    iconTableSubmit(val) {
      console.log('图标', val)
      this.form.icon = val
      this.iconTableVisible = false
    },
    // 上传文件请求
    handleRequest(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      _api.uploadFile(formData).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: this.$i18n.tc('文件上传成功')
          })
          this.form = {
            ...this.form,
            icon: res.data[0]
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
    // 文件超出个数限制时的钩子
    handleOnExceed(files, fileList) {
      this.$message({
        message: this.$i18n.tc('仅支持上传一张图片！'),
        type: 'warning'
      })
    },
    // 上传图片之前
    handleBeforeUpload(file) {
      var fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
      var fileSize = file.size / 1024 / 1024 > 1
      if (fileType !== 'jpg' && fileType !== 'png') {
        this.$message.error(this.$i18n.tc('只支持jpg, png格式!'))
        return false
      }
      if (fileSize) {
        this.$message.error(this.$i18n.tc('图片大小不能超过1M!'))
        return false
      }
      return true
    },
    // 图片蒙层查看图标
    handlePictureCardPreview(file) {
      this.form.icon = file.url
      this.dialogVisible1 = true
    },
    // 图片蒙层删除图标
    handleRemove(file) {
      this.form.icon = ''
      this.uploadDisabled = false
    },
    handleLimit(file, fileList) {
      if (fileList.length >= 1) {
        this.uploadDisabled = true
      }
    },
    handleOnError() {
      this.$message.error(this.$i18n.tc('图片上传失败，请重新上传！'))
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.disabled .el-upload--picture-card {
  display: none!important;
}
</style>
