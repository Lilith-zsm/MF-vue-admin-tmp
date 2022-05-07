<!--
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-03-24 17:17:47
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-04-29 14:33:36
-->
<template>
  <div class="common-wrap">
    <div class="common-box">
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="title">普通下拉框</div>
          <el-select v-model="value" clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.subName"
              :value="item.subCode"
            />
          </el-select>
        </el-col>
        <el-col :span="4">
          <div class="title">可搜索的下拉框</div>
          <el-select v-model="value" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.subName"
              :value="item.subCode"
            />
          </el-select>
        </el-col>
        <el-col :span="4">
          <div class="title">下拉分页表格</div>
          <table-drop-down />
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="12">
          <div class="title">国家/省/市/区</div>
          <select-area-list
            :country-code="obj.countryCode"
            :province-code="obj.provinceCode"
            :city-code="obj.cityCode"
            :area-code="obj.areaCode"
            @handleChange="handleChange"
          />
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-top: 20px;">
        <el-col :span="6">
          <div class="title">时间选择组件(带快捷键)</div>
          <el-date-picker
            v-model="times"
            type="datetimerange"
            :editable="false"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import tableDropDown from '@/components/tableDropDown'
import selectAreaList from '@/components/selectAreaList'
export default {
  components: {
    tableDropDown,
    selectAreaList
  },
  data() {
    return {
      value: '',
      options: [],
      value4: '',
      obj: {
        countryCode: 'China',
        provinceCode: 'Shanxi Province',
        cityCode: 'linfen',
        areaCode: 'xiangfenxian'
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      times: []
    }
  },
  mounted() {
    this.getSub()
  },
  methods: {
    async getSub() {
      const res = await this.$api.common.dictionary.getSub({ code: '002' })
      this.options = res.data['002']
    },
    handleChange(val) {
      console.log(val)
    }
  }
}
</script>
<style lang="scss" scoped>
.common-box{
  .title{
    margin-bottom: 10px;
  }
}
</style>
