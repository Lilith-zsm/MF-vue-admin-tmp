<template>
  <div>
    <base-dialog
      :close-on-click-modal="false"
      :title="$t('公告查看')"
      :is-minus-full="true"
      :visible.sync="innerVisible"
      width="55%"
    >
      <div class="titleText">{{ $t('主题：') }}{{ form.title }}</div>
      <div>
        <el-row class="subtitle">
          <el-col :span="20">{{ $t('发表人：') }}{{ form.createByName }}</el-col>
        </el-row>
        <el-row class="subtitle">
          <el-col :span="20">{{ $t('发表时间：') }}{{ createTime }}</el-col>
        </el-row>
        <el-row class="subtitle">
          <el-col :span="20">{{ $t('附件：') }}{{ form.enclosureName ? null : '无' }}<el-link v-if="form.enclosureName" type="primary" style="margin-bottom: 3px;" @click="onAnnex">{{ form.enclosureName }}</el-link></el-col>
        </el-row>
        <el-row class="subtitle">
          <el-col :span="20">{{ $t('公告内容：') }}
            <div class="subtitle">
              <el-input
                v-model="form.mesContent"
                type="textarea"
                disabled
                :rows="10"
              />
            </div>
          </el-col>
        </el-row>
      </div>
    </base-dialog>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  props: {
    form: {
      type: Object,
      default: null
    },
    visible: {
      type: Boolean
    }
  },
  data() {
    return {
      textarea: '',
      createTime: ''
    }
  },
  computed: {
    innerVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  mounted() {
    console.log(this.$props.form)
    this.createTime = this.$props.form.createTime ? moment(this.$props.form.createTime).format('YYYY-MM-DD HH:mm:ss') : ''
  },
  methods: {
    onAnnex() {
      this.$Utils.exportFile(this.$props.form.enclosureName, this.$props.form.enclosure)
    }
  }
}
</script>
<style lang='scss' scoped>
  .titleText {
    text-align: center;
    font-size: 15px;
  }
  .subtitle {
    margin: 10px 0 0 0;
    padding-bottom: 10px;
  }
</style>
