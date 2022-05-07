<template>
  <div class="container">
    <div class="receiptManagement-container">
      <h3>组件demo展示</h3>
      <i class="iconfont icon-zan" />
      <el-row :gutter="20">
        <el-col :span="4">
          <p>所有菜单下拉menu-select</p>
          <menu-select :visible.sync="menuVisible" :text="menuFilterText" @submit="menuSubmit" />
        </el-col>
        <el-col :span="4">
          <p>网点下拉website-select</p>
          <website-select :visible.sync="popoverVisible" :text="filterText" @submit="websiteSubmit" />
        </el-col>
        <el-col :span="4">
          <p>网点表格website-table</p>
          <el-input v-model="websiteTableValue" placeholder="请选择" clearable @focus="websiteTableClick">
            <i v-if="!websiteTableValue" slot="suffix" class="el-icon-search el-input__icon" />
          </el-input>
        </el-col>
        <el-col :span="4">
          <p>图标表格icon-table</p>
          <el-input v-model="iconTableValue" placeholder="请选择" clearable @focus="iconTableClick">
            <svg-icon v-if="iconTableValue" slot="prefix" :icon-class="iconTableValue" />
            <i v-else slot="suffix" class="el-icon-search el-input__icon" />
          </el-input>
        </el-col>
        <el-col :span="4">
          <p>图标i(css样式可调，font-size调大小，color调颜色)</p>
          <svg-icon icon-class="icon-dianfengshan" />
        </el-col>
        <el-col :span="4">
          <p>城市选择citySelect</p>
          <select-area-tree v-model="cityName" />
        </el-col>
      </el-row>
      <!-- 网点表格 -->
      <website-table v-if="websiteTableVisible" :visible.sync="websiteTableVisible" @submit="websiteTableSubmit" />
      <!-- 图标表格 -->
      <icon-table v-if="iconTableVisible" :visible.sync="iconTableVisible" @submit="iconTableSubmit" />
      <h3>按钮风格展示</h3>
      <el-button type="primary"><i class="el-icon-search" /> 查询</el-button>
      <el-button type="danger"><i class="el-icon-close" /> 清空</el-button>
      <el-button type="success"><i class="el-icon-plus" /> 新增</el-button>
      <el-button type="primary"><i class="el-icon-edit" /> 编辑</el-button>
      <el-button type="danger"><i class="el-icon-delete" /> 批量删除</el-button>
      <el-button type="info"><i class="el-icon-download" /> 导出</el-button>
      <el-button type="info"><i class="el-icon-upload2" /> 导入</el-button>
      <el-button type="warning"><i class="el-icon-folder-checked" /> 审核</el-button>
      <el-button type="success"><i class="el-icon-upload" /> 上传</el-button>
      <el-button type="warning"><i class="el-icon-printer" /> 打印</el-button>
      <el-button type="info"><i class="el-icon-circle-close" /> 关闭</el-button>
      <el-button type="primary"><i class="el-icon-document-checked" /> 保存</el-button>
      <h3>表格内按钮风格展示</h3>
      <el-button icon="el-icon-plus" circle title="新增" type="primary" plain />
      <el-button icon="el-icon-lock" circle title="权限" type="warning" plain />
      <el-button icon="el-icon-view" circle title="查看" type="primary" plain />
      <el-button icon="el-icon-edit" circle title="修改" type="success" plain />
      <el-button icon="el-icon-delete" circle title="删除" type="danger" plain />
      <el-button icon="el-icon-printer" title="打印" type="warning" plain circle />
      <h3>缓存页面的操作状态(keep-alive)</h3>
      1.在切换页签的时候,缓存页面的操作的状态,不刷新页面 <br>
      2.实现方式: 所有vue文件需加上name. name对应route的name
    </div>
  </div>
</template>

<script>
import menuSelect from '@/components/menuSelect'
import websiteSelect from '@/components/websiteSelect'
import websiteTable from '@/components/websiteTable'
import iconTable from '@/components/iconTable'
import selectAreaTree from '@/components/selectAreaTree'
export default {
  name: 'Demo',
  components: {
    menuSelect,
    websiteSelect,
    websiteTable,
    iconTable,
    selectAreaTree
  },
  data() {
    return {
      popoverVisible: false,
      filterText: '',
      websiteTableVisible: false,
      websiteTableValue: '',
      iconTableVisible: false,
      iconTableValue: '',
      cityName: [],
      menuVisible: false,
      menuFilterText: ''
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    menuSubmit(val) {
      console.log('菜单', val)
      this.menuVisible = false
    },
    websiteSubmit(val) {
      console.log('网点', val)
      this.popoverVisible = false
    },
    websiteTableClick() {
      this.websiteTableVisible = true
    },
    websiteTableSubmit(val) {
      console.log('网点', val)
      this.websiteTableValue = val.siteNameChinese
      this.websiteTableVisible = false
    },
    cityTableClick() {
      this.cityTableVisible = true
    },
    cityTableSubmit(val) {
      console.log('城市', val)
      this.cityTableValue = val.cityName
      this.cityTableVisible = false
    },
    iconTableClick() {
      this.iconTableVisible = true
    },
    iconTableSubmit(val) {
      console.log('图标', val)
      this.iconTableValue = val
      this.iconTableVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  padding: 10px;
}
</style>
