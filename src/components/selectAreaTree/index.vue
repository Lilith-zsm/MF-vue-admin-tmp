
<template>
  <el-cascader
    ref="myCascader"
    v-model="partyOrganId"
    style="width: 100%"
    :show-all-levels="false"
    :disabled="disabled"
    :class="placeholderClass"
    :placeholder="placeholderVal"
    clearable
    :props="areaprop"
    :options="options"
    popper-class="myCascaderPop"
    @change="handleChange"
  />
</template>

<script>
import { getProvince, getCity, getArea } from '@/api/common'
export default {
  name: 'AreaTree',
  props: {
    value: {
      type: Array,
      default: function() {
        return []
      }
    },
    countryName: {
      type: String,
      default: ''
    },
    countryCode: {
      type: [String, Number],
      default: ''
    },
    disabled: {
      type: Boolean
    }
  },
  data() {
    const _this = this
    return {
      partyOrganId: [],
      options: [],
      areaprop: {
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          setTimeout(() => {
            if (node.level === 0) {
              getProvince(
                { countryCode: _this.countryCode }
              ).then(response => {
                const provinces = response.rows.map((value, i) => ({
                  value: value.provinceName,
                  label: value.provinceName,
                  leaf: node.level >= 1
                }))
                if (provinces.length > 0) {
                  _this.options = provinces
                }
                resolve(provinces)
              })
            }
            if (node.level === 1) {
              getCity({ provinceName: node.value }).then(response => {
                const citys = response.rows.map((value, i) => ({
                  value: value.cityName,
                  label: value.cityName,
                  leaf: node.level >= 2
                }))
                resolve(citys)
              })
            } else if (node.level === 2) {
              getArea({ cityName: node.value }).then(response => {
                const areas = response.rows.map((value, i) => ({
                  value: value.areaName,
                  label: value.areaName,
                  leaf: node.level >= 2
                }))
                resolve(areas)
              })
            }
          }, 100)
        }
      }
    }
  },
  computed: {
    placeholderClass() {
      return this.partyOrganId && this.partyOrganId.length > 0 ? 'myCascader' : ''
    },
    placeholderVal() {
      let data = ''
      if (this.partyOrganId && this.partyOrganId.length) {
        this.partyOrganId.forEach((item, index) => {
          if (item) {
            data = data !== '' ? data + '/' + item : item
          }
        })
      }
      return this.partyOrganId && this.partyOrganId.length > 0 ? data : '请选择'
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        this.partyOrganId = val
      }
    },
    partyOrganId: {
      deep: true,
      immediate: true,
      handler(val) {
        this.$emit('input', val)
      }
    }
  },
  mounted() {

  },
  methods: {
    handleChange(value) {
      // if (value.length === 3) {
      this.$refs.myCascader.dropDownVisible = false
      // }

      this.$emit('changeAreaTree', value)
    },
    initData() {
      this.$refs.myCascader.panel.clearCheckedNodes()
      this.$refs.myCascader.panel.activePath = []
      this.options = []
    }
  }
}
</script>
<style lang="scss" >
.myCascaderPop {
  .el-cascader-menu:nth-child(3) {
    .el-icon-loading {
      display: none;
    }
    .el-radio__inner{
    border: 0px;
    background-color:inherit
    }
    .el-radio__input.is-checked .el-radio__inner{
      background:none
    }
    .el-radio{
      height: 100%;
      width: 150px;
      position: absolute;
    }
  }
}
.myCascader {
  ::-webkit-input-placeholder { /* WebKit browsers */
    color: #606266;
  }
  :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
  color: #606266;
  }
  ::-moz-placeholder { /* Mozilla Firefox 19+ */
  color: #606266;
  }
  :-ms-input-placeholder { /* Internet Explorer 10+ */
  color: #606266;
  }
}
</style>
