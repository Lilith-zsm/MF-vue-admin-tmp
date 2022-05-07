<template>
  <base-dialog
    :title="type === 'add' ? $t('新增菜单') : $t('编辑菜单')"
    :visible.sync="dialogVisible"
    :is-minus-full="false"
  >
    <m-form
      :form-data="form"
      :column="column"
      :rule="rule"
      :save-btn-loading="saveBtnLoading"
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
        <el-input
          v-model="form.icon"
          placeholder=""
          clearable
          @focus="iconTableVisible = true"
        >
          <svg-icon v-if="form.icon" slot="prefix" class="icon" :icon-class="form.icon" />
          <i v-else slot="suffix" class="el-icon-search el-input__icon" />
        </el-input>
      </template>
    </m-form>
    <!-- 图标表格 -->
    <icon-table
      v-if="iconTableVisible"
      :visible.sync="iconTableVisible"
      @submit="iconTableSubmit"
    />
  </base-dialog>
</template>
<script>
import menuSelect from './menuSelect'
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
      // 表单列
      column: [
        {
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
              label: '图标',
              type: 'slot',
              prop: 'icon'
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
              options: []
            },
            {
              label: '系统链接',
              type: 'label_input',
              prop: 'systemUrl',
              hide: false
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
    this.setOptions()
    this.initForm()
  },
  methods: {
    // 获取数据字典
    async setOptions() {
      const res = await this.$api.common.dictionary.getSub({ code: '002' })
      this.siteRankArr = res.data['002']
      this.$Utils.columnFilters(this.column, 'siteRankCode').options = res.data['002']
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
          this.column[0].content.find(it => it.prop === 'systemUrl').hide = false
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
          this.column[0].content.find(it => it.prop === 'systemUrl').hide = true
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
          this.column[0].content.find(it => it.prop === 'systemUrl').hide = true
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
          await this.$api.system.menu.add(this.form).then(() => {
            this.$message.success(this.$i18n.tc('新增成功'))
            this.$emit('finish', this.form)
            this.dialogVisible = false
            this.saveBtnLoading = false
          }).catch(() => {
            this.saveBtnLoading = false
          })
        } else {
          // 编辑
          this.saveBtnLoading = true
          await this.$api.system.menu.edit(this.form).then(() => {
            this.$message.success(this.$i18n.tc('修改成功'))
            this.$emit('finish', this.form)
            this.dialogVisible = false
            this.saveBtnLoading = false
          }).catch(() => {
            this.saveBtnLoading = false
          })
        }
      })
    },
    // 取消按钮
    handleCancel() {
      this.dialogVisible = false
    },
    // 上级菜单
    menuSubmit(val) {
      this.form.parentId = val.menuId
      this.form.parentName = val.menuName
      this.menuVisible = false
    },
    // 图标
    iconTableSubmit(val) {
      this.form.icon = val
      this.iconTableVisible = false
    }
  }
}
</script>
