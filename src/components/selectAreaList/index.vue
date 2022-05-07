<!--
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-03-30 14:24:49
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-03-30 16:23:11
-->
<template>
  <el-row :gutter="10">
    <el-col :span="6">
      <el-select v-model="countryValue" :loading="countryLoading" filterable clearable placeholder="请选择国家" @change="changeCountry">
        <el-option
          v-for="(item,index) in countryOptions"
          :key="item.countryCode + index"
          :label="item.countryName"
          :value="item.countryCode"
        />
      </el-select>
    </el-col>
    <el-col :span="6">
      <el-select v-model="provinceValue" :loading="provinceLoading" filterable clearable placeholder="请选择省份" @change="changeProvince">
        <el-option
          v-for="(item,index) in provinceOptions"
          :key="item.provinceCode + index"
          :label="item.provinceName"
          :value="item.provinceCode"
        />
      </el-select>
    </el-col>
    <el-col :span="6">
      <el-select v-model="cityValue" :loading="cityLoading" filterable clearable placeholder="请选择城市" @change="changeCity">
        <el-option
          v-for="(item,index) in cityOptions"
          :key="item.cityCode + index"
          :label="item.cityName"
          :value="item.cityCode"
        />
      </el-select>
    </el-col>
    <el-col :span="6">
      <el-select v-model="areaValue" :loading="areaLoading" filterable clearable placeholder="请选择区县" @change="changeArea">
        <el-option
          v-for="(item,index) in areaOptions"
          :key="item.areaCode + index"
          :label="item.areaName"
          :value="item.areaCode"
        />
      </el-select>
    </el-col>
  </el-row>
</template>
<script>
import _ from 'lodash'
export default {
  props: {
    countryCode: {
      type: String,
      default: ''
    },
    provinceCode: {
      type: String,
      default: ''
    },
    cityCode: {
      type: String,
      default: ''
    },
    areaCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      countryOptions: [],
      provinceOptions: [],
      cityOptions: [],
      areaOptions: [],
      countryValue: '',
      provinceValue: '',
      cityValue: '',
      areaValue: '',
      countryLoading: false,
      provinceLoading: false,
      cityLoading: false,
      areaLoading: false,
      data: {}
    }
  },
  mounted() {
    this.getCountry()
    this.countryValue = this.countryCode
    this.provinceValue = this.provinceCode
    this.cityValue = this.cityCode
    this.areaValue = this.areaCode
  },
  methods: {
    async getCountry() {
      this.countryLoading = true
      try {
        const res = await this.$api.common.provinceCityDistrict.getCountry()
        this.countryOptions = res.rows
        if (this.countryValue) {
          this.getProvince(this.countryValue)
        }
        this.countryLoading = false
      } catch {
        this.countryLoading = false
      }
    },
    async getProvince(val) {
      this.provinceLoading = true
      try {
        const res = await this.$api.common.provinceCityDistrict.getProvince({ countryCode: val })
        this.provinceOptions = res.rows
        if (this.provinceValue) {
          this.getCity(this.provinceValue)
        }
        this.provinceLoading = false
      } catch {
        this.provinceLoading = false
      }
    },
    async getCity(val) {
      this.cityLoading = true
      try {
        const res = await this.$api.common.provinceCityDistrict.getCity({ provinceCode: val })
        this.cityOptions = res.rows
        if (this.cityValue) {
          this.getArea(this.cityValue)
        }
        this.cityLoading = false
      } catch {
        this.cityLoading = false
      }
    },
    async getArea(val) {
      this.areaLoading = true
      try {
        const res = await this.$api.common.provinceCityDistrict.getArea({ cityCode: val })
        this.areaOptions = res.rows
        this.areaLoading = false
      } catch {
        this.areaLoading = false
      }
    },
    changeCountry(val) {
      this.clearOptionsValue(0)
      this.getProvince(val)
      this.data.countryCode = val
      this.data.countryName = this.countryOptions.find(item => item.countryCode === val).countryName
      this.handleChange()
    },
    changeProvince(val) {
      this.clearOptionsValue(1)
      this.getCity(val)
      this.data.provinceCode = val
      this.data.provinceName = this.provinceOptions.find(item => item.provinceCode === val).provinceName
      this.handleChange()
    },
    changeCity(val) {
      this.clearOptionsValue(2)
      this.getArea(val)
      this.data.cityCode = val
      this.data.cityName = this.cityOptions.find(item => item.cityCode === val).cityName
      this.handleChange()
    },
    changeArea(val) {
      this.data.areaCode = val
      this.data.areaName = this.areaOptions.find(item => item.areaCode === val).areaName
      this.handleChange()
    },
    handleChange() {
      this.$emit('handleChange', this.data)
    },
    clearOptionsValue(n) {
      const keys = ['province', 'city', 'area']
      _.drop(keys, n).forEach(i => {
        this[`${i}Options`] = []
        this[`${i}Value`] = ''
      })
    }
  }
}
</script>
