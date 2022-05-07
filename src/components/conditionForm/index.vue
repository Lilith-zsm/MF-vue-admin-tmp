<template>
  <div class="condition-form" :style="{'padding-right': showCollapse ? '60px' : '10px'}">
    <el-form
      ref="form"
      :model="form"
      :show-message="false"
      size="mini"
      label-position="top"
      @keyup.enter.native="handleEnter"
      @submit.native.prevent
    >
      <el-row :gutter="20">
        <el-col
          v-for="(item,index) in formData"
          :key="`searchForm${index}`"
          :xl="formProperty.xl || item.xl || 4"
          :lg="formProperty.lg || item.lg || 4"
          :md="formProperty.md || item.md || 6"
          :sm="formProperty.sm || item.sm || 6"
          :offset="item.offset || 0"
        >
          <el-form-item
            :label="$t(item.label)"
            :prop="item.prop"
            :required="item.required"
            :style="{'height': item.inputType !== 'textarea' ? (item.rowSpan || 1) * 56 + 'px' : ''}"
          >
            <!-- label_input  复合型input -->
            <el-input
              v-if="item.type === 'label_input'"
              v-model="form[item.prop]"
              :type="item.inputType"
              :disabled="item.disabled"
              :rows="item.collapseRows || 2"
              :placeholder="item.placeholder || $t('请输入')"
              clearable
            >
              <template v-if="item.slotType" :slot="item.slotType">
                {{ item.slotText }}
              </template>
              <el-select
                v-if="item.options"
                :slot="item.slotType"
                v-model="item.selectd"
                :placeholder="item.placeholder || $t('请选择')"
                :style="`width: ${item.width ? item.width : '100px'}`"
                @change="item.handleChange ? item.handleChange(item.selectd) : ''"
              >
                <el-option
                  v-for="o in item.options"
                  :key="o[item.labelVal] || o.value || o.subCode"
                  :value="o[item.labelVal] || o.value || o.subCode"
                  :label="$t(o[item.labelName] || o.label || o.subName)"
                />
              </el-select>
            </el-input>
            <!-- label_input_number -->
            <el-input-number
              v-if="item.type === 'label_input_number'"
              v-model="form[item.prop]"
              :precision="item.precision"
              :step="item.step"
              :disabled="item.disabled"
              :max="item.max"
              :min="item.min || 0"
              :controls="item.controls"
              :controls-position="item.controlsPosition || 'right'"
              :placeholder="item.placeholder || $t('请输入')"
              @blur="item.handleBlur ? item.handleBlur(item): ''"
            />
            <!-- label_input_clearable  用于公共组件输入框 -->
            <input-clearable
              v-if="item.type === 'label_input_clearable'"
              v-model="form[item.prop]"
              :disabled="item.disabled"
              @clear="item.onClear ? item.onClear() : ''"
              @click="item.onClick ? item.onClick(item) : ''"
            />
            <!-- label_select -->
            <el-select
              v-if="item.type === 'label_select'"
              v-model="form[item.prop]"
              :disabled="item.disabled"
              :multiple="item.multiple"
              :placeholder="item.placeholder ? $t(item.placeholder) : $t('请选择')"
              clearable
              @change="item.handleChange ? item.handleChange(form[item.prop],item) : ''"
            >
              <el-option
                v-for="o in item.options"
                :key="o[item.labelVal] || o.value || o.subCode"
                :value="o[item.labelVal] || o.value || o.subCode"
                :label="$t(o[item.labelName] || o.label || o.subName)"
              />
            </el-select>
            <!-- label_date_picker -->
            <el-date-picker
              v-if="item.type === 'label_date_picker'"
              v-model="form[item.prop]"
              :type="item.dateType || 'datetimerange'"
              :disabled="item.disabled"
              range-separator="~"
              :start-placeholder="$t(item.startPlaceholder || '开始日期')"
              :end-placeholder="$t(item.endPlaceholder || '结束日期')"
              :picker-options="item.pickerOptions"
              :unlink-panels="item.unlinkPanels || true"
              :value-format="item.format ? item.format : 'yyyy-MM-dd HH:mm:ss'"
              :clearable="item.clearable ? item.clearable : false"
              popper-class="condition-picker"
              :default-time="['00:00:00', '23:59:59']"
            />
            <!-- time-picker -->
            <el-time-picker
              v-if="item.type === 'label_time_picker'"
              v-model="form[item.prop]"
              is-range
              :value-format="item.format"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
              :clearable="false"
            />
            <!-- label_checkbox -->
            <el-checkbox
              v-if="item.type == 'label_checkbox'"
              v-model="form[item.prop]"
              :true-label="item.trueLabel"
              :false-label="item.falseLabel"
              :disabled="item.disabled"
              @change="item.handleChange?item.handleChange():''"
            />
            <span
              v-if="item.type == 'label_checkbox' && item.text"
              style="margin-left:10px"
            >{{ $t(item.text) }}</span>
            <!--
                label_radios 单选按钮组
                label_radio_input 输入框按钮组
                label_radio_date_picker 日期按钮组
                label_radio_input_clearable 弹窗组件按钮组
              -->
            <template
              v-if="item.type === 'label_radios' ||
                item.type === 'label_radio_date_picker' ||
                item.type === 'label_radio_input' ||
                item.type === 'label_radio_input_clearable'"
            >
              <div
                slot="label"
                :style="{'margin-top': item.type === 'label_radios' ? '28px' : ''}"
              >
                <el-radio-group
                  v-model="item.selectType"
                  @change="item.handleChange ? item.handleChange(item) : ''"
                >
                  <el-radio
                    v-for="o in item.options"
                    :key="o[item.labelVal] || o.value"
                    :label="$t(o[item.labelVal] || o.value)"
                  >
                    {{ $t(o[item.labelName] || o.label) }}
                  </el-radio>
                </el-radio-group>
              </div>
              <!-- label_radio_date_picker -->
              <el-date-picker
                v-if="item.type === 'label_radio_date_picker'"
                v-model="form[item.prop]"
                :type="item.dateType || 'datetimerange'"
                :disabled="item.disabled"
                range-separator="~"
                :start-placeholder="$t(item.startPlaceholder || '开始日期')"
                :end-placeholder="$t(item.endPlaceholder || '结束日期')"
                :picker-options="item.pickerOptions"
                :unlink-panels="item.unlinkPanels || true"
                :value-format="item.format ? item.format : 'yyyy-MM-dd HH:mm:ss'"
                :clearable="item.clearable ? item.clearable : false"
                popper-class="condition-picker"
                :default-time="['00:00:00', '23:59:59']"
              />
              <!-- label_radio_input_clearable 用于公共组件输入框-->
              <input-clearable
                v-if="item.type === 'label_radio_input_clearable'"
                v-model="form[item.prop]"
                :disabled="item.disabled"
                @clear="item.onClear ? item.onClear() : ''"
                @click="item.onClick ? item.onClick() : ''"
              />
              <!-- label_radio_input 复合型input-->
              <el-input
                v-if="item.type === 'label_radio_input'"
                v-model="form[item.prop]"
                :type="item.inputType"
                :disabled="item.disabled"
                :rows="item.collapseRows || 2"
                :placeholder="item.placeholder || $t('请输入')"
                clearable
              >
                <template v-if="item.slotType" :slot="item.slotType">
                  {{ item.slotText }}
                </template>
                <el-select
                  v-if="item.options"
                  :slot="item.slotType"
                  v-model="item.selectd"
                  :placeholder="item.placeholder || $t('请选择')"
                  :style="`width: ${item.width ? item.width : '100px'}`"
                  @change="item.handleChange ? item.handleChange(item.selectd) : ''"
                >
                  <el-option
                    v-for="o in item.options"
                    :key="o[item.labelVal] || o.value|| o.subCode"
                    :value="o[item.labelVal] || o.value|| o.subCode"
                    :label="$t(o[item.labelName] || o.label|| o.subName)"
                  />
                </el-select>
              </el-input>
            </template>
          </el-form-item>
        </el-col>
        <div v-if="!hideBtn" class="btnBox">
          <el-button type="primary" :loading="loading" icon="el-icon-search" @click="handleSearch">查询</el-button>
          <el-button type="info" icon="el-icon-close" @click="handleReset">重置</el-button>
        </div>
      </el-row>
    </el-form>
    <template v-if="showCollapse">
      <span v-if="isCollapse" class="spread" @click="handleCollapse"><i class="el-icon-arrow-down" /> {{ $t('展开') }}</span>
      <span v-if="!isCollapse" class="spread" @click="handleCollapse"><i class="el-icon-arrow-up" /> {{ $t('收起') }}</span>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Object,
      required: true
    },
    formData: {
      type: Array,
      default: function () {
        return []
      }
    },
    formProperty: {
      type: Object,
      default: function () {
        return {}
      }
    },
    hideBtn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {},
      isCollapse: true,
      showCollapse: false,
      maxHeight: 118
    }
  },
  computed: {
    loading() {
      return this.$parent.tableLoading || this.$parent.$parent.$parent.tableLoading
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        this.form = val
      }
    },
    form: {
      deep: true,
      handler(val) {
        this.$emit('input', val)
      }
    }
  },
  mounted() {
    this.getFormHeight()
  },
  methods: {
    // 展开/收起事件
    handleCollapse() {
      this.isCollapse = !this.isCollapse
      this.$emit('handleCollapse', this.isCollapse)
      // 触发页面表格计算高度
      this.$nextTick(() => {
        const _table = this.$parent.$children.find(it => it.$refs['commonTable'])
        if (_table && _table.options) {
          // 获取表格高度
          _table.$data.tableHeight = _table.options.height || this.$Utils.setTableHeight(_table.options.cusHeight)
        }
      })
    },
    getFormHeight() {
      this.$nextTick(() => {
        const formHeight = this.$refs.form.$el.offsetHeight
        if (formHeight > this.maxHeight) {
          this.showCollapse = true
        }
      })
    },
    handleEnter() {
      this.$emit('handleEnter')
    },
    handleSearch() {
      this.$emit('handleSearch')
    },
    handleReset() {
      for (const i in this.form) {
        this.form[i] = ''
      }
      this.$emit('handleReset')
    }
  }
}
</script>
<style lang="scss" scoped>
.condition-form{
  background-color: #fff;
  padding: 5px 0 10px 10px;
  position: relative;
  /deep/ .el-form-item {
    margin-bottom: 3px;
  }
  /deep/ .el-textarea__inner{
    resize:none!important
  }
  /deep/.el-input-number .el-input__inner {
    text-align: left;
  }
  .spread {
    font-size: 14px;
    color: #005dc0;
    cursor: pointer;
    position: absolute;
    right: 15px;
    top: 10px;
  }
  .searchBtn /deep/.el-form-item__label{
    height: 28px;
  }
  .btnBox{
    display: inline-block;
    box-sizing: border-box;
    padding-left: 10px;
    padding-top: 28px;
    height: 56px;
  }
}
</style>
<style lang="scss">
.condition-picker {
  .el-picker-panel__footer {
      .el-button:first-child {
          display: none
      }
  }
}
</style>
