<template>
  <div id="my_form">
    <el-form
      ref="form"
      v-loading="loading"
      v-bind="$attrs"
      :label-position="options.labelPosition"
      :label-width="options.labelWidth"
      :model="formData"
      :rules="langRule"
      :disabled="disabled"
      size="mini"
      v-on="$listeners"
    >
      <div
        :class="{'form-scroller':options.isScroller}"
        :style="{
          'height': options.isScroller ? options.scrollHeight : '', maxHeight: options.isScroller && !options.scrollHeight ? (options.scrollMaxHeight || 'calc(100vh - 260px)') : ''
        }"
      >
        <div v-for="(block,index) in column" :key="index" class="block" :class="{'border': block.title}">
          <h3 v-if="block.title" class="header">{{ $t(`${block.title}`) }}</h3>
          <div class="right-btn"><slot :name="block.controlBtn" /></div>
          <el-row v-if="block.content" :gutter="20">
            <template
              v-for="(item,key) in block.content"
            >
              <el-col
                v-if="!item.hide"
                :key="key"
                style="margin-bottom:10px;"
                :xl="item.xl || item.span || options.xl || 6"
                :lg="item.lg || item.span || options.lg || 8"
                :md="item.md || item.span || options.md || 8"
                :sm="item.sm || item.span || options.sm || 12"
              >
                <el-form-item
                  :ref="item.prop"
                  :label="item.label ? $t(`${item.label}`) : ''"
                  :prop="item.prop"
                  :rules="item.rules"
                  :required="item.required"
                  :style="{height: item.height || formItemHeight}"
                >
                  <!-- input -->
                  <el-input
                    v-if="item.type == 'label_input'"
                    v-model="formData[item.prop]"
                    clearable
                    :maxlength="item.maxlength"
                    :type="item.genre?item.genre:'text'"
                    :disabled="block.disabled || item.disabled"
                    :placeholder="item.placeholder ? $t(`${item.placeholder}`):item.disabled ||disabled?'':$t('请输入')"
                    :readonly="item.readonly"
                    :show-word-limit="item.showWordLimit"
                    :rows="item.rows ? item.rows : 2"
                    :autosize="item.autosize ? item.autosize : false"
                    @blur="item.handleBlur ? item.handleBlur(item.prop): ''"
                    @clear="item.handleClear ? item.handleClear(item.prop):''"
                    @click.native="item.handleClick?item.handleClick(item.prop):''"
                  >
                    <template :slot="item.slot">{{ item.html }}</template>
                  </el-input>
                  <!-- input-clearable -->
                  <input-clearable
                    v-if="item.type === 'label_input_clearable'"
                    v-model="formData[item.prop]"
                    :disabled="block.disabled || item.disabled"
                    @clear="item.handleClear ? item.handleClear() : ''"
                    @click="item.handleClick ? item.handleClick() : ''"
                  />
                  <!-- select -->
                  <el-select
                    v-if="item.type == 'label_select'"
                    v-model="formData[item.prop]"
                    :disabled="block.disabled || item.disabled"
                    :multiple="item.multiple"
                    clearable
                    :filterable="item.filterable || true"
                    :placeholder="item.placeholder ? $t(`${item.placeholder}`) : $t('请选择')"
                    @change="item.handleChange ? item.handleChange(item.prop, item, $event):''"
                    @clear="item.handleClear ? item.handleClear(item.prop):''"
                  >
                    <el-option
                      v-for="(opt,oindex) in item.options"
                      :key="oindex"
                      :label="$t(`${opt[item['labelName'] || 'label'] || opt['subName']}`)"
                      :value="opt[item['labelVal'] || 'value'] || opt['subCode']"
                    />
                  </el-select>
                  <!-- cascader -->
                  <el-cascader
                    v-if="item.type == 'label_cascader'"
                    v-model="formData[item.prop]"
                    :disabled="block.disabled || item.disabled"
                    :options="item.options"
                    :props="item.props"
                    @change="item.change?handleChange(item.prop):''"
                  >
                    <template slot-scope="{ node, data }">
                      <slot v-if="item.slot" :name="`form-${item.prop}`" :node="node" :data="data" />
                      <span v-else>{{ $t(data[item.props.label]) }}</span>
                    </template>
                  </el-cascader>
                  <!-- date-picker -->
                  <el-date-picker
                    v-if="item.type == 'label_date_picker'"
                    v-model="formData[item.prop]"
                    :type="item.dateType || 'date'"
                    clearable
                    :picker-options="item.pickerOptions"
                    :placeholder="item.placeholder ? $t(`${item.placeholder}`):$t('请选择')"
                    :disabled="block.disabled || item.disabled"
                    :range-separator="$t('至')"
                    :start-placeholder="$t('开始日期')"
                    :end-placeholder="$t('结束日期')"
                    :value-format="item.format || 'yyyy-MM-dd'"
                    :default-time="item.dateType==='daterange' && ['00:00:00', '23:59:59']"
                    @change="item.change ? handleChange(item.prop):''"
                  />
                  <!-- input_number -->
                  <el-input-number
                    v-if="item.type == 'label_input_number'"
                    v-model="formData[item.prop]"
                    :precision="item.precision"
                    :step="item.step"
                    :disabled="block.disabled || item.disabled"
                    :max="item.max"
                    :min="item.min || 0"
                    :controls="item.controls"
                    :controls-position="item.controlsPosition || 'right'"
                    :placeholder="item.placeholder ? $t(`${item.placeholder}`):$t('请输入')"
                    @change="item.handleChange?item.handleChange(item.prop):''"
                    @blur="item.handleBlur ? item.handleBlur(item.prop): ''"
                  />
                  <!-- number -->
                  <el-input
                    v-if="item.type == 'label_number'"
                    v-model.number="formData[item.prop]"
                    type="number"
                    :disabled="block.disabled || item.disabled"
                    :placeholder="item.placeholder ? $t(`${item.placeholder}`):$t('请输入')"
                    @blur="item.handleBlur ? item.handleBlur(item.prop) : ''"
                    @input="item.handleInput?item.handleInput(item.prop):''"
                    @mousewheel.native.prevent
                  />
                  <!-- checkbox -->
                  <el-checkbox
                    v-if="item.type == 'label_checkbox'"
                    v-model="formData[item.prop]"
                    :true-label="item.trueLabel"
                    :false-label="item.falseLabel"
                    :disabled="block.disabled || item.disabled"
                    @change="item.change ? handleChange(item.prop):''"
                  >
                    <div>{{ item.text ? $t(`${item.text}`) : '' }}</div>
                  </el-checkbox>
                  <!-- checkbox_group -->
                  <el-checkbox-group
                    v-if="item.type === 'label_checkbox_group'"
                    v-model="formData[item.prop]"
                    :disabled="block.disabled || item.disabled"
                    @change="item.change ? handleChange(item.prop):''"
                  >
                    <el-checkbox
                      v-for="(opt,oindex) in item.options"
                      :key="oindex"
                      :label="opt[item['labelVal'] || 'value'] || opt['subCode']"
                    >
                      {{ $t(`${opt[item['labelName'] || 'label'] || opt['subName']}`) }}
                    </el-checkbox>
                  </el-checkbox-group>
                  <!-- switch -->
                  <el-switch
                    v-if="item.type === 'label_switch'"
                    v-model="formData[item.prop]"
                    :active-value="item.activeValue"
                    :inactive-value="item.inactiveValue"
                    :active-text="$t(item.activeText)"
                    :inactive-text="$t(item.inactiveText)"
                    :active-color="item.activeColor"
                    :inactive-color="item.inactiveColor"
                    :disabled="block.disabled || item.disabled"
                    @change="item.change?handleChange(item.prop):''"
                  />
                  <!-- radio_group -->
                  <el-radio-group
                    v-if="item.type === 'label_radio_group'"
                    v-model="formData[item.prop]"
                    :disabled="block.disabled || item.disabled"
                    @change="item.change ? handleChange(item.prop):''"
                  >
                    <el-radio
                      v-for="(opt,oindex) in item.options"
                      :key="oindex"
                      :label="opt[item['labelVal'] || 'value'] || opt['subCode']"
                    >
                      {{ $t(`${opt[item['labelName'] || 'label'] || opt['subName']}`) }}
                    </el-radio>
                  </el-radio-group>
                  <!-- upload_img -->
                  <upload-img
                    v-if="item.type === 'label_upload_img'"
                    :fixed-number="item.fixedNumber"
                    :output-type="item.outputType"
                    :auto-crop-width="item.autoCropWidth"
                    :auto-crop-height="item.autoCropHeight"
                    :images="formData[item.prop]"
                    @handleUpload="(val) => {
                      $set(formData,item.prop, val);
                      clearValidate(item.prop);
                      item.handleUpload ? item.handleUpload(val) : '';
                    }"
                  />
                  <!-- slot -->
                  <template v-if="item.type === 'slot'">
                    <slot :name="'form-' + item.prop" />
                  </template>
                </el-form-item>
              </el-col>
            </template>
          </el-row>
          <!-- 表格 -->
          <div v-if="block.tableColumn">
            <el-button
              v-if="block.tableOption.addBtnVisible"
              size="mini"
              type="primary"
              class="con-margin-b con-margin-t"
              @click="block.tableOption.onAddTableLine()"
            >
              {{ $t('添加') }}
            </el-button>
            <el-table
              :data="formData[block.tableOption.tableKey]"
              :height="block.tableOption.tableHeight"
              border
              class="con-margin-b"
              style="width: 100%;"
            >
              <template v-for="(tableItem,tableIndex) in block.tableColumn">
                <!-- 不带分页序号列 -->
                <el-table-column
                  v-if="tableItem.prop === 'ids'"
                  :key="tableItem.prop"
                  :prop="tableItem.prop"
                  :label="$t(`${tableItem.label || '序号'}`)"
                  :fixed="tableItem.fixed || 'left'"
                  type="index"
                  width="50"
                />
                <el-table-column
                  v-if="tableItem.prop !== 'ids' && !tableItem.hide"
                  :key="tableIndex"
                  :label="tableItem.label"
                  :width="tableItem.width"
                  :fixed="tableItem.fixed"
                >
                  <template slot-scope="scope">
                    <!-- input -->
                    <el-input
                      v-if="tableItem.type === 'label_input'"
                      :ref="`table_${tableItem.prop}_${scope.$index}`"
                      v-model="scope.row[tableItem.prop]"
                      :placeholder="tableItem.placeholder ? $t(`${tableItem.placeholder}`):$t('请输入')"
                      :clearable="tableItem.clearable || true"
                      :disabled="tableItem.disabled"
                      @blur="tableItem.handleBlur?tableItem.handleBlur(scope.row[tableItem.prop], scope): ''"
                      @clear="tableItem.handleClear ? tableItem.handleClear(scope.row[tableItem.prop], scope) : ''"
                    />
                    <!-- input_number -->
                    <el-input-number
                      v-else-if="tableItem.type === 'label_input_number'"
                      :ref="`table_${tableItem.prop}_${scope.$index}`"
                      v-model="scope.row[tableItem.prop]"
                      :precision="tableItem.precision"
                      :step="tableItem.step"
                      :disabled="tableItem.disabled"
                      :max="tableItem.max"
                      :min="tableItem.min || 0"
                      :controls="tableItem.controls"
                      :controls-position="tableItem.controlsPosition || 'right'"
                      :placeholder="tableItem.placeholder ? $t(`${tableItem.placeholder}`):$t('请输入')"
                      :clearable="tableItem.clearable || true"
                      @blur="tableItem.handleBlur?tableItem.handleBlur(scope.row[tableItem.prop], scope): ''"
                    />
                    <!-- input_clearable -->
                    <input-clearable
                      v-else-if="tableItem.type === 'label_input_clearable'"
                      :ref="`table_${tableItem.prop}_${scope.$index}`"
                      v-model="scope.row[tableItem.prop]"
                      :disabled="tableItem.disabled"
                      :placeholder="tableItem.placeholder ? $t(`${tableItem.placeholder}`):$t('请输入')"
                      @clear="tableItem.handleClear ? tableItem.handleClear(scope.row[tableItem.prop], scope) : ''"
                      @click="tableItem.handleClick ? tableItem.handleClick(scope.row[tableItem.prop], scope) : ''"
                    />
                    <!-- select -->
                    <el-select
                      v-else-if="tableItem.type === 'label_select'"
                      :ref="`table_${tableItem.prop}_${scope.$index}`"
                      v-model="scope.row[tableItem.prop]"
                      :placeholder="tableItem.placeholder ? $t(`${tableItem.placeholder}`):$t('请输入')"
                      :clearable="tableItem.clearable || true"
                      :filterable="tableItem.filterable || true"
                      :disabled="tableItem.disabled"
                      @change="tableItem.handleChange?tableItem.handleChange(scope.row[tableItem.prop], scope): ''"
                    >
                      <el-option
                        v-for="(opt,oindex) in tableItem.options"
                        :key="oindex"
                        :label="$t(`${opt[tableItem['labelName'] || 'label'] || opt['subName']}`)"
                        :value="opt[tableItem['labelVal'] || 'value'] || opt['subCode']"
                      />
                    </el-select>
                    <!-- 格式化列 -->
                    <template v-else-if="tableItem.formatter">
                      <span v-html="tableItem.formatter(scope.row, tableItem)" />
                    </template>
                    <!-- render自定义列 -->
                    <template v-else-if="tableItem.render">
                      <expand-dom
                        :column="tableItem"
                        :row="scope.row"
                        :render="tableItem.render"
                        :row-index="scope.$index"
                        :index="tableIndex"
                      />
                    </template>
                    <template v-else>
                      <span>{{ scope.row[tableItem.prop] }}</span>
                    </template>
                  </template>
                </el-table-column>
              </template>
            </el-table>
          </div>
        </div>
      </div>
      <div v-if="btnGroupVisible" class="operate">
        <el-button v-if="cancelBtnVisible" size="small" @click="handleCancel">{{ $t('取消') }}</el-button>
        <el-button v-if="resetBtnVisible" type="primary" plain size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <el-button v-if="saveBtnVisible" type="primary" size="small" :loading="saveBtnLoading" @click="handleSave()">{{ $t(options.saveBtnText ? options.saveBtnText : '保存') }}</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import uploadImg from '@/components/uploadImg'
export default {
  name: 'MyForm',
  // 组件
  components: {
    expandDom: {
      functional: true,
      props: {
        row: Object,
        render: Function,
        index: Number,
        rowIndex: Number,
        column: {
          type: Object,
          default: null
        }
      },
      render: (h, ctx) => {
        const params = {
          row: ctx.props.row,
          index: ctx.props.index,
          rowIndex: ctx.props.rowIndex,
          props: ctx.props
        }
        if (ctx.props.column) params.column = ctx.props.column
        return ctx.props.render(h, params)
      }
    },
    uploadImg
  },
  props: {
    // 控制选项
    options: {
      type: Object,
      default: () => {
        return {
          // 是否滚动表单区域
          isScroller: false,
          // 滚动区域的高度
          scrollHeight: '',
          // 滚动区域最大的高度
          scrollMaxHeight: '',
          // label位置（默认上方对齐）
          labelPosition: 'top',
          // label宽度（默认100px）
          labelWidth: '100px',
          // 响应式布局
          xl: 6,
          lg: 8,
          md: 8,
          sm: 12,
          saveBtnText: '保存'
        }
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    // form表单数据
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 表单校验规则
    rule: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 表单列
    column: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 禁用整个表单（默认不禁用）
    disabled: {
      type: Boolean,
      default: false
    },
    // 每一项高度
    formItemHeight: {
      type: String,
      // default: '60px'
      default: ''
    },
    // 按钮栏
    // 是否显示（默认显示）
    btnGroupVisible: {
      type: Boolean,
      default: true
    },
    // 是否取消按钮（默认显示）
    cancelBtnVisible: {
      type: Boolean,
      default: true
    },
    // 是否保存按钮（默认隐藏）
    resetBtnVisible: {
      type: Boolean,
      default: false
    },
    // 是否保存按钮（默认显示）
    saveBtnVisible: {
      type: Boolean,
      default: true
    },
    // 保存loading状态
    saveBtnLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      langRule: {}
    }
  },
  created() {
    this.getLangRule()
  },
  methods: {
    // 校验规则多语言处理
    getLangRule() {
      const ruleObj = {}
      if (this.rule) {
        Object.keys(this.rule).forEach((key) => {
          let obj
          if (this.rule[key] instanceof Array) {
            obj = this.rule[key].map(it => ({
              ...it,
              message: it.message ? this.$i18n.tc(it.message) : ''
            }))
          } else {
            obj = {
              ...this.rule[key],
              message: this.rule[key].message ? this.$i18n.tc(this.rule[key].message) : ''
            }
          }
          ruleObj[key] = obj
        })
        this.langRule = ruleObj
      }
    },
    // change事件
    handleChange(prop) {
      this.$emit('handleChange', prop, this.formData[prop])
    },
    // clear事件
    handleClear(prop) {
      this.$emit('handleClear', prop, this.formData[prop])
    },
    // blur事件
    handleBlur(prop) {
      this.$emit('handleBlur', prop, this.formData[prop])
    },
    // 取消
    handleCancel() {
      this.$emit('handleCancel')
    },
    // 重置
    handleReset() {
      this.$refs.form.resetFields()
      this.$emit('handleReset')
    },
    // 保存
    handleSave() {
      this.$refs['form'].validate((valid, object) => {
        if (valid) {
          this.$emit('handleSave')
        } else {
          this.scrollView(object)
        }
      })
    },
    // 滚动到固定地方
    scrollView(object) {
      for (const i in object) {
        let dom = this.$refs[i]
        // 这里是针对遍历的情况（多个输入框），取值为数组
        if (Object.prototype.toString.call(dom) !== '[object Object]') {
          dom = dom[0]
        }
        // 第一种方法（包含动画效果）
        dom.$el.scrollIntoView({ // 滚动到指定节点
          // 值有start,center,end，nearest，当前显示在视图区域中间
          block: 'center',
          // 值有auto、instant,smooth，缓动动画（当前是慢速的）
          behavior: 'smooth'
        })
        break // 因为我们只需要检测一项,所以就可以跳出循环了
      }
    },
    // 清除校验信息
    clearValidate(props) {
      this.$refs.form.clearValidate(props)
    }
  }
}
</script>

<style lang="scss">
#my_form {
  background: white;
  padding-bottom: 40px;
    .el-cascader,
    .el-date-editor,
    .el-input-number,
    .el-select {
        width: 100%;
    }
    .el-input-number .el-input__inner {
      text-align: left;
    }
    .el-form-item__label{
      width: 100%;
      text-align: left;
    }
    .el-form--label-top .el-form-item__label {
      padding-bottom: 0;
    }
    .el-form-item--mini.el-form-item {
        margin-bottom: 0;
        min-height: 58px;
    }
  .formUpload {
    display: flex;
    flex-wrap: nowrap;
    box-sizing: border-box;
    .el-input {
      width: auto;
    }
    .operateBtn {
      margin-left: 10px;
    }
  }
  .operate {
    display: flex;
    justify-content: center;
    position: absolute;
    width: 100%;
    bottom: 0;
    padding: 10px 0;
    background-color: #ffffff;
    left: 0;
  }
  .imgReview{
    width: 100%;
  }
  .block {
    position: relative;
    margin-bottom: 15px;
    &.border {
        border: 1px dashed #d2d6de;
        padding: 20px 20px 10px;
        margin-bottom: 20px;
    }
    .header {
        position: absolute;
        background-color: #ffffff;
        z-index: 10;
        top: -26px;
        left: 10px;
        font-size: 15px;
        padding: 0 10px 5px;
        color: #333;
    }
  }
  .right-btn {
    position: absolute;
    right: 20px;
    top: 0;
  }
  .form-scroller {
    overflow-y: auto;
    overflow-x: hidden;
    padding-top: 10px;
    position: relative;
    padding-right: 5px;
    &::-webkit-scrollbar{
        width:5px;
        background-color:transparent;
    }
    &::-webkit-scrollbar-thumb{
        background:#ddd;
    }
  }
  .el-table th {
    background-color: #eff3f8;
    border-bottom: 1px solid #ccc;
  }
  .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed  {
    border-color: #e4e8f3;
  }
  .el-input-number.is-controls-right .el-input__inner{
    padding-right: 0;
  }
  .el-col{
    margin-bottom: 8px !important;
  }
}
</style>
